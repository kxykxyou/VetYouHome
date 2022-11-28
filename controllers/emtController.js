const emtModel = require('../models/emtModel')
const { redisClient } = require('../utils/cache')

async function getAllExamNames (req, res, next) {
  let examNames
  try {
    if (redisClient.status === 'ready') {
      examNames = await redisClient.get('examNames')
    }
    if (examNames) {
      examNames = JSON.parse(examNames)
      console.log('examNames from redis', examNames)
      return res.status(200).json({ data: examNames })
    }
  } catch (err) {
    console.log('cache exam names error: ', err)
  }

  // if examNames not in redis or redis client is not ready
  const exams = await emtModel.getAllExamNames()
  examNames = exams.map(exam => exam.name)

  // 寫入redis
  try {
    if (redisClient.status === 'ready') {
      redisClient.set('examNames', JSON.stringify(examNames))
      console.log('exam names are written into redis!')
    }
  } catch (err) {
    console.log('Cannot write exam names into redis!', err)
  }

  return res.status(200).json({ data: examNames })
}

async function getAllMedicineNames (req, res, next) {
  let medicineNames
  try {
    if (redisClient.status === 'ready') {
      medicineNames = await redisClient.get('medicineNames')
    }
    if (medicineNames) {
      medicineNames = JSON.parse(medicineNames)
      console.log('medicineNames from redis', medicineNames)
      return res.status(200).json({ data: medicineNames })
    }
  } catch (err) {
    console.log('cache medicine names error: ', err)
  }

  // if examNames not in redis or redis client is not ready
  const medicines = await emtModel.getAllMedicineNames()
  medicineNames = medicines.map(medicine => medicine.name)

  // 寫入redis
  try {
    if (redisClient.status === 'ready') {
      redisClient.set('medicineNames', JSON.stringify(medicineNames))
      console.log('medicine names are written into redis!')
    }
  } catch (err) {
    console.log('Cannot write medicine names into redis!', err)
  }

  return res.status(200).json({ data: medicineNames })
}

async function getAllTreatmentNames (req, res, next) {
  let treatmentNames
  try {
    if (redisClient.status === 'ready') {
      treatmentNames = await redisClient.get('treatmentNames')
    }
    if (treatmentNames) {
      treatmentNames = JSON.parse(treatmentNames)
      console.log('treatmentNames from redis', treatmentNames)
      return res.status(200).json({ data: treatmentNames })
    }
  } catch (err) {
    console.log('cache treatment names error: ', err)
  }

  // if examNames not in redis or redis client is not ready
  const treatments = await emtModel.getAllTreatmentNames()
  treatmentNames = treatments.map(treatment => treatment.name)

  // 寫入redis
  try {
    if (redisClient.status === 'ready') {
      redisClient.set('treatmentNames', JSON.stringify(treatmentNames))
      console.log('treatment names are written into redis!')
    }
  } catch (err) {
    console.log('Cannot write treatment names into redis!', err)
  }

  return res.status(200).json({ data: treatmentNames })
}

// async function getAllMedicineNames (req, res, next) {
//   const data = await emtModel.getAllMedicineNames()
//   const medicineNames = data.map(medicine => medicine.name)
//   return res.status(200).json({ data: medicineNames })
// }

// async function getAllTreatmentNames (req, res, next) {
//   const data = await emtModel.getAllTreatmentNames()
//   const treatmentNames = data.map(treatment => treatment.name)
//   return res.status(200).json({ data: treatmentNames })
// }

module.exports = {
  getAllExamNames,
  getAllMedicineNames,
  getAllTreatmentNames
}
