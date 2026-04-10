require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const commentsRoute = require("./routes/commentRoutes");
const config = require("./config");
const errorHandler = require('./middlewares/error.middleware');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/comments", commentsRoute);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
      code: "NOT_FOUND"
    }
  });
});

app.use(errorHandler);
app.listen(config.port, () => console.log(`Server running on port ${config.port}`));