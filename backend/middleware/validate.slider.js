import { body, validationResult } from "express-validator";

const validateSlider = [
  body("*.title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters"),

  body("*.description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must be less than 200 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateSlider;
