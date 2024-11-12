const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");
const { PORT = 3001 } = process.env;

const app = express();

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected");
  })
  .catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "672e2d3ef714919f764db7e2", // paste the _id of the test user created in the previous step
  };
  next();
});

app.use("/", routes);

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});
