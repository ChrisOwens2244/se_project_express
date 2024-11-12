const Item = require("../models/clothingItem");
const {
  BAD_REQUEST_ERR,
  NOT_FOUND_ERR,
  INTERNAL_SERVER_ERR,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.send({ data: items });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERR).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERR)
          .send({ message: "An error occured on the server." });
      }
    });
};

const createItem = (req, res) => {
  console.log(req.user._id); // _id will become accessible
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERR).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERR)
          .send({ message: "An error occured on the server." });
      }
    });
};

const deleteItem = (req, res) => {
  Item.findByIdAndRemove(req.params.id)
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERR).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERR).send({ message: "That ID is invalid." });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERR).send({ message: "That item does not exist" });
      } else {
        res
          .status(INTERNAL_SERVER_ERR)
          .send({ message: "An error occured on the server." });
      }
    });
};

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERR).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERR).send({ message: "That ID is invalid." });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_ERR)
          .send({ message: "That item does not exist." });
      } else {
        res
          .status(INTERNAL_SERVER_ERR)
          .send({ message: "An error occured on the server." });
      }
    });
};

//...

const dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERR).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERR).send({ message: "That ID is invalid." });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERR).send({ message: "That item does not exist" });
      } else {
        res
          .status(INTERNAL_SERVER_ERR)
          .send({ message: "An error occured on the server." });
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
