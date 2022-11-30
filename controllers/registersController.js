const registersModel = require('../models/registersModel')
const petsModel = require('../models/petsModel')

async function getAllTodayRegisters (req, res, next) {
  const data = await registersModel.getAllTodayRegisters()
  return res.status(200).json({ data })
}

async function callRegisterPet (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const result = await petsModel.callRegisterPet(id)
  if (result.status_code) {
    return res.status(result.status_code).json({ error: result.error })
  }
  return res.status(200).json({ message: 'call register pet success!' })
}

async function finishInquiryPet (req, res, next) {
  const id = Number(req.params.id)
  if (!(Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ message: 'not invalid id' })
  }
  const result = await petsModel.finishInquiryPet(id)
  if (result.status_code) {
    return res.status(result.status_code).json({ error: result.error })
  }
  return res.status(200).json({ message: 'call register pet success!' })
}

module.exports = {
  getAllTodayRegisters,
  callRegisterPet,
  finishInquiryPet
}
