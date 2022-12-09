const petsModel = require('../models/petsModel')

async function getPetById (req, res, next) {
  const data = await petsModel.getPetById(Number(req.params.id))
  if (!data) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  return res.status(200).json({ data })
}

module.exports = { getPetById }
