import Slider from "../models/slider.model.js";

// Create or update slider item
export async function createOrUpdateSlider(req, res) {
  try {
    const sliders = Array.isArray(req.body) ? req.body : [req.body];

    const updatedSliders = await Promise.all(
      sliders.map(async (sliderItem, index) => {
        const { title, description } = sliderItem;
        const order = index + 1;

        return await Slider.findOneAndUpdate(
          { order },
          { title, description, order },
          { new: true, upsert: true }
        );
      })
    );

    res.status(200).json(updatedSliders);
  } catch (err) {
    console.error("Failed to save slider item:", err);
    res.status(500).json({ error: "Failed to save slider items." });
  }
}

// Get all slider items
export async function getSliders(req, res) {
  try {
    const sliders = await Slider.find().sort({ order: 1 });
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slider items." });
  }
}

// Get slider by order
export async function getSliderByOrder(req, res) {
  try {
    const slider = await Slider.findOne({ order: req.params.order });
    if (!slider) {
      return res.status(404).json({ error: "Slider item not found." });
    }
    res.json(slider);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slider item." });
  }
}

// Delete slider by order
export async function deleteSlider(req, res) {
  try {
    const deleted = await Slider.findOneAndDelete({ order: req.params.order });
    if (!deleted) {
      return res.status(404).json({ error: "Slider item not found." });
    }
    res.json({ message: "Slider item deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete slider item." });
  }
}