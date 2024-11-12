const routerUser = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

routerUser.get("/", getUsers);
routerUser.get("/:id", getUser);
routerUser.post("/", createUser);

module.exports = routerUser;
