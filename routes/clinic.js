const express = require('express')

const { wrapAsync } = require('../utils/utils')
const clinicController = require('../controllers/clinicController')

const router = express.Router()

/* Routes. */
router.get('/clinic/records/pet/id/:id', wrapAsync(clinicController.getAllRecordsByPetId))
router.get('/clinic/records/complex/id/:id', wrapAsync(clinicController.getSingleRecordComplexByRecordId))

module.exports = router
