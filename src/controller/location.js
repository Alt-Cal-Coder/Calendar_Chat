import { extractAddress } from '../helpers/common.js';
import { logger } from '../helpers/logger.js';

export const getAddressOptions = async (req, res) => {
  try {
    const API_KEY = process.env.GOOGLE_MAP_API_KEY;
    const searchKeyword = req.query.searchKeyword || "";
    const { lat, lng } = req.query;

    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchKeyword}&key=${API_KEY}`;

    if (lat && lng) {
      url += `&location=${lat},${lng}&radius=5000`; // 5km radius for better local results
    }

    const predictions = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const predictionsJSON = await predictions.json();
    const predictionsArray = predictionsJSON?.predictions || [];

    const newPredictionsArray = predictionsArray.map((prediction) => ({
      description: prediction.description,
      place_id: prediction.place_id,
    }));

    return res.status(200).json({
      success: true,
      data: newPredictionsArray,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getAddressDetails = async (req, res) => {
  try {
    const API_KEY = process.env.GOOGLE_MAP_API_KEY;
    const placeId = req.params.placeId;

    if (!placeId) {
      return res.status(400).json({
        success: false,
        message: "Place ID is missing",
        data: [],
      });
    }

    const address = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );

    const addressJSON = await address.json();

    return res.status(200).json({
      success: true,
      data: extractAddress(addressJSON),
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Something went wrong",
    });
  }
};
