const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressErrors = require("./utils/ExpressErrors");
const Listing = require("./models/listing");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

// Importing routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// created sessionOptions
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions)); // use sessionOptions
app.use(flash()); // using flash

// passport configuration (after session setup)
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash message
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // flash for success
  res.locals.error = req.flash("error"); // flash for error
  res.locals.currUser = req.user || null;
  next();
});

app.get(
  "/",
  wrapAsync(async (req, res) => {
    const counts = await Listing.countDocuments();
    res.render("listings/home.ejs", { counts });
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/user", userRouter);

// Catch-all route for non-existent pages (must be after all other routes)
app.use((req, res, next) => {
  next(new ExpressErrors(404, "Page not found"));
});

// error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Internal server error" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

const port = 8080;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
