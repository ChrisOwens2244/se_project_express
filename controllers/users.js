const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  BAD_REQUEST_ERR,
  AUTH_ERR,
  NOT_FOUND_ERR,
  REPEAT_ERR,
  INTERNAL_SERVER_ERR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => {
//       res.send({ data: users });
//     })
//     .catch((err) => {
//       console.error(err);
//       res
//         .status(INTERNAL_SERVER_ERR)
//         .send({ message: "An error occured on the server." });
//     });
// };

// const getUser = (req, res) => {
//   User.findById(req.params.id)
//     .orFail()
//     .then((user) => {
//       res.send({ data: user });
//     })
//     .catch((err) => {
//       console.error(err);
//       console.log(err.name);
//       if (err.name === "ValidationError") {
//         res.status(BAD_REQUEST_ERR).send({ message: err.message });
//       } else if (err.name === "CastError") {
//         res.status(BAD_REQUEST_ERR).send({ message: "That id is invalid." });
//       } else if (err.name === "DocumentNotFoundError") {
//         res
//           .status(NOT_FOUND_ERR)
//           .send({ message: "That user does not exist." });
//       } else {
//         res
//           .status(INTERNAL_SERVER_ERR)
//           .send({ message: "An error occured on the server." });
//       }
//     });
// };

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
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
        console.error(err);
        console.log(err.name);
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
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      // authentication error
      console.error(err);
      res
        .status(BAD_REQUEST_ERR)
        .send({ message: "Email or Password is incorrect." });
    });
};

const getCurrentUser = (req, res) => {
  return User.findById(req.user._id)
    .then((user) => {
      res.send({
        data: user,
      });
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

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name: name, avatar: avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
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
  // getUsers,
  // getUser,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
