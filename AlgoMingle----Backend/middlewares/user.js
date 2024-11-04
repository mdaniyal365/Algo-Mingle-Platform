const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Wrapper = require("./Wrapper");
exports.isLoggedIn = Wrapper(async function (req, res, next) {
  const token =
    req.cookies.token ||
    (req.header("Authorization") &&
      req.header("Authorization").replace("Bearer ", ""));
  if (!token) {
    return res.status(401).json({
      message: "You are not logged in",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    req.email = decoded.email;
    req.user = user._id;
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid Token",
    });
  }
});
