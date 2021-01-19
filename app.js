const express = require("express");
const App = express();
const morgan = require("morgan");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthMiddleware = require("./src/middleware/authMiddleware");
/* Routes */
const AccountsRouter = require("./src/routes/accounts");
const MateriRouter = require("./src/routes/materi");
const EventRouter = require("./src/routes/events");
/* Logger */
App.use(morgan("tiny"));

/* BodyParser */
App.use(bodyParser.urlencoded({ extended: false }));
App.use(bodyParser.json());

/* CORS HEADER */
/*
  Spesific Origin With
  const whiteList = ['http://example1.com', 'http://example2.com']
*/
const whiteList = "*";
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList !== "*") {
      if (whiteList.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed By CORS"));
      }
    } else {
      callback(null, true);
    }
  },
  optionsSuccessStatus: 200,
};
App.use(cors());

App.get("/", (req, res, next) => {
  res.send({
    success: true,
    message: "Get / Success",
  });
});
const ApiRouter = express.Router();
App.use("/api", ApiRouter);

// Api
ApiRouter.use("/accounts", AccountsRouter);
ApiRouter.use("/materi", AuthMiddleware(), MateriRouter);
ApiRouter.use("/events", AuthMiddleware(), EventRouter);
/* Handling Not Found Routes */
App.use((req, res, next) => {
  next(createError(404));
});
/* Handling Error */
App.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    success: false,
    message: err.message,
  });
});

module.exports = App;
