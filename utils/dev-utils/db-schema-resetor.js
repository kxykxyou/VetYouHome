require('dotenv').config({ path: '../../.env' })
const { db } = require('../../models/mysql')
const fs = require('fs')
const fsPromise = require('fs/promises')
const path = require('path')
const dataInjectLevel = ['1', '2', '3', '4']
const dropTableOrders = [
  'medical_order',
  'record_exam',
  'record_medication',
  'record_treatment',
  'record',
  'user',
  'exam',
  'medicine',
  'treatment',
  'inpatient_order',
  'inpatient',
  'pet',
  'owner',
  'cage',
  'breed'
]

function buildAllTables (filePath) {
  fs.readFile(filePath, 'utf-8', async (error, data) => {
    if (error) { console.log('error while reading sql.txt: ', error) }
    const sqls = data.replaceAll('\n', '').split(';').filter(sql => sql !== '')
    const dbConnection = await db.getConnection()
    await dbConnection.query('START TRANSACTION')
    try {
      sqls.forEach(async (sql) => {
        await dbConnection.query(sql)
      })
      await dbConnection.query('COMMIT')
      console.log(`build tables success: ${process.env.DB_NAME}`)
    } catch (err) {
      await dbConnection.query('ROLLBACK')
      console.log('error happened while build tables', err)
    } finally {
      await dbConnection.release()
    }
  })
}

async function dropAllTables (dropTableOrders) {
  const dbConnection = await db.getConnection()
  const sqlTemplate = 'DROP TABLE IF EXISTS '
  await dbConnection.query('START TRANSACTION')
  try {
    dropTableOrders.forEach(async (table) => {
      await dbConnection.query(sqlTemplate + table)
    })
    await dbConnection.query('COMMIT')
    console.log(`drop tables success: ${process.env.DB_NAME}`)
  } catch (err) {
    await dbConnection.query('ROLLBACK')
    console.log('error happened while drop all tables', err)
  } finally {
    await dbConnection.release()
  }
}

async function buildFakeDataByLevel (data, level) {
  const dbConnection = db.getConnection()
  await dbConnection.query('START TRANSACTION')
  try {
    const tables = Object.keys(data[level])
    tables.forEach(async (table) => {
      const baseSQL = `INSERT INTO ${table} SET ?`
      // console.log(table)
      // if (table === 'user') { console.log(data[level][table]) }
      data[level][table].forEach(async (row) => {
        await dbConnection.query(baseSQL, row)
      })
    })
    await dbConnection.query('COMMIT')
  } catch (err) {
    console.log('fail to inject data', err)
    await dbConnection.query('ROLLBACK')
  } finally {
    await dbConnection.release()
  }
}

async function injectFakeData (filePath) {
  let data = await fsPromise.readFile(filePath, 'utf-8')
  data = JSON.parse(data)
  await buildFakeDataByLevel(data, 1)
  await buildFakeDataByLevel(data, 2)
  await buildFakeDataByLevel(data, 3)
  await buildFakeDataByLevel(data, 4)
}

async function main () {
  await dropAllTables(dropTableOrders)
  await buildAllTables(path.join(__dirname, 'sql.txt'))

  // await injectFakeData(path.join(__dirname, 'fake-data.json'))
}

// injectFakeData(path.join(__dirname, 'fake-data.json'))

main()
