const express = require('express')

const { wrapAsync, checkId } = require('../utils/utils')
const recordsController = require('../controllers/recordsController')

const router = express.Router()

/* Routes. */
router.get('/records/search', wrapAsync(recordsController.searchRecords))
router.get('/records/id/:id', checkId, wrapAsync(recordsController.getRecordById))

module.exports = router
