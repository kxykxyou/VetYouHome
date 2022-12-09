const jwt = require('jsonwebtoken')

function wrapAsync (fn) {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next)
  }
}

async function authAdmin (req, res, next) {
  let adminToken = req.headers.authorization
  if (!adminToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  adminToken = adminToken.split('Bearer ')[1]
  if (adminToken !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  return next()
}

async function authUser (req, res, next) {
  let token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  token = req.headers.authorization.split('Bearer ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  let result
  try {
    result = await jwt.verify(token, process.env.JWT_SECRET)
    if (result.error) {
      console.log('Auth user error: ', result.error)
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.user = result.user
    next() // 有正確的token就往下個middleware去
  } catch (error) {
    console.log('Auth user error: ', error)
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

function randomCodeGenerator (n) {
  // 產生n位數亂碼
  let num = (Math.floor(Math.random() * (10 ** (n)))).toString()
  while (num.length < n) {
    num = '0' + num
  }
  return num
}

function checkId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  next()
}

module.exports = {
  wrapAsync,
  authAdmin,
  authUser,
  randomCodeGenerator,
  checkId
}
