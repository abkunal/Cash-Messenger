const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');
const RedisStore = require('connect-redis')(session);

mongoose.connect("mongodb://localhost/cash-messenger");
const db = mongoose.connection;

const index = require("./routes/index");
const register = require("./routes/register");
const login = require("./routes/login");
const inbox = require("./routes/inbox");
const sendMessage = require("./routes/sendMessage");

// Init App
let app = express();

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


// Express Session
app.use(session( {
  store: new RedisStore(
    {
      host: '127.0.0.1',       //where redis store is
      port: 6379,              //default redis port
      prefix: 'sess',          //prefix for sessions name is store
    }
  ),
  secret: 'cookiesecret',        //cookie secret
  key: 'express.sid',
  resave: true,
  saveUninitialized: true
}));

// app.use(session({
//     secret: "secret",
//     saveUninitialized: true,
//     resave: true
// }));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      let namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));



app.use("/", index);       // handle dashboard and mypolls page
app.use("/register", register);
app.use("/login", login);
app.use("/inbox", inbox);
app.use("/sendmessage", sendMessage);

// handle page not found
app.use(function(req, res) {
  res.json({
    error: "404 - api not found"
  })
});

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), function() {
    console.log("Server is running at port: ", app.get("port"));
});