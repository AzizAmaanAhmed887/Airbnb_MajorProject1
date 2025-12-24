const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access params from parent router  

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../joiSchema.js");
const Review = require("../models/reviews.js");
const { validateReview } = require("../middleware.js")


// Create review route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    // Find the listing by ID
    let listing = await Listing.findById(req.params.id);

    if (!listing) throw new ExpressErrors(404, "Listing not found");

    let review = new Review(req.body.review);
    await review.save();
    req.flash("success", "New review Created"); // flash successfull creation of review

    listing.reviews.push(review._id); // Associate the review with the listing
    await listing.save(); // Save both the listing and the review

    console.log("new review added");
    // Redirect back to the listing's show page
    res.redirect(`/listings/${listing._id}`);
  })
);

// REVIEW DELETE ROUTE
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    console.log("=== DELETE REVIEW DEBUG ===");
    console.log("Full params:", req.params);
    console.log("Listing ID:", req.params.id);
    console.log("Review ID:", req.params.reviewId);
    console.log("=========================");

    const { id, reviewId } = req.params;

    // Remove the review from the Listing's reviews array
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    // Delete the review document
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully"); // flash successfully deletion of review
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
