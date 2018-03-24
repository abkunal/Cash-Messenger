const router = require("express").Router();
const User = require("../models/user");


router.put("/:username", (req, res) => {
  if (!req.user) {
    res.json({
      error: "You must be logged in to perform this action"
    });
  } else {
    let username = req.params.username;

    if (username === "") {
      res.json({
        error: "Username cannot be empty"
      });
    } else if (username === req.user.username) {
      res.json({
        error: "You cannot block yourself"
      });
    } else {
      User.getUser(username, (err, user) => {
        if (err) throw err;

        // if user with the given username doesn't exist, show error
        if (!user) {
          res.json({
            error: "User with the given username doesn't exist"
          });
        } else {
          // block user if not already blocked
          if (req.user.blockedUsers.indexOf(username) !== -1) {
            res.json({
              msg: "You have already blocked this user"
            });
          } else {
            User.blockUser(req.user.username, username, (err, msg) => {
              if (err) throw err;

              res.json({
                success: "User successfully blocked"
              });
            });
          }
        }
      });
    }
  }
});

module.exports = router;