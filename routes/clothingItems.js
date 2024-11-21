const routerItems = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middleware/auth");

routerItems.get("/", getItems);

routerItems.post("/", auth, createItem);
routerItems.delete("/:id", auth, deleteItem);
routerItems.put("/:id/likes", auth, likeItem);
routerItems.delete("/:id/likes", auth, dislikeItem);
module.exports = routerItems;
