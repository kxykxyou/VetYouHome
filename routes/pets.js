const express = require('express')

const { wrapAsync, checkId } = require('../utils/utils')
const petsController = require('../controllers/petsController')

const router = express.Router()

/* Routes. */
router.get('/pets/id/:id', checkId, wrapAsync(petsController.getPetById))

module.exports = router
