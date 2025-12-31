const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access params from parent router
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../joiSchema.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


const listingController = require("../controller/listings.js")
// Index route (displays all listings)
router.get(
  "/",
  wrapAsync(listingController.index)
);

// New route - MUST be before /:id routes
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create listing route
router.post(
  "/", isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);

// Edit listing route
router.get(
  "/:id/edit", isLoggedIn, isOwner,
  wrapAsync(listingController.renderEditListing)
);

// Update listing
router.put(
  "/:id", isLoggedIn, isOwner,
  validateListing,
  wrapAsync(listingController.editListing)
);

// Show Route
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);

// Delete listing route
router.delete(
  "/:id", isLoggedIn, isOwner,
  wrapAsync(listingController.destroyListing) // industry preferred name for 'delete' = destroy
);

module.exports = router;
