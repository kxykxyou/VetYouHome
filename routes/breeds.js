const express = require('express')

const { wrapAsync } = require('../utils/utils')
const breedsController = require('../controllers/breedsController')

const router = express.Router()

/* Routes. */
router.get('/breeds/all', wrapAsync(breedsController.getAllBreeds))
router.get('/breeds/:species', wrapAsync(breedsController.getBreedsBySpecies))

module.exports = router
