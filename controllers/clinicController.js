const recordsModel = require('../models/recordsModel')
const recordExamsModel = require('../models/recordExamsModel')
const recordMedicationsModel = require('../models/recordMedicationsModel')
const recordTreatmentsModel = require('../models/recordTreatmentsModel')
const petsModel = require('../models/petsModel')
const inpatientsModel = require('../models/inpatientsModel')
// const methodTargetFunctionMap = {
//   post: {
//     records: recordsModel.createRecord,
//     inpatientorders: inpatientsModel.createInpatient,
//     inpatients: inpatientsModel.createInpatient
//   },
//   delete: {
//     records: recordsModel.deleteRecord,
//     inpatientorders: inpatientsModel.deleteInpatientOrder,
//     recordexams: recordExamsModel.deleteRecordExam,
//     recordmedications: recordMedicationsModel.deleteRecordMedication,
//     medicationdetails: recordMedicationsModel.deleteMedicationDetail,
//     recordtreatments: recordTreatmentsModel.deleteRecordTreatment
//   },
//   patch: {
//     records: recordsModel.updateRecord,
//     recordexams: recordsModel.updateRecordExam,
//     medicationdetails: recordMedicationsModel.updateMedicationDetail,
//     recordtreatments: recordTreatmentsModel.updateRecordTreatment
//   }
// }

// createRecord,
// createInpatientOrder,
// createInpatient,
// deleteRecord,
// deleteInpatientOrder,
// deleteRecordExam,
// deleteRecordMedication,
// deleteMedicationDetail,
// deleteRecordTreatment,
// updateRecord,
// updateRecordExam,
// updateMedicationDetail,
// updateRecordTreatment

async function getAllRecordsByPetId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const data = await recordsModel.getAllRecordsByPetId(id)
  if (!data.length) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  return res.status(200).json({ data })
}

async function getRecordById (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const result = await recordsModel.getRecordById(id)
  if (result.error) {
    console.log(result.error)
    return res.status(500).json({ error: result.error })
  }
  return res.status(200).json({ data: result.data })
}

async function getRecordExamsByRecordId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const result = await recordExamsModel.getRecordExamsByRecordId(id)
  if (result.error) {
    console.log(result.error)
    return res.status(500).json({ error: result.error })
  }
  return res.status(200).json({ data: result.data })
}

async function getRecordTreatmentsByRecordId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await recordTreatmentsModel.getRecordTreatmentsByRecordId(id)
  if (result.error) {
    console.log(result.error)
    return res.status(500).json({ error: result.error })
  }
  return res.status(200).json({ data: result.data })
}

async function getMedicationComplexByRecordId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await recordMedicationsModel.getMedicationComplexByRecordId(id)
  console.log('result: ', result)
  if (result.error) {
    console.log(result.error)
    return res.status(500).json({ error: result.error })
  }

  return res.status(200).json({ data: result.data })
}

async function getInpatientOrderById (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await inpatientsModel.getInpatientOrderById(id)
  if (result.error) {
    console.log(result.error)
    return res.status(500).json({ error: result.error })
  }
  return res.status(200).json({ data: result.data })
}

async function getInpatientOrderDetailsByInpatientOrderId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await inpatientsModel.getInpatientOrderDetailsByInpatientOrderId(id)
  console.log('result: ', result)
  if (result.error) {
    console.log(result.error)
    return res.status(500).json({ error: result.error })
  }

  return res.status(200).json({ data: result.data })
}

async function getSingleRecordComplexByRecordId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const data = await recordsModel.getRecordById(id)
  if (!data) {
    return res.status(400).json({ error: 'not invalid id' })
  }

  const exams = await recordExamsModel.getRecordExamsByRecordId(data.id)
  const medications = await recordMedicationsModel.getMedicationComplexByRecordId(data.id)
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
    return res.status(400).json({ error: 'not invalid id' })
  }
  const data = await petsModel.getClinicPetById(id)
  if (!data) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  return res.status(200).json({ data })
}

async function getAllInpatientOrdersByPetId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const data = await inpatientsModel.getAllInpatientOrdersByPetId(id)
  // if (!data.length) {
  //   return res.status(400).json({ message: 'not invalid id' })
  // }
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

async function getMostRecentInpatientByPetId (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const data = await inpatientsModel.getMostRecentInpatientByPetId(id)
  if (!data) {
    return res.status(200).json({ })
  }

  return res.status(200).json({ data })
}

