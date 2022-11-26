require('dotenv').config({ path: '../.env' })
const { db } = require('../models/mysql')
// const fs = require('fs')
const fsPromise = require('fs/promises')
const path = require('path')

async function extractExamNames () {
  let [data] = await db.query('SELECT name FROM exam')
  data = data.map(row => row.name)
  await fsPromise.writeFile(path.join(__dirname, '../emt-data/examNames.json'), JSON.stringify(data))
}

async function extractMedicineNames () {
  let [data] = await db.query('SELECT name FROM medicine')
  data = data.map(row => row.name)
  await fsPromise.writeFile(path.join(__dirname, '../emt-data/medicineNames.json'), JSON.stringify(data))
}

async function extractTreatmentNames () {
  let [data] = await db.query('SELECT name FROM treatment')
  data = data.map(row => row.name)
  await fsPromise.writeFile(path.join(__dirname, '../emt-data/treatmentNames.json'), JSON.stringify(data))
}

async function main () {
  extractExamNames().then(res => console.log('finished extraction exam names!'))
  extractMedicineNames().then(res => console.log('finished extraction medicine names!'))
  extractTreatmentNames().then(res => console.log('finished extraction treatment names!'))
}

main()
