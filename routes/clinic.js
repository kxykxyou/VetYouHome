const express = require('express')

const { wrapAsync, checkId } = require('../utils/utils')
const clinicController = require('../controllers/clinicController')

const router = express.Router()

/* Routes. */
router.get('/clinic/records/pet/id/:id', checkId, wrapAsync(clinicController.getAllRecordsByPetId))
router.get('/clinic/records/complex/id/:id', checkId, wrapAsync(clinicController.getSingleRecordComplexByRecordId))
router.get('/clinic/pets/id/:id', checkId, wrapAsync(clinicController.getClinicPetById))
router.get('/clinic/inpatientorders/complex/id/:id', checkId, wrapAsync(clinicController.getSingleInpatientOrderComplexByInpatientOrderId))

router.get('/clinic/records/id/:id', checkId, wrapAsync(clinicController.getRecordById))
router.get('/clinic/recordexams/recordid/:id', checkId, wrapAsync(clinicController.getRecordExamsByRecordId))
router.get('/clinic/medicationcomplex/recordid/:id', checkId, wrapAsync(clinicController.getMedicationComplexByRecordId))
router.get('/clinic/recordtreatments/recordid/:id', checkId, wrapAsync(clinicController.getRecordTreatmentsByRecordId))
router.get('/clinic/inpatientorders/pet/id/:id', checkId, wrapAsync(clinicController.getAllInpatientOrdersByPetId))
router.get('/clinic/inpatientorderdetails/id/:id', checkId, wrapAsync(clinicController.getInpatientOrderDetailsByInpatientOrderId))
router.get('/clinic/inpatients/mostrecent/pet/id/:id', checkId, wrapAsync(clinicController.getMostRecentInpatientByPetId))

router.post('/clinic/inpatients', wrapAsync(clinicController.createInpatient))

router.route('/clinic/records')
  .post(wrapAsync(clinicController.createRecord))
  .delete(wrapAsync(clinicController.deleteRecord))
  .put(wrapAsync(clinicController.updateRecord))

router.route('/clinic/recordexams')
  .post(wrapAsync(clinicController.createRecordExam))
  .delete(wrapAsync(clinicController.deleteRecordExam))
  .put(wrapAsync(clinicController.updateRecordExam))

router.route('/clinic/recordmedications')
  .post(wrapAsync(clinicController.createRecordMedication))
  .delete(wrapAsync(clinicController.deleteRecordMedication))
  .put(wrapAsync(clinicController.updateRecordMedication))

router.route('/clinic/medicationdetails')
  .post(wrapAsync(clinicController.createMedicationDetail))
  .delete(wrapAsync(clinicController.deleteMedicationDetail))
  .put(wrapAsync(clinicController.updateMedicationDetail))

router.route('/clinic/recordtreatments')
  .post(wrapAsync(clinicController.createRecordTreatment))
  .delete(wrapAsync(clinicController.deleteRecordTreatment))
  .put(wrapAsync(clinicController.updateRecordTreatment))

router.route('/clinic/inpatientorders')
  .post(wrapAsync(clinicController.createInpatientOrder))
  .delete(wrapAsync(clinicController.deleteInpatientOrder))
  .put(wrapAsync(clinicController.updateInpatientOrder))

router.route('/clinic/inpatientorderdetails')
  .post(wrapAsync(clinicController.createInpatientOrderDetail))
  .delete(wrapAsync(clinicController.deleteInpatientOrderDetail))
  .put(wrapAsync(clinicController.updateInpatientOrderDetail))

module.exports = router
