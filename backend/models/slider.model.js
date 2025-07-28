import mongoose from "mongoose";
import { Schema } from "mongoose";

const sliderSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    order: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Slider", sliderSchema);