const recordsModel = require('../models/recordsModel')

async function getRecordById (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const data = await recordsModel.getRecordById(id)
  return res.status(200).json({ data })
}

async function searchRecords (req, res, next) {
  const data = await recordsModel.searchRecords(req.query)
  return res.status(200).json({ data })
}

module.exports = {
  getRecordById,
  searchRecords
}
