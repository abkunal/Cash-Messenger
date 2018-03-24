/*  User's Schema and operations on user's schema

 */
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

let UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    index: true
  },
  password: String,
  firstName: String,
  lastName: String
});

let User = module.exports = mongoose.model("User", UserSchema);

/*  Register's a new user

    newUser: User
 */
module.exports.registerUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;

      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

/*  Get user's information with the given username

    username: String
 */
module.exports.getUser = (username, callback) => {
  User.findOne({username: username}, callback);
}

/*  Compare password hashes for authentication

    candidatePassword: String
    hash: String
 */
module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}