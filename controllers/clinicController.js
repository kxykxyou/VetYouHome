const recordsModel = require('../models/recordsModel')
const recordExamsModel = require('../models/recordExamsModel')
const recordMedicationsModel = require('../models/recordMedicationsModel')
const recordTreatmentsModel = require('../models/recordTreatmentsModel')
const petsModel = require('../models/petsModel')
const inpatientsModel = require('../models/inpatientsModel')

async function getAllRecordsByPetId (req, res, next) {
  const data = await recordsModel.getAllRecordsByPetId(Number(req.params.id))
  return res.status(200).json({ data })
}

async function getRecordById (req, res, next) {
  const data = await recordsModel.getRecordById(Number(req.params.id))
  return res.status(200).json({ data })
}

async function getRecordExamsByRecordId (req, res, next) {
  const data = await recordExamsModel.getRecordExamsByRecordId(Number(req.params.id))
  return res.status(200).json({ data })
}

async function getRecordTreatmentsByRecordId (req, res, next) {
  const data = await recordTreatmentsModel.getRecordTreatmentsByRecordId(Number(req.params.id))
  return res.status(200).json({ data })
}

async function getMedicationComplexByRecordId (req, res, next) {
  const data = await recordMedicationsModel.getMedicationComplexByRecordId(Number(req.params.id))
  if (!data.length) {
    return res.status(200).json({ data })
  }
  const medications = {}
  data.forEach(row => { // row for every medication details
    if (!medications[row.medicationId]) {
      // 若該medication還沒被加入medications，則建立該medication object
      const medication = {
        id: row.medicationId,
        name: row.medicationName,
        type: row.medicationType,
        comment: row.medicationComment,
        details: []
      }
      medications[row.medicationId] = medication
    }
    const detail = {
      medicationDetailId: row.medicationDetailId,
      medicineId: row.medicineId,
      medicineName: row.medicineName,
      medicineUnitDose: row.medicineUnitDose,
      medicineDoseUnit: row.medicineDoseUnit,
      medicationDose: row.medicationDose,
      frequency: row.frequency,
      day: row.day,
      price: row.price,
      quantity: row.quantity,
      discount: row.discount,
      subtotal: row.subtotal
    }
    medications[row.medicationId].details.push(detail) // 將medication detail加入該medication的details中
  })
  return res.status(200).json({ data: Object.values(medications) })
}

async function getInpatientOrderById (req, res, next) {
  const data = await inpatientsModel.getInpatientOrderById(Number(req.params.id))
  return res.status(200).json({ data })
}

async function getInpatientOrderDetailsByInpatientOrderId (req, res, next) {
  // data is an array of inpatient orders
  const data = await inpatientsModel.getInpatientOrderDetailsByInpatientOrderId(Number(req.params.id))
  return res.status(200).json({ data })
}

async function getSingleRecordComplexByRecordId (req, res, next) {
  const data = await recordsModel.getRecordById(Number(req.params.id))
  // data is an array
  if (!data.length) {
    return res.status(200).json({ data: {} })
  }

  const exams = await recordExamsModel.getRecordExamsByRecordId(data[0].id)
  const medications = await recordMedicationsModel.getMedicationComplexByRecordId(data[0].id)
  const treatments = await recordTreatmentsModel.getRecordTreatmentsByRecordId(data[0].id)

  const complexData = data[0]
  complexData.exams = exams
  complexData.medications = medications
  complexData.treatments = treatments

  return res.status(200).json({ data: complexData })
}

async function getClinicPetById (req, res, next) {
  const data = await petsModel.getClinicPetById(Number(req.params.id))
  // data is an object
  if (!data) {
    return res.status(400).json({ error: 'not invalid id' })
  }
  return res.status(200).json({ data })
}

async function getAllInpatientOrdersByPetId (req, res, next) {
  const data = await inpatientsModel.getAllInpatientOrdersByPetId(Number(req.params.id))
  // data is an array
  return res.status(200).json({ data })
}

