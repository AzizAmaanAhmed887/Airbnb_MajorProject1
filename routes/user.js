const express = require("express");
const router = express.Router(); // mergeParams to access params from parent router
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// MVC FUNCTIONALITY
const userController = require("../controller/users.js")

// router.route()
router.route("/signup")
  .get(userController.renderSignUpForm)
  .post(
    wrapAsync(userController.signUp)
  )

router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      // successRedirect: "/listings",
      failureRedirect: "/user/login",
      failureFlash: true,
    }),
    userController.login
  )

router.get('/logout', userController.logout)

module.exports = router;
