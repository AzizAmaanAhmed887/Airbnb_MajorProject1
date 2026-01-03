const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access params from parent router
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../joiSchema.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// MVC short route for listing
const listingController = require("../controller/listings.js")


// router.route() -> root -> "/"
router.route("/")
  .get(
    // Index route (displays all listings)
    wrapAsync(listingController.index)
  )
  .post( // Create listing route
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
  )

// New route - MUST be before /:id routes
router.get("/new", isLoggedIn, listingController.renderNewForm);

// router.route() -> '/:id'
router.route("/:id")
  .put( // Update listing
    isLoggedIn, isOwner,
    validateListing,
    wrapAsync(listingController.editListing)
  )
  .get( // Show Route
    wrapAsync(listingController.showListing)
  )
  .delete( // Delete listing route
    isLoggedIn, isOwner,
    wrapAsync(listingController.destroyListing) // industry preferred name for 'delete' = destroy
  )

// Edit listing route
router.get(
  "/:id/edit", isLoggedIn, isOwner,
  wrapAsync(listingController.renderEditListing)
);

module.exports = router;
