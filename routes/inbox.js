const router = require("express").Router();
const Message = require("../models/message");


router.get("/", (req, res) => {
  if (!req.user) {
    res.json({
      error: "You must be logged in to perform this action"
    });
  } else {
    Message.getAllMessagesSentToUser(req.user.username, (err, messages) => {
      if (err) throw err;

      res.send(JSON.stringify(messages));
    });
  }
});

module.exports = router;