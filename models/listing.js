const mongoose = require("mongoose");
const Review = require("./reviews.js");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title cannot be empty"],
      trim: true,
      maxLength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description cannot be empty"],
      trim: true,
      minLength: [10, "Description must be at least 10 characters"],
      maxLength: [1000, "Description cannot be more than 1000 characters"],
    },
    // The image field is an object containing image metadata.
    // Currently supports 'filename' and 'url'. Add more properties as needed in the future.
    image: {
      filename: {
        type: String,
        default: "default.jpg",
      },
      url: {
        type: String,
        default:
          "https://imgs.search.brave.com/YMrxvLPph3CGyKmNFV2QRopM1Srot1QXztFsSfxobx4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTEw/MjI0ODg2L3Bob3Rv/L2NoYWxldC1tb3Vu/dGFpbi1ob3VzZXMu/d2VicD9hPTEmYj0x/JnM9NjEyeDYxMiZ3/PTAmaz0yMCZjPUcx/WElpY3c5cHgxZDZ6/dXI2dlJuUEZiU1Fu/ZXF3NkgxQUk2UkVf/cGtjcEk9",
        validate: {
          validator: function (v) {
            // Basic URL validation
            return !v || /^https?:\/\/.+\..+/.test(v);
          },
          message: "Please enter a valid URL for the image",
        },
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [1000000, "Price cannot exceed 1,000,000"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// adding mongoose middleware to delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  }
});

// Add an index for better search performance
listingSchema.index({ location: 1 });
listingSchema.index({ country: 1 });

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
