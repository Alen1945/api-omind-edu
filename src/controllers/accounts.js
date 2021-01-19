require('dotenv').config()
const sequelize = require('sequelize')
const {
  tUsers: usersModel,
  tMember_Profiles: memberProfileModel,
  tEmployee_Profiles: employeeProfileModel,
  tRoles: RoleUser,
  tMember_Vouchers: memberVoucherModel,
  tVouchers: voucherModel
} = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.LoginUser = async (req, res, next) => {
  try {
    if (!req.body.username && !req.body.password) {
      throw new Error('Username and Password is Required')
    }
    const dataUser = await usersModel.findOne({
      where: {
        username: /^0/.test(req.body.username)
          ? '+62' + req.body.username.substring(1)
          : req.body.username
      },
      include: [{ model: RoleUser, attributes: ['code'] }]
    })
    if (
      !dataUser ||
      !bcrypt.compareSync(req.body.password, dataUser.password)
    ) {
      throw new Error('Username Or Passowrd Wrong')
    }
    const token = jwt.sign(
      {
        id: dataUser.id,
        username: dataUser.username,
        codeRole: dataUser.tRole.code
      },
      process.env.APP_JWT_KEY,
      { expiresIn: '30D' }
    )
    res.send({
      success: true,
      msg: 'Login Success',
      data: {
        accessToken: token,
        active: '30Days'
      }
    })
  } catch (err) {
    console.log(err)
    const error = new Error(err.message || 'Something Error')
    error.status = 401
    next(error)
  }
}

exports.GetProfile = async (req, res, next) => {
  try {
    const dataUser = await usersModel.findOne({
      where: { id: req.auth.id },
      attributes: ['id', 'idtRole', 'username', 'createdAt', 'updatedAt'],
      include: [
        {
          model: memberProfileModel,
          attributes: ['fullname', 'birthday', 'image', 'point']
        },
        {
          model: memberVoucherModel,
          required: false,
          attributes: ['isUse'],
          where: {
            isUse: 0
          },
          include: [
            {
              model: voucherModel,
              where: {
                expired: {
                  [sequelize.Op.gt]: new Date()
                }
              }
            }
          ]
        },
        {
          model: employeeProfileModel,
          attributes: ['fullname', 'gender', 'address', 'image']
        }
      ]
    })
    if (dataUser) {
      const profile = {
        ...((dataUser.dataValues.tMember_Profile &&
          dataUser.dataValues.tMember_Profile.dataValues) ||
          {}),
        ...((dataUser.dataValues.tEmployee_Profile &&
          dataUser.dataValues.tEmployee_Profile.dataValues) ||
          {})
      }
      res.status(200).send({
        success: true,
        data: {
          id: dataUser.dataValues.id,
          idtRole: dataUser.dataValues.idtRole,
          username: dataUser.dataValues.username,
          ...profile,
          vouchers: dataUser.dataValues.tMember_Vouchers.map((v) => ({
            isUse: v.dataValues.isUse,
            ...v.dataValues.tVoucher.dataValues
          })),
          createdAt: dataUser.dataValues.createdAt,
          updatedAt: dataUser.dataValues.updatedAt
        }
      })
    } else {
      res.status(404).send({
        success: false,
        msg: 'User Not Found'
      })
    }
  } catch (err) {
    console.log(err)
    const error = new Error(err.message || 'Something Error')
    error.status = 202
    next(error)
  }
}
exports.RefreshToken = async (req, res, next) => {
  try {
    const dataUser = await usersModel.findOne({
      where: {
        id: req.auth.id
      },
      include: [{ model: RoleUser, attributes: ['code'] }]
    })
    const token = jwt.sign(
      {
        id: dataUser.id,
        username: dataUser.username,
        codeRole: dataUser.tRole.code
      },
      process.env.APP_JWT_KEY,
      { expiresIn: '30D' }
    )
    res.send({
      success: true,
      msg: 'Refesh Success',
      data: {
        accessToken: token,
        active: '30Days'
      }
    })
  } catch (err) {
    console.log(err)
    const error = new Error(err.message || 'Something Error')
    error.status = 401
    next(error)
  }
}
