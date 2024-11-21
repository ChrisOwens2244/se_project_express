const routerUser = require("express").Router();
const {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");
const auth = require("../middleware/auth");

routerUser.post("/signin", login);
routerUser.post("/signup", createUser);

routerUser.get("/users/me", auth, getCurrentUser);
routerUser.patch("/users/me", auth, updateProfile);

module.exports = routerUser;
