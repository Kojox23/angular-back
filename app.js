var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose"); // (Étape 1) Import du DRM mongoose
var cors = require("cors");

var indexRouter = require("./routes/index");
var muscleRouter = require("./routes/muscle");

var app = express();

// Intégration de la bdd
var connectionString =
  "mongodb+srv://demaillelucas:jV8UNFbGku293ZVw@cluster0.xwpz6w0.mongodb.net/test";
var mongoDB = process.env.MONGODB_URI || connectionString;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/muscles", muscleRouter);

module.exports = app;
