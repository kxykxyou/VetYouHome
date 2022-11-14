const usersModel = require('../models/usersModel')
const validator = require('validator')

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

}

async function getUserProfile (req, res, next) {

}

module.exports = {
  signup,
  signin,
  getUserProfile
}
