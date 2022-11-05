const express = require('express')

const { wrapAsync } = require('../utils/utils')
const vetsController = require('../controllers/vets')

const router = express.Router()

/* Routes. */
router.get('/vets/all', wrapAsync(vetsController.getAllVets))

module.exports = router
