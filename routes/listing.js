const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access params from parent router

const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../joiSchema.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");

const validateListing = (req, res, next) => {
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
// all listing routes
// Index route (displays all listings)
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    if (allListings.length === 0) {
      throw new ExpressErrors(404, "No listings found");
    }
    res.render("listings/index.ejs", { allListings: allListings });
  })
);

// New route - MUST be before /:id routes
router.get("/new", (req, res) => {
  if(!req.isAuthenticated()){
    req.flash("error", "you must be logged in to create a listing")
    return res.redirect("/user/login")
  }
  res.render("listings/new.ejs");
});

// Create listing route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    let listing = req.body.listing;
    if (
      !listing.image ||
      !listing.image.url ||
      listing.image.url.trim() === ""
    ) {
      delete listing.image;
    }
    const newListing = new Listing(listing);
    await newListing.save();
    req.flash("success", "Listing Created Successfully!");
    res.redirect(`/listings`);
  })
);

// Edit listing route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressErrors(404, "Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update listing
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    // Handle image if it's an empty string
    if (req.body.listing.image && req.body.listing.image.url === "") {
      delete req.body.listing.image;
    }

    const listing = await Listing.findByIdAndUpdate(
      id,
      req.body.listing, // Changed from req.body to req.body.listing
      { new: true } // This returns the updated document
    );
    if (!listing) {
      req.flash("error", "Listing you requested to edit does not exist!");
      return res.redirect("/listings");
    }
    req.flash("success", "Listing Updated Successfully!");
    console.log(listing);
    res.redirect(`/listings/${listing._id}`);
  })
);

// Show listing route (add this to listing.js, before the delete route)
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing: listing });
  })
);

// Delete listing route
router.delete(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressErrors(400, "Invalid listing ID format"));
    }
    try {
      const deletedListing = await Listing.findByIdAndDelete(id);
      req.flash("success", "Listing Deleted Successfully!"); // flash successfull deletion of listing
      console.log(deletedListing);
      res.redirect("/listings");
    } catch (err) {
      next(err);
    }
  })
);

module.exports = router;
