const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      image: joi
        .object({
          url: joi.string(),
          filename: joi.string().default("listingimage"),
        })
        .allow(null, "")
        .optional(), // make entire image object optional
      price: joi.number().min(0).max(1000000).required(),
      location: joi.string().required(),
      country: joi.string().required(),
      createdAt: joi.date().default(Date.now),
    })
    .required(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().min(1).max(5).required(),
      comment: joi.string().required(),
    })
    .required(),
});
