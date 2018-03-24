/*  Message Schema and operations on message schema

 */

const mongoose = require("mongoose");


let MessageSchema = mongoose.Schema({
  subject: String,
  content: String,
  from: String,
  to: String,
  time: String
});

let Message = module.exports = mongoose.model("Message", MessageSchema);

/*  Add a new message into the database

    newMessage: Message
 */
module.exports.addMessage = (newMessage, callback) => {
  newMessage.save(callback);
}