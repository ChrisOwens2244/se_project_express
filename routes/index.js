const router = require("express").Router();
const users = require("./users");
const items = require("./clothingItems");
const INTERNAL_SERVER_ERR = require("../utils/errors");

router.use("/items", items);
router.use("/users", users);

router.use((req, res) => {
  res.status(INTERNAL_SERVER_ERR).send({ message: "Error: router not found" });
});

module.exports = router;
