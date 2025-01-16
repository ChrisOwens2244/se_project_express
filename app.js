require('dotenv').config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const routes = require("./routes/index");

const { errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middleware/logger");

const errorHandler = require("./middleware/error-handler");

const { PORT = 3001 } = process.env;

const app = express();

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected");
  })
  .catch(console.error);

app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.use("/", routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});
