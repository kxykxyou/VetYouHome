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
  } catch (error) {
    console.log('cache exam names error: ', error)
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
  } catch (error) {
    console.log('Cannot write exam names into redis!', error)
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
  } catch (error) {
    console.log('cache medicine names error: ', error)
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
  } catch (error) {
    console.log('Cannot write medicine names into redis!', error)
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
  } catch (error) {
    console.log('cache treatment names error: ', error)
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
  } catch (error) {
    console.log('Cannot write treatment names into redis!', error)
  }

  return res.status(200).json({ data: treatmentNames })
}

module.exports = {
  getAllExamNames,
  getAllMedicineNames,
  getAllTreatmentNames
}
