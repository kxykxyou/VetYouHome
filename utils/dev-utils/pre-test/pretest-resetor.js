require('dotenv').config({ path: '../../../.env' })
const { db } = require('../../../models/mysql')
// const fs = require('fs')
const fsPromise = require('fs/promises')
const path = require('path')
// const dataInjectLevel = ['1', '2', '3', '4', '5']
const dropTableOrders = [
  'medical_order',
  'medication_detail',
  'record_exam',
  'record_medication',
  'record_treatment',
  'record',
  'exam',
  'medicine',
  'treatment',
  'inpatient_order_detail',
  'inpatient_order',
  'inpatient',
  'register',
  'pet',
  'owner',
  'cage',
  'breed',
  'user'
]

async function buildAllTables () {
  const filePath = path.join(__dirname, '../VetYouHome.sql')
  const data = await fsPromise.readFile(filePath, 'utf-8')
  const sqls = data.replaceAll('\n', '').split(';').filter(sql => sql !== '')
  const dbConnection = await db.getConnection()
  await dbConnection.query('START TRANSACTION')
  try {
    sqls.forEach(async (sql) => {
      await dbConnection.query(sql)
    })
    await dbConnection.query('COMMIT')
    console.log(`build tables success: ${process.env.DB_NAME}`)
  } catch (error) {
    await dbConnection.query('ROLLBACK')
    console.log('error happened while build tables', error)
  } finally {
    await dbConnection.release()
  }
}

async function dropAllTables () {
  const dbConnection = await db.getConnection()
  const sqlTemplate = 'DROP TABLE IF EXISTS '
  await dbConnection.query('START TRANSACTION')
  try {
    dropTableOrders.forEach(async (table) => {
      await dbConnection.query(sqlTemplate + table)
    })
    await dbConnection.query('COMMIT')
    console.log(`drop tables success: ${process.env.DB_NAME}`)
  } catch (error) {
    await dbConnection.query('ROLLBACK')
    console.log('error happened while drop all tables', error)
  } finally {
    await dbConnection.release()
  }
}

async function resetDB () {
  await dropAllTables()
  await buildAllTables()
  console.log('build schema success!')
}

resetDB()

module.exports = {
  resetDB,
  dropAllTables,
  buildAllTables
}
