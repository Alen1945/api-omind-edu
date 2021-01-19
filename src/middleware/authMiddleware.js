require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models").tUsers;

function checkAuthToken(...listCodePermission) {
  return async (req, res, next) => {
    try {
      let token = req.headers.authorization || "";
      if (!token) {
        throw new Error("Not Authorized");
      }
      token = token.replace(/Bearer\s*/, "");
      req.auth = jwt.verify(token, process.env.APP_JWT_KEY);
      const user = await User.findOne({ where: { id: req.auth.id } });
      if (user) {
        if (
          listCodePermission.length === 0 ||
          listCodePermission.includes(req.auth.codeRole)
        ) {
          return next();
        } else {
          res.status(403).send({
            success: false,
            msg: "You Don't Have Permission",
          });
        }
      }
      throw new Error("Your Account Has Been Deleted");
    } catch (e) {
      res.status(401).send({
        success: false,
        msg: e.message,
      });
    }
  };
}

module.exports = checkAuthToken;
