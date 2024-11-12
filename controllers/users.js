const User = require("../models/user");
const {
  BAD_REQUEST_ERR,
  NOT_FOUND_ERR,
  INTERNAL_SERVER_ERR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
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

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERR).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERR).send({ message: "That id is invalid." });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_ERR)
          .send({ message: "That user does not exist." });
      } else {
        res
          .status(INTERNAL_SERVER_ERR)
          .send({ message: "An error occured on the server." });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
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

module.exports = { getUsers, getUser, createUser };
