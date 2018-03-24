const router = require("express").Router();


router.get("/", (req, res) => {
  if (req.user) {
    res.json({
      loginStatus: true,
      msg: "Refer to documentation for the APIs"
    });
  } else {
    res.json({
      loginStatus: false,
      msg: "Refer to documentation for the APIs"
    });
  }
});


router.get("/logout", (req, res) => {
  // if user logged in, logout the user
  if (req.user) {
    req.logout();
  }

  res.redirect("/");
});

module.exports = router;