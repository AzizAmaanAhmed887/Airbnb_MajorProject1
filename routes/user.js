const express = require("express");
const router = express.Router(); // mergeParams to access params from parent router
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// ...existing code...
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      // console.log("signup body:", req.body);
      const data = req.body.user || req.body; // <-- support both shapes
      const { email, username, password } = data;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);

      req.login(registeredUser, function (err) {
        if (err) { return next(err); }
        req.flash("success", "Welcome to Wanderlust!");
        return res.redirect("/listings");
      });

    } catch (err) {
      console.error("Signup error:", err);
      req.flash("error", err.message || "Failed to generate account");
      return res.redirect("/user/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    // successRedirect: "/listings",
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "you are loggedIn!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }
);

router.get('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err)
      return next(err)

    req.flash("success", "You loggedOut!")
    res.redirect("/listings")
  })
})

module.exports = router;
