const breedsModel = require('../models/breedsModel')
const speciesQueryMap = {
  dog: 'd',
  cat: 'c'
}

async function getAllBreeds (req, res, next) {
  const data = await breedsModel.getAllBreeds()
  return res.status(200).json({ data })
}

async function getBreedsBySpecies (req, res, next) {
  if (!speciesQueryMap[req.params.species]) {
    return res.status(400).json({ message: 'bad request!' })
  }
  const data = await breedsModel.getBreedsBySpecies(speciesQueryMap[req.params.species])
  return res.status(200).json({ data })
}

module.exports = { getAllBreeds, getBreedsBySpecies }
