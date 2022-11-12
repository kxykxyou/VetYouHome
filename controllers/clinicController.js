const recordsModel = require('../models/recordsModel')
const recordExamsModel = require('../models/recordExamsModel')
const recordMedicationsModel = require('../models/recordMedicationsModel')
const recordTreatmentsModel = require('../models/recordTreatmentsModel')

async function getAllRecordsByPetId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const data = await recordsModel.getAllRecordsByPetId(id)
  if (!data.length) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  return res.status(200).json({ data })
}

async function getSingleRecordComplexByRecordId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const data = await recordsModel.getRecordById(id)
  if (!data) {
    return res.status(400).json({ message: 'not invalid id' })
  }

  const exams = await recordExamsModel.getRecordExamsByRecordId(data.id)
  const medications = await recordMedicationsModel.getRecordMedicationsByRecordId(data.id)
  const treatments = await recordTreatmentsModel.getRecordTreatmentsByRecordId(data.id)

  const complexData = data
  complexData.exams = exams
  complexData.medications = medications
  complexData.treatments = treatments

  return res.status(200).json({ data: complexData })
}

module.exports = {
  getAllRecordsByPetId,
  getSingleRecordComplexByRecordId
}
