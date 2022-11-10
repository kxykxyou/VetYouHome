require('dotenv').config({ path: '../../.env' })
const { db } = require('../../models/mysql')
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

// function buildAllTables (filePath) {
//   fs.readFile(filePath, 'utf-8', async (error, data) => {
//     if (error) { console.log('error while reading sql.txt: ', error) }
//     const sqls = data.replaceAll('\n', '').split(';').filter(sql => sql !== '')
//     const dbConnection = await db.getConnection()
//     await dbConnection.query('START TRANSACTION')
//     try {
//       sqls.forEach(async (sql) => {
//         await dbConnection.query(sql)
//       })
//       await dbConnection.query('COMMIT')
//       console.log(`build tables success: ${process.env.DB_NAME}`)
//     } catch (err) {
//       await dbConnection.query('ROLLBACK')
//       console.log('error happened while build tables', err)
//     } finally {
//       await dbConnection.release()
//     }
//   })
// }

// async function dropAllTables (dropTableOrders) {
//   const dbConnection = await db.getConnection()
//   const sqlTemplate = 'DROP TABLE IF EXISTS '
//   await dbConnection.query('START TRANSACTION')
//   try {
//     dropTableOrders.forEach(async (table) => {
//       await dbConnection.query(sqlTemplate + table)
//     })
//     await dbConnection.query('COMMIT')
//     console.log(`drop tables success: ${process.env.DB_NAME}`)
//   } catch (err) {
//     await dbConnection.query('ROLLBACK')
//     console.log('error happened while drop all tables', err)
//   } finally {
//     await dbConnection.release()
//   }
// }

async function buildFakeDataByLevel (dbConnection, data, level) {
  // await dbConnection.query('START TRANSACTION')
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
    // await dbConnection.query('COMMIT')
  } catch (err) {
    console.log('fail to inject data at level:', level, err)
    // await dbConnection.query('ROLLBACK')
  } finally {
    // await dbConnection.release()
  }
}

async function injectFakeData () {
  const dbConnection = await db.getConnection()
  try {
    const filePath = path.join(__dirname, 'fake-data.json')
    let data = await fsPromise.readFile(filePath, 'utf-8')
    data = JSON.parse(data)
    await dbConnection.beginTransaction()
    await buildFakeDataByLevel(dbConnection, data, 1)
    await buildFakeDataByLevel(dbConnection, data, 2)
    await buildFakeDataByLevel(dbConnection, data, 3)
    await buildFakeDataByLevel(dbConnection, data, 4)
    await buildFakeDataByLevel(dbConnection, data, 5)
    await dbConnection.commit()
    console.log('inject data success')
  } catch (err) {
    console.log(err)

    throw err
  } finally {
    await dbConnection.release()
  }
}

// injectFakeData()

module.exports = { injectFakeData }
