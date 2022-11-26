require('dotenv').config({ path: '../.env' })
const { db } = require('../models/mysql')
// const fs = require('fs')
const fsPromise = require('fs/promises')
const path = require('path')

async function extractExamNames () {
  const [data] = await db.query('SELECT name FROM exam')
  await fsPromise.writeFile(path.join(__dirname, '../emt-data/examNames.json'), JSON.stringify(data))
}

async function extractMedicineNames () {
  const [data] = await db.query('SELECT name FROM medicine')
  await fsPromise.writeFile(path.join(__dirname, '../emt-data/medicineNames.json'), JSON.stringify(data))
}

async function extractTreatmentNames () {
  const [data] = await db.query('SELECT name FROM treatment')
  await fsPromise.writeFile(path.join(__dirname, '../emt-data/treatmentNames.json'), JSON.stringify(data))
}

function main () {
  extractExamNames()
  extractMedicineNames()
  extractTreatmentNames()
}

main()
