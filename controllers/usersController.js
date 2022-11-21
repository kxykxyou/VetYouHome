const usersModel = require('../models/usersModel')
const validator = require('validator')
const jwt = require('jsonwebtoken')

async function signup (req, res, next) {
  let { fullname } = req.body
  const { email, password, cellphone } = req.body

  if (!fullname || !email || !password || !cellphone) {
    return res.status(400).json({ message: 'Name, email, password and cellphone are required.' })
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  if (!cellphone.startsWith('09') || !validator.isInt(cellphone) || cellphone.length !== 10) {
    return res.status(400).send({ message: 'Invalid cellphone format' })
  }

  const dbCellphone = await usersModel.queryUserCellphone(cellphone)
  const dbEmail = await usersModel.queryUserEmail(email)
  if (dbCellphone) {
    return res.status(400).json({ message: 'Cellphone is already exists' })
  }

  if (dbEmail) {
    return res.status(400).json({ message: 'Email is already in exists' })
  }

  fullname = validator.escape(fullname)
  console.log(req.body)
  const user = await usersModel.signup(
    fullname,
    // usersModel.USER_ROLE.USER,
    email,
    password,
    cellphone
  )

  if (!user) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }

  return res.status(200).send({
    data: {
      access_token: user.access_token,
      access_expired: user.access_expired,
      login_at: user.login_at,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        cellphone: user.cellphone
      }
    }
  })
};

async function signin (req, res, next) {
  const { cellphone, password } = req.body
  if (!cellphone || !password) {
    return res.status(400).json({ message: 'cellphone or password is required' })
  }

  const result = await usersModel.signin(cellphone, password)
  if (result.error) {
    return res.status(result.status_code).json({ message: result.error })
  }

  const exp = Math.floor(Date.now() / 1000) + 3600 * 24 * 30 // 一小時後失效 ; in seconds
  const payload = {
    user: result.user,
    exp
  }

  const accessToken = await jwt.sign(payload, process.env.JWT_SECRET)

  return res.status(200).json({
    user: result.user,
    accessToken,
    tokenExpirationIn: exp
  })
}

async function getUserProfile (req, res, next) {
}

module.exports = {
  signup,
  signin,
  getUserProfile
}
