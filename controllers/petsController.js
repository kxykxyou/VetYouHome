const petsModel = require('../models/petsModel')

async function getPetById (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const data = await petsModel.getPetById(id)
  return res.status(200).json({ data })
}

module.exports = { getPetById }
