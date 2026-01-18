const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access params from parent router
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../joiSchema.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// MVC short route for listing
const listingController = require("../controller/listings.js")
// requiring cloudinary, storage from cloudConfig.js
const { storage } = require("../cloudConfig.js")
// multer package
const multer = require('multer')

const upload = multer({ storage })


router.route("/")
  .get( // Index route (displays all listings)
    wrapAsync(listingController.index)
  )
  .post( // Create listing route
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  )

// New route - MUST be before /:id routes
router.get("/new", isLoggedIn, listingController.renderNewForm);

// router.route() -> '/:id'
router.route("/:id")
  .put( // Update listing
    isLoggedIn,
    upload.single('listing[image]'),
    isOwner,
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
