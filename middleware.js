const Listing = require("./models/listing");
const Review = require("./models/reviews")
const ExpressErrors = require("./utils/ExpressErrors.js");
const { listingSchema, reviewSchema } = require("./joiSchema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "you must be logged in to create a listing")
        return res.redirect("/user/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    let listing1 = await Listing.findById(id)
    if (!res.locals.currUser || !listing1.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you're not the owner of listing")
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.validateListing = (req, res, next) => {
    console.log("=== VALIDATION DEBUG ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressErrors(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressErrors(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    let review = await Review.findById(reviewId)
    if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you're not the author of review")
        return res.redirect(`/listings/${id}`);
    }

    next();
}
