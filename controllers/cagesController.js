const cagesModel = require('../models/cagesModel')

async function getAllCages (req, res, next) {
  const data = await cagesModel.getAllCages()
  return res.status(200).json({ data })
}

module.exports = { getAllCages }
