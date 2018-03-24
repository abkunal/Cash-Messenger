const router = require("express").Router();
const User = require("../models/user");
const Message = require("../models/message");


router.post("/", (req, res) => {
  // if user is not logged in, show error
  if (!req.user) {
    res.json({
      error: "You must be logged in to perform this action"
    })
  } else {
    let subject = req.body.subject;
    let content = req.body.content;
    let receiver = req.body.receiver;

    req.checkBody("subject", "Subject cannot be empty").notEmpty();
    req.checkBody("content", "Content cannot be empty").notEmpty();
    req.checkBody("receiver", "Receiver username cannot be empty").notEmpty();

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        let errors = result.array().map(function (elem) {
          return ' ' + elem.msg;
        });

        res.json({
          errors: errors
        });
      } else if (receiver === req.user.username) {
        res.json({
          error: "You cannot send message to yourself"
        })
      } else {
        User.getUser(receiver, (err, user) => {
          if (err) throw err;

          // if receiver username doesn't exist in the database
          if (!user) {
            res.json({
              error: "No receiver with the given username exist."
            });
          } else {
            // add message to the database
            let newMessage = new Message({
              subject: subject,
              content: content,
              from: req.user.username,
              to: receiver,
              time: new Date()
            });

            Message.addMessage(newMessage, (err, msg) => {
              if (err) throw err;

              res.json({
                success: "Message sent"
              });
            });
          }
        });
      }
    });
  }
});

module.exports = router;