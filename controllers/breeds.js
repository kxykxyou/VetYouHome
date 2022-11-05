const { db } = require('../models/mysql')
const speciesQueryMap = {
  dog: 'd',
  cat: 'c'
}

async function getAllBreeds (req, res, next) {
  const [data] = await db.query(
    'SELECT * FROM breed ORDER BY species , id ASC'
  )
  return res.status(200).json({ data })
}

async function getBreedsBySpecies (req, res, next) {
  if (!speciesQueryMap[req.params.species]) {
    return res.status(400).json({ message: 'bad request!' })
  }
  const [data] = await db.execute('SELECT * FROM breed WHERE species = ?', [speciesQueryMap[req.params.species]])
  return res.status(200).json({ data })
}

module.exports = { getAllBreeds, getBreedsBySpecies }
