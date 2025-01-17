const Item = require("../models/clothingItem");

const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/not-found-err");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => {
      res.send({ data: items });
    })
    .catch((err) => {
      next(err);
    });
};

const createItem = (req, res, next) => {
  console.log(req.user._id); // _id will become accessible
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send({ item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  Item.findById(req.params.id)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        throw new ForbiddenError("You do not own this item.");
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Item deleted" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("That ID is not valid."));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("That items was not found."));
      } else if (err.name === "ForbiddenError") {
        next(new ForbiddenError("You do not own this item."));
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("That ID is not valid."));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("That item does not exist"));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("That ID is invalid"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("That item does not exist."));
      } else {
        next(err);
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
