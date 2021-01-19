const EventRouter = require("express").Router();
const getUploadFile = require("../middleware/getUploadFile");
const AuthMiddleware = require("../middleware/authMiddleware");
const {
  CreateEvents,
  GetAllEvent,
  updateDataEvent,
  DeleteEvent,
} = require("../controllers/events");

EventRouter.post("/", getUploadFile.single("image"), CreateEvents);
EventRouter.get("/", AuthMiddleware("ADM", "EPY"), GetAllEvent);
EventRouter.patch("/:id", getUploadFile.single("image"), updateDataEvent);
EventRouter.delete("/:id", AuthMiddleware("ADM"), DeleteEvent);
module.exports = EventRouter;
