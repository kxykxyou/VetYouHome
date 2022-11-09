const { db } = require('./mysql')

async function getAllCages () {
  const [data] = await db.query('SELECT * FROM cage ORDER BY name')
  return data
}

module.exports = { getAllCages }
