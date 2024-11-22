const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST_ERR,
  NOT_FOUND_ERR,
  REPEAT_ERR,
  INTERNAL_SERVER_ERR,
  AUTH_ERR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
        .then((user) => {
          res.status(201).send({
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            res.status(BAD_REQUEST_ERR).send({ message: err.message });
          } else if (err.name === "MongoServerError") {
            res
              .status(REPEAT_ERR)
              .send({ message: "That email has all ready been used." });
          } else {
            res
              .status(INTERNAL_SERVER_ERR)
              .send({ message: "An error occured on the server." });
          }
        });
    })
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERR)
        .send({ message: "An error occured on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERR)
      .send({ message: "A password and email are required." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      // authentication error
      if (err.message === "Incorrect email or password") {
        res.status(AUTH_ERR).send({ message: "Incorret email or password" });
      } else {
        res
          .status(INTERNAL_SERVER_ERR)
          .send({ message: "Internal server error" });
      }
    });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    res.send({
      data: user,
    });
  } catch (err) {
    if (err.name === "CastError") {
      res.status(BAD_REQUEST_ERR).send({ message: "That id is invalid." });
    } else if (err.name === "DocumentNotFoundError") {
      res.status(NOT_FOUND_ERR).send({ message: "That user does not exist." });
    } else {
      res
        .status(INTERNAL_SERVER_ERR)
        .send({ message: "An error occured on the server." });
    }
  }
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERR).send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_ERR)
          .send({ message: "That user does not exist." });
      } else {
        res
          .status(INTERNAL_SERVER_ERR)
          .send({ message: "An error occured on the server" });
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
