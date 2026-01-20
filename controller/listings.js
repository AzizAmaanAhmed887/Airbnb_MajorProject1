const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const ExpressErrors = require("../utils/ExpressErrors.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  if (allListings.length === 0) {
    throw new ExpressErrors(404, "No listings found");
  }
  res.render("listings/index.ejs", { allListings: allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..", filename);

  let listing = req.body.listing;
  if (!listing.image || !listing.image.url || listing.image.url.trim() === "") {
    delete listing.image;
  }

  // Build geometry from latitude and longitude
  listing.geometry = {
    type: "Point",
    coordinates: [parseFloat(listing.longitude), parseFloat(listing.latitude)]
  };
  delete listing.latitude;
  delete listing.longitude;

  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  await newListing.save();
  req.flash("success", "Listing Created Successfully!");
  res.redirect(`/listings`);
};

module.exports.renderEditListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressErrors(404, "Listing not found");
  }

  // Cloudinary Image Transformation Note:
  // This project uses Cloudinary for image storage and transformation.
  // The original image URL from Cloudinary is transformed by replacing "/upload" with "/upload/w_250"
  // This applies a width transformation of 250px to optimize image loading in the edit form.
  // Cloudinary transformations allow dynamic image resizing, cropping, and optimization on-the-fly.
  // Example: https://res.cloudinary.com/.../upload/w_250/image.jpg
  // Other transformations can be added like: /upload/w_250,h_200,c_fill/ for width, height, and crop.
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); // Adjust width to 200px
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;

  // Build geometry from latitude and longitude
  req.body.listing.geometry = {
    type: "Point",
    coordinates: [parseFloat(req.body.listing.longitude), parseFloat(req.body.listing.latitude)]
  };
  delete req.body.listing.latitude;
  delete req.body.listing.longitude;

  const listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing, // Changed from req.body to req.body.listing
    { new: true } // This returns the updated document
  );

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save(); // re- save it
  }
  // if (!listing) {
  //     req.flash("error", "Listing you requested to edit does not exist!");
  //     return res.redirect("/listings");
  // }
  req.flash("success", "Listing Updated Successfully!");
  console.log(listing);
  res.redirect(`/listings/${listing._id}`);
};

// industry preferred name for 'delete' = destroy
module.exports.destroyListing = async (req, res, next) => {
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
};
