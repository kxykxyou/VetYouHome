const inpatientsModel = require('../models/inpatientsModel')

async function getChargedPets (req, res, next) {
  const data = await inpatientsModel.getChargedPets()
  return res.status(200).json({ data })
}

async function searchInpatients (req, res, next) {
  const data = await inpatientsModel.searchInpatients(req.query)
  return res.status(200).json({ data })
}

async function discharge (req, res, next) {
  // check if id is valid
  const id = Number(req.body.inpatientId)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const inpatient = await inpatientsModel.query(id)
  if (!inpatient.length) { return res.status(400).json({ message: 'not invalid id' }) }

  // discharge target inpatient
  const result = await inpatientsModel.discharge(id)

  if (!result) {
    console.log('discharge error')
    throw new Error('discharge error')
  }
  if (!result.affectedRows) {
    return res.status(400).json({ message: 'not invalid id' })
  }

  return res.status(200).json({ message: `patient id: ${id} discharge success!` })
}

async function swapCage (req, res, next) {
  // check if body has at least one inpatient id to transfer cage
  const currentCage = req.body.currentCage
  const targetCage = req.body.targetCage

  // if no currentCage or targetCage provided, return 400
  if (!(currentCage && targetCage)) {
    return res.status(400).json({ message: 'bad request' })
  }

  await inpatientsModel.swapCage(currentCage, targetCage)
  return res.status(200).json({ message: 'swap cages success' })
}

async function getTodayInpatientOrderComplexByInpatientId (req, res, next) {
  const inpatientOrderId = Number(req.params.id)
  if (!(Number.isSafeInteger(inpatientOrderId) && inpatientOrderId > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const result = await inpatientsModel.getTodayInpatientOrderComplexByInpatientId(inpatientOrderId)
  if (result.error) {
    console.log(result.error)
    return res.status(500).json({ error: result.error })
  }
  return res.status(200).json({ data: result.data })
}

module.exports = {
  getChargedPets,
  searchInpatients,
  discharge,
  swapCage,
  getTodayInpatientOrderComplexByInpatientId
}
