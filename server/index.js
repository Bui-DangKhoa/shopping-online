//CLI: npm install express body-parser--save
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
// middlewares
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
// apis
app.use("/api/admin", require("./api/admin.js"));
app.use("/api/customer", require("./api/customer.js"));
app.get("/hello", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res
    .status(500)
    .json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
});
