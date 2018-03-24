const router = require("express").Router();


router.get("/", (req, res) => {
  res.end("Refer to documentation for the APIs");
});

module.exports = router;