async function getSingleInpatientOrderComplexByInpatientOrderId (req, res, next) {
  const data = await inpatientsModel.getInpatientAndOrderByInpatientOrderId(Number(req.params.id))
  // data is an object
  if (!data) {
    return res.status(400).json({ message: 'not invalid id' })
  }

  const inpatientOrderDetails = await inpatientsModel.getInpatientOrderDetailsByInpatientOrderId(data.inpatientOrderId)
  const complexData = data
  complexData.details = inpatientOrderDetails

  return res.status(200).json({ data: complexData })
}

async function getMostRecentInpatientByPetId (req, res, next) {
  const data = await inpatientsModel.getMostRecentInpatientByPetId(Number(req.params.id))
  // data is an object
  if (!data) {
    return res.status(200).json({ data: {} })
  }

  return res.status(200).json({ data })
}

async function createRecord (req, res, next) {
  if (!req.body.petId) { return res.status(400).json({ error: 'no petId provided' }) }
  // check medication set default if undefined
  Object.values(req.body.medications).forEach(medication => {
    if (!medication.name || medication.name === '') {
      return res.status(400).json({ error: `invalid medication name provided: ${medication.name}` })
    }
    medication.details.forEach(detail => {
      if (!detail.medicineName) {
        return res.status(400).json({ error: `invalid medicine name provided: ${detail.medicineName}` })
      }
      detail.medicationDose = detail.medicationDose !== undefined ? detail.medicationDose : 0
      detail.frequency = detail.frequency !== undefined ? detail.frequency : 0
      detail.day = detail.day !== undefined ? detail.day : 0
      detail.quantity = detail.quantity !== undefined ? detail.quantity : 1
      detail.discount = detail.discount !== undefined ? detail.discount : 1
      detail.subtotal = detail.subtotal !== undefined ? detail.subtotal : 0
    })
  })
  const result = await recordsModel.createRecord(req.user.id, req.body)
  if (result.status_code) {
    return res.status(result.status_code).json({ error: result.error })
  }
  return res.status(200).json({ message: 'create record success' })
}

async function createRecordExam (req, res, next) {
  const { recordId, examName } = req.body
  if (!recordId || !examName) { return res.status(400).json({ error: 'invalid record id or exam name provided' }) }

  const result = await recordExamsModel.createRecordExam(req.body)

  if (result.status_code) {
    return res.status(result.status_code).json({ error: result.error })
  }
  return res.status(200).json({ ...req.body, recordExamId: result.id })
}

async function createRecordMedication (req, res, next) {
  const { recordId } = req.body
  if (!recordId) { return res.status(400).json({ error: 'invalid record id provided' }) }

  // set default if field is undefined
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
  if (!recordId || !treatmentName) { return res.status(400).json({ error: 'invalid record id or treatment name provided' }) }
  const result = await recordTreatmentsModel.createRecordTreatment(req.body)
  if (result.status_code) {
    return res.status(result.status_code).json({ error: result.error })
  }
  return res.status(200).json({ ...req.body, recordTreatmentId: result.id })
}

async function createInpatientOrder (req, res, next) {
  const { id } = req.body
  if (!(id)) { return res.status(400).json({ error: 'no inpatient order id provided' }) }
  const result = await inpatientsModel.createInpatientOrder(req.user.id, req.body)
  if (result.status_code) {
    console.log(result.error)
    return res.status(result.status_code).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ message: 'Create record success' })
}

async function createInpatientOrderDetail (req, res, next) {
  const { inpatientOrderId } = req.body
  if (!inpatientOrderId) { return res.status(400).json({ error: 'no inpatient id provided' }) }
  const result = await inpatientsModel.createInpatientOrderDetail(inpatientOrderId, req.body)
  if (result.status_code) {
    console.log(result.error)
    return res.status(result.status_code).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ ...req.body, id: result.id })
}

async function createInpatient (req, res, next) {
  const result = await inpatientsModel.createInpatient(req.user.id, req.body)
  if (result.status_code) {
    console.log(result.error)
    return res.status(result.status_code).json({ error: 'Internal server error' })
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
  if (result.status_code) {
    console.log(result.error)
    return res.status(result.status_code).json({ error: 'Internal server error' })
  }
  return res.status(200).json({ message: 'Delete record treatment success' })
}

async function updateRecordExam (req, res, next) {
  const id = Number(req.body.recordExamId)
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
