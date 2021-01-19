const AcountsRouter = require("express").Router();
const {
  LoginUser,
  RefreshToken,
  GetProfile,
} = require("../controllers/accounts");
const AuthMiddleware = require("../middleware/authMiddleware");
AcountsRouter.post("/login", LoginUser);
AcountsRouter.get("/profile", AuthMiddleware(), GetProfile);
AcountsRouter.get("/refresh-token", AuthMiddleware(), RefreshToken);
module.exports = AcountsRouter;
