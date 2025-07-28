import { Router } from "express";
const sliderRoutes = Router();
import {
  createOrUpdateSlider,
  getSliders,
  getSliderByOrder,
  deleteSlider
} from "../controllers/slider.controller.js";
import validateSlider from "../middleware/validate.slider.js";

// Create or update slider item
sliderRoutes.post("/", validateSlider, createOrUpdateSlider);

// Get all slider items
sliderRoutes.get("/", getSliders);

export default sliderRoutes;