const express = require('express')

const { wrapAsync } = require('../utils/utils')
const clinicController = require('../controllers/clinicController')

const router = express.Router()

/* Routes. */
router.get('/clinic/records/pet/id/:id', wrapAsync(clinicController.getAllRecordsByPetId))
router.get('/clinic/records/complex/id/:id', wrapAsync(clinicController.getSingleRecordComplexByRecordId))
router.get('/clinic/pets/id/:id', wrapAsync(clinicController.getClinicPetById))
router.get('/clinic/inpatientorders/pet/id/:id', wrapAsync(clinicController.getAllInpatientOrdersByPetId))
router.get('/clinic/inpatientorders/complex/id/:id', wrapAsync(clinicController.getSingleInpatientOrderComplexByInpatientOrderId))

module.exports = router
