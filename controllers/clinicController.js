const recordsModel = require('../models/recordsModel')
const recordExamsModel = require('../models/recordExamsModel')
const recordMedicationsModel = require('../models/recordMedicationsModel')
const recordTreatmentsModel = require('../models/recordTreatmentsModel')
const petsModel = require('../models/petsModel')
const inpatientsModel = require('../models/inpatientsModel')

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

async function getClinicPetById (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const data = await petsModel.getClinicPetById(id)
  if (!data) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  return res.status(200).json({ data })
}

async function getAllInpatientOrdersByPetId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const data = await inpatientsModel.getAllInpatientOrdersByPetId(id)
  if (!data.length) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  return res.status(200).json({ data })
}

async function getSingleInpatientOrderComplexByInpatientOrderId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const data = await inpatientsModel.getInpatientAndOrderByInpatientOrderId(id)
  if (!data) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  console.log(data)

  const inpatientOrderDetails = await inpatientsModel.getInpatientOrderDetailsByInpatientOrderId(data.inpatientOrderId)
  const complexData = data
  complexData.details = inpatientOrderDetails
  console.log(inpatientOrderDetails)

  return res.status(200).json({ data: complexData })
}

module.exports = {
  getAllRecordsByPetId,
  getSingleRecordComplexByRecordId,
  getClinicPetById,
  getAllInpatientOrdersByPetId,
  getSingleInpatientOrderComplexByInpatientOrderId
}
