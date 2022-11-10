const express = require('express')

const { wrapAsync } = require('../utils/utils')
const inpatientsController = require('../controllers/inpatientsController')

const router = express.Router()

/* Routes. */
router.get('/inpatients/charged', wrapAsync(inpatientsController.getChargedPets))
router.get('/inpatients/search', wrapAsync(inpatientsController.searchInpatients))

router.post('/inpatients/discharge', wrapAsync(inpatientsController.discharge))
router.post('/inpatients/swapcage', wrapAsync(inpatientsController.swapCage))

module.exports = router
