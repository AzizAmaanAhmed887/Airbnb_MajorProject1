const Listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    if (allListings.length === 0) {
        throw new ExpressErrors(404, "No listings found");
    }
    res.render("listings/index.ejs", { allListings: allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing: listing });
}

module.exports.createListing = async (req, res) => {
    let listing = req.body.listing;
    if (
        !listing.image ||
        !listing.image.url ||
        listing.image.url.trim() === ""
    ) {
        delete listing.image;
    }
    const newListing = new Listing(listing);
    console.log(req.user)
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Listing Created Successfully!");
    res.redirect(`/listings`);
}

module.exports.renderEditListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressErrors(404, "Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.editListing = async (req, res) => {
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
}

module.exports.deleteListing = async (req, res, next) => {
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
}