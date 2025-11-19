import express from "express";
import {
  getAddressSuggestions,
  getPlaceDetails,
} from "../controllers/util.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Address autocomplete - requires authentication
router.get("/address/autocomplete", requireAuth, getAddressSuggestions);

// Place details - requires authentication
router.get("/address/details/:place_id", requireAuth, getPlaceDetails);

export { router };
