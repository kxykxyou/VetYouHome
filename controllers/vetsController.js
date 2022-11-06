const vetsModel = require('../models/vetsModel')

async function getAllVets (req, res, next) {
  const [data] = await vetsModel.getAllVets()
  return res.status(200).json({ data })
}

module.exports = { getAllVets }
