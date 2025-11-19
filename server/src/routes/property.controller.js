import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createListing,
  viewListing,
  viewListings,
} from "../controllers/property.controller.js";
import {
  handlePropertyUpload,
  validatePropertyUpload,
} from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  handlePropertyUpload,
  validatePropertyUpload,
  createListing
);
router.get("/", viewListings);
router.get("/:id", viewListing);

export { router };
