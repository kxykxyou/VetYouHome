const { db } = require('../models/mysql')

async function getAllBreeds () {
  const [data] = await db.query(
    'SELECT * FROM breed ORDER BY species , id ASC'
  )
  return data
}

async function getBreedsBySpecies (species) {
  const [data] = await db.execute('SELECT * FROM breed WHERE species = ?', [species])
  return data
}

module.exports = { getAllBreeds, getBreedsBySpecies }
