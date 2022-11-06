const express = require('express')

const { wrapAsync } = require('../utils/utils')
const vetsController = require('../controllers/vetsController')

const router = express.Router()

/* Routes. */
router.get('/vets/all', wrapAsync(vetsController.getAllVets))

module.exports = router
