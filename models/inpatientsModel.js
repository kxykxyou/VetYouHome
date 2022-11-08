const { db } = require('./mysql')

async function getChargedPets () {
  const [data] = await db.query('SELECT * FROM cage')
  return data
}

module.exports = { getChargedPets }
