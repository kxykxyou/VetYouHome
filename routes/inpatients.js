const express = require('express')

const { wrapAsync } = require('../utils/utils')
const inpatientsController = require('../controllers/inpatientsController')

const router = express.Router()

/* Routes. */
router.get('/inpatients/charged', wrapAsync(inpatientsController.getChargedPets))
router.get('/inpatients/search', wrapAsync(inpatientsController.searchInpatients))
// router.get('/inpatients/id/:id/orders/all')
// router.get('/inpatients/orders/details/id/:id', wrapAsync(inpatientsController.getAllVets))

module.exports = router