async function createRecord (req, res, next) {
  console.log('body:', req.body)
  console.log('user:', req.user)
  // return res.status(200).json({})
  // const { subjective, objective, assessment, plan, exams, medications, treatments, petId } = req.body
  if (!req.body.petId) { return res.status(400).json({ error: 'no petId provided' }) }
  try {
    const result = await recordsModel.createRecord(req.user.id, req.body)
    if (result.error) {
      return res.status(500).json({ error: result.error })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
  return res.status(200).json({ message: 'create record success' })
}

async function createRecordExam (req, res, next) {
  const { recordId, examName } = req.body
  console.log(req.body)
  if (!recordId || !examName) { return res.status(400).json({ error: 'invalid record id or exam name provided' }) }
  const result = await recordExamsModel.createRecordExam(req.body)
  if (result.status_code) {
    return res.status(result.status_code).json({ error: result.error })
  }
  return res.status(200).json({ ...req.body, recordExamId: result.id })
}

async function createRecordMedication (req, res, next) {
  const { recordId } = req.body
  console.log(req.body)
  if (!recordId) { return res.status(400).json({ error: 'invalid record id provided' }) }
  req.body.details.forEach(detail => {
    detail.medicationDose = detail.medicationDose !== undefined ? detail.medicationDose : 0
    detail.frequency = detail.frequency !== undefined ? detail.frequency : 0
    detail.day = detail.day !== undefined ? detail.day : 0
    detail.quantity = detail.quantity !== undefined ? detail.quantity : 1
    detail.discount = detail.discount !== undefined ? detail.discount : 1
    detail.subtotal = detail.subtotal !== undefined ? detail.subtotal : 0
  })
  const result = await recordMedicationsModel.createRecordMedication(req.body)
  if (result.status_code) {
    return res.status(result.status_code).json({ error: result.error })
  }
  return res.status(200).json({ ...req.body, id: result.id })
}

async function createMedicationDetail (req, res, next) {
  const { medicationId, medicineName } = req.body
  console.log(req.body)
  if (!medicationId || !medicineName) { return res.status(400).json({ error: 'invalid medication id or medicine name provided' }) }
  const body = req.body
  body.medicationDose = body.medicationDose !== undefined ? body.medicationDose : 0
  body.frequency = body.frequency !== undefined ? body.frequency : 0
  body.day = body.day !== undefined ? body.day : 0
  body.quantity = body.quantity !== undefined ? body.quantity : 1
  body.discount = body.discount !== undefined ? body.discount : 1
  body.subtotal = body.subtotal !== undefined ? body.subtotal : 0

  const result = await recordMedicationsModel.createMedicationDetail(req.body)
  if (result.status_code) {
    return res.status(result.status_code).json({ error: result.error })
  }
  return res.status(200).json({ ...req.body, medicationDetailId: result.id })
}

async function createRecordTreatment (req, res, next) {
  const { recordId, treatmentName } = req.body
  console.log(req.body)
  if (!recordId || !treatmentName) { return res.status(400).json({ error: 'invalid record id or treatment name provided' }) }
  const result = await recordTreatmentsModel.createRecordTreatment(req.body)
  if (result.status_code) {
    return res.status(result.status_code).json({ error: result.error })
  }
  return res.status(200).json({ ...req.body, recordTreatmentId: result.id })
}

async function createInpatientOrder (req, res, next) {
  console.log('body:', req.body)
  console.log('user:', req.user)
  const { id } = req.body
  if (!(id)) { return res.status(400).json({ error: 'no inpatient order id provided' }) }
  const result = await inpatientsModel.createInpatientOrder(req.user.id, req.body)
  if (result.error) {
    console.log(result.error)
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ message: 'Create record success' })
}

async function createInpatientOrderDetail (req, res, next) {
  const { inpatientOrderId } = req.body
  console.log(req.body)
  if (!inpatientOrderId) { return res.status(400).json({ error: 'no inpatient id provided' }) }
  const result = await inpatientsModel.createInpatientOrderDetail(inpatientOrderId, req.body)
  if (result.error) {
    console.log(result.error)
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ ...req.body, id: result.id })
}

async function createInpatient (req, res, next) {
  console.log('body', req.body)
  console.log('user', req.user)
  const result = await inpatientsModel.createInpatient(req.user.id, req.body)
  if (result.error) {
    console.log(result.error)
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ message: 'Create inpatient success' })
}

async function deleteRecord (req, res, next) {
  const id = Number(req.body.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await recordsModel.deleteRecord(id)
  if (result.error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ message: 'Delete record success' })
}

async function deleteInpatientOrder (req, res, next) {
  const id = Number(req.body.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await inpatientsModel.deleteInpatientOrder(id)
  if (result.error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ message: 'Delete inpatient order success' })
}

async function deleteRecordExam (req, res, next) {
  const id = Number(req.body.recordExamId)
  console.log(req.body)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await recordExamsModel.deleteRecordExam(req.body)
  if (result.error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ message: 'Delete record exam success' })
}

async function deleteRecordMedication (req, res, next) {
  const id = Number(req.body.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await recordMedicationsModel.deleteRecordMedication(req.body)
  if (result.error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ message: 'Delete record medication success' })
}

