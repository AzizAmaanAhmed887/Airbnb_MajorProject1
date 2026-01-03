const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    // Find the listing by ID
    let listings = await Listing.findById(req.params.id);

    if (!listing) throw new ExpressErrors(404, "Listing not found");

    let review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    req.flash("success", "New review Created"); // flash successfull creation of review

    review.author = req.user._id
    // console.log(review)

    listing.reviews.push(review._id); // Associate the review with the listing
    await listing.save(); // Save both the listing and the review

    // Redirect back to the listing's show page
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
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
}