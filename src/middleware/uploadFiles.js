const multer = require('multer')
const util = require('util')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '.' + file.mimetype.split('/')[1])
  }
})
const validMimeType = ['png', 'jpg', 'jpeg']
const uploadMulter = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  fileFilter: (req, file, cb) => {
    if (!validMimeType.includes(file.mimetype.split('/')[1])) {
      return cb(new Error('Wrong File Type'))
    } else {
      return cb(null, true)
    }
  }
})

const uploads = (req, res, uploads) => {
  return new Promise((resolve, reject) => {
    util.promisify(uploadMulter.array(uploads, 4))(req, res, err => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      return resolve(true)
    })
  })
}

module.exports = uploads
