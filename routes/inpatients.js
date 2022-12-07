const express = require('express')

const { wrapAsync, checkId } = require('../utils/utils')
const inpatientsController = require('../controllers/inpatientsController')

const router = express.Router()

/* Routes. */
router.get('/inpatients/charged', wrapAsync(inpatientsController.getChargedPets))
router.get('/inpatients/search', wrapAsync(inpatientsController.searchInpatients))
router.get('/inpatients/id/:id/inpatientorders/complex/today', checkId, wrapAsync(inpatientsController.getTodayInpatientOrderComplexByInpatientId))

router.get('/inpatientorders/complex/id/:id', checkId, wrapAsync(inpatientsController.getInpatientOrderComplexByInpatientOrderId))

router.post('/inpatients/discharge', wrapAsync(inpatientsController.discharge))
router.post('/inpatients/swapcage', wrapAsync(inpatientsController.swapCage))

module.exports = router
