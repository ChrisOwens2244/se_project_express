const router = require("express").Router();
const users = require("./users");
const items = require("./clothingItems");
const NotFoundError = require("../errors/not-found-err");

router.use("/items", items);
router.use("/", users);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
