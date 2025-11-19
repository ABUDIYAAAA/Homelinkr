import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "morgan";
import cookieParser from "cookie-parser";
import { router as authRouter } from "./src/routes/auth.route.js";
import { router as propRouter } from "./src/routes/property.controller.js";
import { router as utilRouter } from "./src/routes/util.route.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRouter);
app.use("/listings", propRouter);
app.use("/utils", utilRouter);
app.get("/", (req, res) => {
  res.send("API is running........");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
