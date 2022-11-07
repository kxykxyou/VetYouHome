const { db } = require('./mysql')

async function getPetById (id) {
  const [data] = await db.execute('SELECT * FROM pet WHERE id = ?', [id])
  return data
}

module.exports = { getPetById }
