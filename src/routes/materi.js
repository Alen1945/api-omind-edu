const MateriRouter = require('express').Router()
const getUploadFile = require('../middleware/getUploadFile')
const AuthMiddleware = require('../middleware/authMiddleware')
const {
  CreateMateri,
  GetAllMateri,
  GetDetailMateri,
  updateDataMateri,
  DeleteMateri
} = require('../controllers/materi')

MateriRouter.post(
  '/',
  getUploadFile.single('image'),
  CreateMateri
)
MateriRouter.get('/', AuthMiddleware('ADM', 'EPY'), GetAllMateri)
MateriRouter.get('/:id', AuthMiddleware('ADM', 'EPY'), GetDetailMateri)
MateriRouter.patch(
  '/:id',
  getUploadFile.single('image'),
  updateDataMateri
)
MateriRouter.delete('/:id', AuthMiddleware('ADM'), DeleteMateri)
module.exports = MateriRouter
