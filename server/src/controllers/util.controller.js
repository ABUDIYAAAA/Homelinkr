import axios from "axios";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

export const getAddressSuggestions = async (req, res) => {
  try {
    const { query, latitude, longitude } = req.query;

    if (!query || query.trim().length < 2) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Query too short", { suggestions: [] }));
    }

    const olaApiKey = process.env.OLA_MAPS_API_KEY;
    if (!olaApiKey) {
      console.error("OLA Maps API key not configured");
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            { suggestions: [] },
            "Address service unavailable"
          )
        );
    }

    const params = {
      input: query.trim(),
      api_key: olaApiKey,
    };

    if (latitude && longitude) {
      params.location = `${latitude},${longitude}`;
    }

    const response = await axios.get(
      "https://api.olamaps.io/places/v1/autocomplete",
      {
        params,
        headers: {
          "X-Request-Id": `autocomplete-${Date.now()}`,
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );

    const predictions = response.data?.predictions || [];
    const suggestions = predictions.slice(0, 5).map((prediction) => {
      return {
        place_id: prediction.place_id,
        description: prediction.description,
        main_text:
          prediction.structured_formatting?.main_text || prediction.description,
        secondary_text: prediction.structured_formatting?.secondary_text || "",
        types: prediction.types || [],
        structured_formatting: prediction.structured_formatting || null,
      };
    });

    return res.status(200).json(new ApiResponse(200, "Success", suggestions));
  } catch (error) {
    console.error("Address autocomplete error:", error);

    return res
      .status(200)
      .json(
        new ApiResponse(200, "No suggestions available", { suggestions: [] })
      );
  }
};

export const getPlaceDetails = async (req, res) => {
  try {
    const { place_id } = req.params;

    if (!place_id) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Place ID is required"));
    }

    const olaApiKey = process.env.OLA_MAPS_API_KEY;
    if (!olaApiKey) {
      throw new ApiError(500, "OLA Maps API key not configured");
    }

    const response = await axios.get(
      "https://api.olamaps.io/places/v1/details",
      {
        params: {
          place_id: place_id,
          api_key: olaApiKey,
        },
        headers: {
          "X-Request-Id": `details-${Date.now()}`,
        },
        timeout: 5000,
      }
    );

    if (response.data && response.data.result) {
      const placeDetails = {
        place_id: response.data.result.place_id,
        formatted_address: response.data.result.formatted_address,
        name: response.data.result.name,
        geometry: response.data.result.geometry,
        address_components: response.data.result.address_components || [],
      };

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            placeDetails,
            "Place details retrieved successfully"
          )
        );
    } else {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Place not found"));
    }
  } catch (error) {
    console.error("Place details error:", error);

    if (error.response?.status === 404) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Place not found"));
    }

    if (error.response?.status === 429) {
      return res
        .status(429)
        .json(
          new ApiResponse(
            429,
            null,
            "Too many requests. Please try again later."
          )
        );
    }

    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch place details"));
  }
};
