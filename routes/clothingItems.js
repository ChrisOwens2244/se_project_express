const routerItems = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

routerItems.get("/", getItems);
routerItems.post("/", createItem);
routerItems.delete("/:id", deleteItem);
routerItems.put("/:id/likes", likeItem);
routerItems.delete("/:id/likes", dislikeItem);
module.exports = routerItems;
