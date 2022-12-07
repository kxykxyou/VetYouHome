const { db } = require('./mysql')

async function getRecordTreatmentsByRecordId (id) {
  const [data] = await db.execute(`
  SELECT 
    rt.id as recordTreatmentId,
    t.name as treatmentName,
    t.price as price,
    rt.quantity as quantity,
    rt.discount as discount,
    rt.subtotal as subtotal,
    rt.comment as comment
  FROM record_treatment as rt
  JOIN treatment as t on rt.treatment_id = t.id
  WHERE record_id = ?`
  , [id])
  return data
}

async function createRecordTreatment (body) {
  try {
    const [treatment] = await db.execute('SELECT id FROM treatment WHERE name = ?', [body.treatmentName])
    if (!treatment.length) {
      return { error: 'invalid treatment name', status_code: 400 }
    }
    const treatmentId = treatment[0].id
    const [result] = await db.execute(`
    INSERT INTO record_treatment 
    (record_id, treatment_id, comment) 
    VALUES 
    (?, ?, ?)`
    , [body.recordId, treatmentId, body.comment])
    return { id: result.insertId }
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
}

async function deleteRecordTreatment (body) {
  try {
    await db.execute('DELETE FROM record_treatment WHERE id = ?', [body.recordTreatmentId])
  } catch (error) {
    console.log(error)
    return { error: 'Internal Server Error', status_code: 500 }
  }
  return {}
}

async function updateRecordTreatment (body) {
  try {
    const [treatment] = await db.execute('SELECT id FROM treatment WHERE name = ?', [body.treatmentName])
    if (!treatment.length) {
      return { error: 'invalid treatment name', status_code: 400 }
    }
    const treatmentId = treatment[0].id
    await db.execute(`
    UPDATE record_treatment SET 
    treatment_id = ?, quantity = ?, discount = ?, subtotal = ?, comment = ?
    WHERE id = ?`,
    [treatmentId, body.quantity, body.discount, body.subtotal, body.comment, body.recordTreatmentId])
  } catch (error) {
    console.log(error)
    return { error: 'Internal Server Error', status_code: 500 }
  }
  return {}
}

module.exports = {
  getRecordTreatmentsByRecordId,
  createRecordTreatment,
  deleteRecordTreatment,
  updateRecordTreatment
}
