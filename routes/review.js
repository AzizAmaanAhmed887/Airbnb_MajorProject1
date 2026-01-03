const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access params from parent router  

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../joiSchema.js");
const Review = require("../models/reviews.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")

// MVC short route for review 
const reviewController = require("../controller/reviews.js")

// Create review route
router.post(
  "/", isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// REVIEW DELETE ROUTE
router.delete(
  "/:reviewId",
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
