const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");
const UnauthorizedError = require("../errors/unauth-err");
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
            next(new BadRequestError(err.message));
          } else if (err.name === "MongoServerError") {
            next(new ConflictError("That email is all ready in use."));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("A password and email is required.");
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
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
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
      next(new BadRequestError("That id is invalid."));
    } else if (err.name === "DocumentNotFoundError") {
      next(new NotFoundError("This user does not exist."));
    } else {
      res;
      next(err);
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
        next(new BadRequestError(err.message));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("This user does not exist"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
