const router = require("express").Router();
const User = require("../models/user");

router.post("/", (req, res) => {
  // if user is logged in
  if (!req.user) {
    let username = req.body.username;
    let password = req.body.password;
    let firstName = req.body.firstname;
    let lastName = req.body.lastname;

    // validate provided parameters
    req.checkBody("username", "Username cannot be empty").notEmpty();
    req.checkBody("password", "Password cannot be empty").notEmpty();
    req.checkBody("firstname", "First Name cannot be empty").notEmpty();
    req.checkBody("lastname", "Last Name cannot be empty").notEmpty();


    req.getValidationResult().then((result) => {
      // if errors are found, send them
      if (!result.isEmpty()) {
        let errors = result.array().map(function (elem) {
          return ' ' + elem.msg;
        });

        res.json({
          errors: errors
        });
      } else {
        User.getUser(username, (err, user) => {
          if (err) throw err;

          // if user with the given username doesn't exist, register user
          if (!user) {
            let newUser = new User({
              username: username,
              password: password,
              firstName: firstName,
              lastName: lastName
            });

            User.registerUser(newUser, (err, msg) => {
              if (err) throw err;

              res.json({
                success: "You have been successfully registered"
              });
            });
          } else {
            res.json({
              error: "A user with the given username already exists"
            });
          }
        });
      }
    });
  }
});


module.exports = router;