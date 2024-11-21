const router = require("express").Router();
const users = require("./users");
const items = require("./clothingItems");
const { NOT_FOUND_ERR } = require("../utils/errors");

router.use("/items", items);
router.use("/", users);

router.use((req, res) => {
  res.status(NOT_FOUND_ERR).send({ message: "Error: router not found" });
});

module.exports = router;
