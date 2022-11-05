const { db } = require('../models/mysql')

async function getAllVets (req, res, next) {
  const [data] = await db.query('SELECT id, fullname FROM user')
  return res.status(200).json({ data })
}

module.exports = { getAllVets }
