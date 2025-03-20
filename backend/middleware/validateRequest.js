import { BadRequestError } from "../utils/errors.js";

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((err) => err.message) });
  }
  next();
};

export default validateRequest;
