const routerItems = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middleware/auth");
const { validateCardBody, validateID } = require("../middleware/validation");

routerItems.get("/", getItems);

routerItems.post("/", auth, validateCardBody, createItem);
routerItems.delete("/:id", auth, validateID, deleteItem);
routerItems.put("/:id/likes", auth, validateID, likeItem);
routerItems.delete("/:id/likes", auth, validateID, dislikeItem);
module.exports = routerItems;
