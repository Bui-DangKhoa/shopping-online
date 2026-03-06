//CLI: npm install mongoose --save
const mongoose = require("mongoose");
const MyConstants = require("./MyConstants");
// Prefer explicit URI when provided to avoid mismatched params
const uri =
  MyConstants.DB_URI ||
  "mongodb+srv://" +
    encodeURIComponent(MyConstants.DB_USER) +
    ":" +
    encodeURIComponent(MyConstants.DB_PASS) +
    "@" +
    MyConstants.DB_SERVER +
    "/" +
    MyConstants.DB_DATABASE;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to " + uri);
  })
  .catch((err) => {
    console.error(err);
  });