async function deleteMedicationDetail (req, res, next) {
  const id = Number(req.body.medicationDetailId)
  console.log('body: ', req.body)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await recordMedicationsModel.deleteMedicationDetail(req.body)
  if (result.error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ message: 'Delete medication detail success' })
}

async function deleteRecordTreatment (req, res, next) {
  const id = Number(req.body.recordTreatmentId)
  console.log('body: ', req.body)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await recordTreatmentsModel.deleteRecordTreatment(req.body)
  if (result.error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ message: 'Delete record treatment success' })
}

async function deleteInpatientOrderDetail (req, res, next) {
  const id = Number(req.body.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await inpatientsModel.deleteInpatientOrderDetail(req.body)
  if (result.error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ message: 'Delete inpatient order detail success' })
}

async function updateRecord (req, res, next) {
  const id = Number(req.body.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await recordsModel.updateRecord(req.body)
  if (result.error) {
    console.log(result.error)
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ message: 'Delete record treatment success' })
}

async function updateRecordExam (req, res, next) {
  const id = Number(req.body.recordExamId)
  console.log(req.body)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const body = req.body
  body.filePath = body.filePath !== undefined ? body.filePath : ''
  body.quantity = body.quantity !== undefined ? body.quantity : 1
  body.discount = body.discount !== undefined ? body.discount : 1
  body.subtotal = body.subtotal !== undefined ? body.subtotal : 0
  body.comment = body.comment !== undefined ? body.comment : ''
  const result = await recordExamsModel.updateRecordExam(body)
  if (result.error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json(req.body)
}

async function updateRecordMedication (req, res, next) {
  const id = Number(req.body.id)
  console.log(req.body)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await recordMedicationsModel.updateRecordMedication(req.body)
  if (result.error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json(req.body)
}

async function updateMedicationDetail (req, res, next) {
  const id = Number(req.body.medicationDetailId)
  console.log('body: ', req.body)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const body = req.body
  body.medicationDose = body.medicationDose !== undefined ? body.medicationDose : 0
  body.frequency = body.frequency !== undefined ? body.frequency : 0
  body.day = body.day !== undefined ? body.day : 0
  body.quantity = body.quantity !== undefined ? body.quantity : 1
  body.discount = body.discount !== undefined ? body.discount : 1
  body.subtotal = body.subtotal !== undefined ? body.subtotal : 0
  const result = await recordMedicationsModel.updateMedicationDetail(req.body)
  if (result.error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json(req.body)
}

async function updateRecordTreatment (req, res, next) {
  const id = Number(req.body.recordTreatmentId)
  console.log(req.body)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const body = req.body
  body.quantity = body.quantity !== undefined ? body.quantity : 1
  body.discount = body.discount !== undefined ? body.discount : 1
  body.subtotal = body.subtotal !== undefined ? body.subtotal : 0
  body.comment = body.comment !== undefined ? body.comment : ''
  const result = await recordTreatmentsModel.updateRecordTreatment(req.body)
  if (result.status_code) {
    return res.status(result.status_code).json({ error: result.error })
  }
  return res.status(200).json(req.body)
}

async function updateInpatientOrder (req, res, next) {
  const id = Number(req.body.id)
  console.log(req.body)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await inpatientsModel.updateInpatientOrder(req.body)
  if (result.error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json(req.body)
}

async function updateInpatientOrderDetail (req, res, next) {
  const id = Number(req.body.id)
  console.log(req.body)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  const result = await inpatientsModel.updateInpatientOrderDetail(req.body)
  if (result.error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
  return res.status(200).json(req.body)
}

module.exports = {
  getAllRecordsByPetId,
  getRecordById,
  getSingleRecordComplexByRecordId,
  getRecordExamsByRecordId,
  getMedicationComplexByRecordId,
  getRecordTreatmentsByRecordId,
  getInpatientOrderDetailsByInpatientOrderId,
  getClinicPetById,
  getAllInpatientOrdersByPetId,
  getSingleInpatientOrderComplexByInpatientOrderId,
  getInpatientOrderById,
  getMostRecentInpatientByPetId,

  createRecord,
  createInpatientOrder,
  createInpatient,
  createRecordExam,
  createRecordMedication,
  createMedicationDetail,
  createRecordTreatment,
  createInpatientOrderDetail,

  deleteRecord,
  deleteInpatientOrder,
  deleteRecordExam,
  deleteRecordMedication,
  deleteMedicationDetail,
  deleteRecordTreatment,
  deleteInpatientOrderDetail,

  updateRecord,
  updateRecordExam,
  updateRecordMedication,
  updateMedicationDetail,
  updateRecordTreatment,
  updateInpatientOrder,
  updateInpatientOrderDetail
}
