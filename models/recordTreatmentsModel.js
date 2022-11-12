const { db } = require('./mysql')

async function getRecordTreatmentsByRecordId (id) {
  const [data] = await db.execute(`
  SELECT 
    rt.id as recordTreatmentId,
    rt.treatment_id as treatmentId,
    t.name as treatmentName,
    t.price as originalPrice,
    rt.price as price,
    rt.quantity as quantity,
    rt.discount as discount,
    rt.subtotal as subtotal,
    rt.comment as comment
  FROM record_treatment as rt
  JOIN treatment as t on rt.treatment_id = t.id
  WHERE record_id = ?
  `, [id])
  return data
}

module.exports = { getRecordTreatmentsByRecordId }
