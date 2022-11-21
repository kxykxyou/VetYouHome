const { db } = require('./mysql')

async function getRecordTreatmentsByRecordId (id) {
  const [data] = await db.execute('SELECT * FROM record_treatment WHERE record_id = ?', [id])
  return { data }
}

async function createRecordTreatment (recordId, body) {
  try {
    const [result] = await db.execute('INSERT INTO record_treatment (record_id, name, comment) VALUES (?, ?, ?)', [recordId, body.name, body.comment])
    return { id: result.insertId }
  } catch (err) {
    console.log(err)
    return { error: err.message }
  }
}

async function deleteRecordTreatment (body) {
  try {
    await db.execute('DELETE FROM record_treatment WHERE id = ?', [body.id])
  } catch (err) {
    console.log(err)
    return { error: err.message }
  }
  return {}
}

async function updateRecordTreatment (body) {
  try {
    await db.execute(`
    UPDATE record_treatment SET 
    name = ?, comment = ?
    WHERE id = ?`, [body.name, body.comment, body.id])
  } catch (err) {
    console.log(err)
    return { error: err.message }
  }
  return {}
}

module.exports = {
  getRecordTreatmentsByRecordId,
  createRecordTreatment,
  deleteRecordTreatment,
  updateRecordTreatment
}
