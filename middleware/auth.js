const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { AUTH_ERR } = require("../utils/errors");

const handleAuthError = (res) => {
  res.status(AUTH_ERR).send({ message: "Authorization Error" });
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    handleAuthError(res);
  }

  req.user = payload;
  next();
};
