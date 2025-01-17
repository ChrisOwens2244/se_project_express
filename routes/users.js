const routerUser = require("express").Router();
const {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");
const auth = require("../middleware/auth");
const {
  validateLogin,
  validateNewUser,
  validateUpdatedUser,
} = require("../middleware/validation");

routerUser.post("/signin", validateLogin, login);
routerUser.post("/signup", validateNewUser, createUser);

routerUser.get("/users/me", auth, getCurrentUser);
routerUser.patch("/users/me", auth, validateUpdatedUser, updateProfile);

module.exports = routerUser;
