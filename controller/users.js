const User = require("../models/user.js")

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res, next) => {
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "you are loggedIn!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err)
            return next(err)

        req.flash("success", "You loggedOut!")
        res.redirect("/listings")
    })
}