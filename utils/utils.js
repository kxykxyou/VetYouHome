function wrapAsync (fn) {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next)
  }
}

async function authAdmin (req, res, next) {
  const adminToken = req.headers.authorization.split('Bearer ')[1]
  console.log(process.env.ADMIN_SECRET)
  if (adminToken === process.env.ADMIN_SECRET) {
    return next()
  }
  return res.status(401).json({ message: 'Unauthorized' })
}

async function authentication () {}

module.exports = {
  wrapAsync,
  authAdmin,
  authentication
}
