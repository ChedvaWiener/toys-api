// 2
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret")

exports.auth = (req, res, next) => {
  let token = req.header("x-api-key");

  if (!token) {
    return res.status(402).json({ msg: "You need to send token to this endpoint url" })
  }
  try {
    let decodeToken = jwt.verify(token, config.secretOrPublicKey);
    req.tokenData = decodeToken;
    next();
  }
  catch (err) {
    console.log(err);
    return res.status(402).json({ msg: "Token invalid or expired, log in again" })
  }
}
exports.authAdmin = (req, res, next) => {
  let token = req.header("x-api-key");

  if (!token) {
    return res.status(402).json({ msg: "You need to send token to this endpoint url" })
  }
  try {
    let decodeToken = jwt.verify(token, config.secretOrPublicKey);
    if (decodeToken.role != "admin") {
      return res.status(402).json({ msg: "Token invalid or expired" })
    }

    req.tokenData = decodeToken;
    next();
  }
  catch (err) {
    console.log(err);
    return res.status(402).json({ msg: "Token invalid or expired, log in again" })
  }
}