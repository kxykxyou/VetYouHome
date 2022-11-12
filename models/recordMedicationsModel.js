const { db } = require('./mysql')

async function getRecordMedicationsByRecordId (id) {
  const [data] = await db.execute(`
  SELECT
    rm.id as medicationId,
    rm.name as medicationName,
    rm.type as medicationType,
    rm.comment as medicationComment,
    md.id as medicationDetailId,
    md.medicine_id as medicineId,
    m.name as medicineName,
    m.dose as medicineUnitDose,
    m.dose_unit as medicineDoseUnit,
    m.price as originalPrice,
    md.dose as medicationDose,
    md.frequency as frequency, 
    md.day as day, 
    md.price as price, 
    md.quantity as quantity, 
    md.discount as discount,
    md.subtotal as subtotal   
  FROM record_medication as rm 
  JOIN medication_detail AS md on rm.id = md.record_medication_id
  JOIN medicine as m on md.medicine_id  = m.id
  WHERE record_id = ?;
  `, [id])
  if (!data.length) { return data }

  const groupedData = {}
  data.forEach(row => {
    if (!groupedData[row.medicationId]) {
      // 若該medication還沒被加入groupedData，則建立該medication array
      const initMedication = {
        medicationId: row.medicationId,
        name: row.medicationName,
        type: row.medicationType,
        comment: row.medicationComment,
        details: []
      }
      groupedData[row.medicationId] = initMedication
    }
    const detail = {
      medicationDetailId: row.medicationDetailId,
      medicineId: row.medicineId,
      medicineName: row.medicineName,
      medicineUnitDose: row.medicineUnitDose,
      medicineDoseUnit: row.medicineDoseUnit,
      originalPrice: row.originalPrice,
      medicationDose: row.medicationDose,
      frequency: row.frequency,
      day: row.day,
      price: row.price,
      quantity: row.quantity,
      discount: row.discount,
      subtotal: row.subtotal
    }
    groupedData[row.medicationId].details.push(detail)
  })

  return groupedData
}

module.exports = { getRecordMedicationsByRecordId }
