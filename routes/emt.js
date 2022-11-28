const express = require('express')

const { wrapAsync } = require('../utils/utils')
const emtController = require('../controllers/emtController')

const router = express.Router()

/* Routes. */
router.get('/emt/exams', wrapAsync(emtController.getAllExamNames))
router.get('/emt/medicines', wrapAsync(emtController.getAllMedicineNames))
router.get('/emt/treatments', wrapAsync(emtController.getAllTreatmentNames))

module.exports = router
