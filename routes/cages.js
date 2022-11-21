const express = require('express')

const { wrapAsync } = require('../utils/utils')
const cagesController = require('../controllers/cagesController')

const router = express.Router()

/* Routes. */
router.get('/cages/all', wrapAsync(cagesController.getAllCages))
router.get('/cages/open', wrapAsync(cagesController.getOpenCages))

module.exports = router
