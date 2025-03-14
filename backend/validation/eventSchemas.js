import Joi from "joi";

export const eventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
  location: Joi.string().required(),
  category: Joi.string()
    .valid(
      "Music",
      "Workshop",
      "Sports",
      "Food",
      "Tech",
      "Fun-Games",
      "Church",
      "General Gathering"
    )
    .required(),
  price: Joi.number().min(0).required(),
  image: Joi.string().uri(),
});

export const updateEventSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  date: Joi.date(),
  location: Joi.string(),
  category: Joi.string().valid(
    "Music",
    "Workshop",
    "Sports",
    "Food",
    "Tech",
    "Fun-Games",
    "Church",
    "General Gathering"
  ),
  price: Joi.number().min(0),
  image: Joi.string().uri(),
}).min(1);
