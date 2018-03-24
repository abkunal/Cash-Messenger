const router = require("express").Router();
const User = require("../models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");


// login form submitted, handle authetication
router.post("/", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
});


// using passport module for handling local authentication
passport.use(new LocalStrategy({
    usernameField: 'username',       // username field name is username
    passwordField: 'password'     // password field name is password
  },
  function(username, password, done) {
    User.getUser(username, function(err, user) {
      if (err) throw err;

      // user with given username doesn't exist, show error
      if (!user) {
        return done(null, false, {error: "Unknown User"});
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        // correct password, authorize
        if (isMatch) {
          return done(null, user);
        }
        // incorrect password, show error
        else {
          return done(null, false, {error: "Invalid Password"});
        }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  User.getUser(username, function(err, user) {
    done(err, user);
  });
});

module.exports = router;