const express = require('express')

const { wrapAsync, authUser } = require('../utils/utils')
const clinicController = require('../controllers/clinicController')

const router = express.Router()

/* Routes. */
router.get('/clinic/records/pet/id/:id', wrapAsync(clinicController.getAllRecordsByPetId))
router.get('/clinic/records/complex/id/:id', wrapAsync(clinicController.getSingleRecordComplexByRecordId))
router.get('/clinic/pets/id/:id', wrapAsync(clinicController.getClinicPetById))
router.get('/clinic/inpatientorders/complex/id/:id', wrapAsync(clinicController.getSingleInpatientOrderComplexByInpatientOrderId))
router.get('/clinic/inpatientorders/complex/today/petid/:id', wrapAsync(clinicController.getTodayInpatientOrderComplexByPetId))

router.get('/clinic/records/id/:id', wrapAsync(clinicController.getRecordById))
router.get('/clinic/recordexams/recordid/:id', wrapAsync(clinicController.getRecordExamsByRecordId))
router.get('/clinic/medicationcomplex/recordid/:id', wrapAsync(clinicController.getMedicationComplexByRecordId))
router.get('/clinic/recordtreatments/recordid/:id', wrapAsync(clinicController.getRecordTreatmentsByRecordId))
router.get('/clinic/inpatientorders/pet/id/:id', wrapAsync(clinicController.getAllInpatientOrdersByPetId))
router.get('/clinic/inpatientorderdetails/id/:id', wrapAsync(clinicController.getInpatientOrderDetailsByInpatientOrderId))
router.get('/clinic/inpatients/mostrecent/pet/id/:id', wrapAsync(clinicController.getMostRecentInpatientByPetId))

router.post('/clinic/records', wrapAsync(authUser), wrapAsync(clinicController.createRecord))
// router.post('/clinic/recordsmedications', wrapAsync(authUser), wrapAsync(clinicController.createRecordMedication))
router.post('/clinic/recordexams', wrapAsync(authUser), wrapAsync(clinicController.createRecordExam))
router.post('/clinic/recordmedications', wrapAsync(authUser), wrapAsync(clinicController.createRecordMedication))
router.post('/clinic/medicationdetails', wrapAsync(authUser), wrapAsync(clinicController.createMedicationDetail))
router.post('/clinic/recordtreatments', wrapAsync(authUser), wrapAsync(clinicController.createRecordTreatment))
router.post('/clinic/inpatients', wrapAsync(authUser), wrapAsync(clinicController.createInpatient))
router.post('/clinic/inpatientorders', wrapAsync(authUser), wrapAsync(clinicController.createInpatientOrder))
router.post('/clinic/inpatientorderdetails', wrapAsync(authUser), wrapAsync(clinicController.createInpatientOrderDetail))

router.delete('/clinic/records', wrapAsync(authUser), wrapAsync(clinicController.deleteRecord))
router.delete('/clinic/recordexams', wrapAsync(authUser), wrapAsync(clinicController.deleteRecordExam))
router.delete('/clinic/recordmedications', wrapAsync(authUser), wrapAsync(clinicController.deleteRecordMedication))
router.delete('/clinic/medicationdetails', wrapAsync(authUser), wrapAsync(clinicController.deleteMedicationDetail))
router.delete('/clinic/recordtreatments', wrapAsync(authUser), wrapAsync(clinicController.deleteRecordTreatment))
router.delete('/clinic/inpatientorders', wrapAsync(authUser), wrapAsync(clinicController.deleteInpatientOrder))
router.delete('/clinic/inpatientorderdetails', wrapAsync(authUser), wrapAsync(clinicController.deleteInpatientOrderDetail))

router.put('/clinic/records', wrapAsync(authUser), wrapAsync(clinicController.updateRecord))
router.put('/clinic/recordexams', wrapAsync(authUser), wrapAsync(clinicController.updateRecordExam))
router.put('/clinic/recordmedications', wrapAsync(authUser), wrapAsync(clinicController.updateRecordMedication))
router.put('/clinic/medicationdetails', wrapAsync(authUser), wrapAsync(clinicController.updateMedicationDetail))
router.put('/clinic/recordtreatments', wrapAsync(authUser), wrapAsync(clinicController.updateRecordTreatment))
router.put('/clinic/inpatientorders', wrapAsync(authUser), wrapAsync(clinicController.updateInpatientOrder))
router.put('/clinic/inpatientorderdetails', wrapAsync(authUser), wrapAsync(clinicController.updateInpatientOrderDetail))

module.exports = router
