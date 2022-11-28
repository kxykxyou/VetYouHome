const { db } = require('./mysql')

async function getAllExamNames () {
  const [data] = await db.query('SELECT name FROM exam')
  return data
}

async function getAllMedicineNames () {
  const [data] = await db.query('SELECT name FROM medicine')
  return data
}

async function getAllTreatmentNames () {
  const [data] = await db.query('SELECT name FROM treatment')
  return data
}

module.exports = {
  getAllExamNames,
  getAllMedicineNames,
  getAllTreatmentNames
}
