const express = require('express')

const { wrapAsync } = require('../utils/utils')
const petsController = require('../controllers/petsController')

const router = express.Router()

/* Routes. */
router.get('/pets/id/:id', wrapAsync(petsController.getPetById))

module.exports = router
