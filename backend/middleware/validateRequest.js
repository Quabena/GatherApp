import { Schema } from "mongoose";
import { BadRequestError } from "../utils/errors.js";

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }
  next();
};

export default validateRequest;
