require('dotenv').config({ path: '../../.env' })
const { db } = require('../../models/mysql')
const fsPromise = require('fs/promises')
const path = require('path')

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
  } catch (error) {
    console.log('fail to inject data at level:', level, error)
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
  } catch (error) {
    console.log(error)

    throw error
  } finally {
    await dbConnection.release()
  }
}

// injectFakeData()

module.exports = { injectFakeData }
