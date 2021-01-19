const multer = require("multer");
const validMimeType = ["png", "jpg", "jpeg"];

const uploadMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!validMimeType.includes(file.mimetype.split("/")[1])) {
      return cb(new Error("Wrong File Type"));
    } else {
      return cb(null, true);
    }
  },
});

module.exports = uploadMulter;
