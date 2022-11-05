const express = require('express')

const { wrapAsync } = require('../utils/utils')
const recordsController = require('../controllers/records')

const router = express.Router()

/* Routes. */
router.get('/records/search', wrapAsync(recordsController.searchRecords))
router.get('/records/id/:id', wrapAsync(recordsController.getRecordById))
// router.get('/records/search', wrapAsync(recordsController.getRecordById))

module.exports = router
