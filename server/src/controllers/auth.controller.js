import prisma from "../utils/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { OAuth2Client } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { generateToken, tokenCookieOptions } from "../utils/jwt.js";
import { ApiResponse } from "../utils/api-response.js";
import bcrypt from "bcryptjs";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

// Redirect user to Google OAuth consent page
export const redirectToGoogle = async (req, res, next) => {
  try {
    const state = uuidv4();
    res.cookie("oauth_state", state, {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
      state,
    });

    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    );
  } catch (err) {
    next(new ApiError(500, [], err.message));
  }
};

// Handle Google OAuth callback
export const handleGoogleCallback = async (req, res, next) => {
  try {
    const { code, state } = req.query;
    const savedState = req.cookies?.oauth_state;

    if (!state || !savedState || state !== savedState) {
      return next(new ApiError(400, [], "Invalid state parameter"));
    }

    // Exchange code for tokens using Axios
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { id_token, refresh_token } = tokenResponse.data;

    // Verify id_token
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Upsert user in DB
    const user = await prisma.user.upsert({
      where: { email: payload.email },
      update: {
        name: payload.name,
        image: payload.picture,
        googleId: payload.sub,
        emailVerified: payload.email_verified === true,
      },
      create: {
        email: payload.email,
        name: payload.name,
        image: payload.picture,
        googleId: payload.sub,
        emailVerified: payload.email_verified === true,
      },
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Set token in cookie
    res.cookie("token", token, tokenCookieOptions);

    res.clearCookie("oauth_state");

    res.redirect(process.env.FRONTEND_URL);
  } catch (err) {
    console.log(err);
    next(new ApiError(500, [], err.message || "Google OAuth failed"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    // req.user is set by the auth middleware
    const user = req.user;

    res.status(200).json(
      new ApiResponse(200, "User fetched successfully", {
        user: {
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        },
      })
    );
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, [], "Please provide email and password."));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return next(new ApiError(401, [], "Invalid email or password."));
    }

    if (user.googleId && !user.password) {
      return next(
        new ApiError(
          403,
          [],
          "This account was registered via Google. Please log in using Google OAuth."
        )
      );
    }

    if (!user.password) {
      return next(new ApiError(401, [], "Invalid email or password."));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return next(new ApiError(401, [], "Invalid email or password."));
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.cookie("token", token, tokenCookieOptions);

    const responseUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      emailVerified: user.emailVerified,
      googleId: user.googleId,
    };

    res.status(200).json(
      new ApiResponse(200, "Login successful", {
        user: responseUser,
      })
    );
  } catch (err) {
    console.log(err);
    next(new ApiError(500, [], err.message || "Login failed"));
  }
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, [], "Please provide email and password."));
    }
    if (password.length < 8) {
      return next(
        new ApiError(400, [], "Password must be at least 8 characters.")
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.googleId && !existingUser.password) {
        return next(
          new ApiError(
            409,
            [],
            "An account exists for this email via Google. Please use Google OAuth to sign in."
          )
        );
      }

      return next(
        new ApiError(409, [], "User with this email already exists.")
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,

        emailVerified: false,
      },
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    res.cookie("token", token, tokenCookieOptions);

    const responseUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      image: newUser.image,
      emailVerified: newUser.emailVerified,
      googleId: newUser.googleId,
    };

    res.status(201).json(
      new ApiResponse(201, "User registered successfully", {
        user: responseUser,
      })
    );
  } catch (err) {
    console.log(err);
    next(new ApiError(500, [], err.message || "Signup failed"));
  }
};

export const logout = async (req, res, next) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json(new ApiResponse(200, "Logged out successfully", null));
  } catch (err) {
    console.log(err);
    next(new ApiError(500, [], err.message));
  }
};
