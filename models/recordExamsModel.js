const { db } = require('./mysql')

async function getRecordExamsByRecordId (id) {
  const [data] = await db.execute('SELECT * FROM record_exam WHERE record_id = ?', [id])
  return { data }
}

async function createRecordExam (recordId, body) {
  try {
    const [result] = await db.execute('INSERT INTO record_exam (record_id, name, comment) VALUES (?, ?, ?)', [recordId, body.name, body.comment])
    return { id: result.insertId }
  } catch (err) {
    console.log(err)
    return { error: err.message }
  }
}

async function deleteRecordExam (body) {
  try {
    await db.execute('DELETE FROM record_exam WHERE id = ?', [body.id])
  } catch (err) {
    console.log(err)
    return { error: err.message }
  }
  return {}
}

async function updateRecordExam (body) {
  try {
    await db.execute(`
    UPDATE record_exam SET 
    name = ?, comment = ?
    WHERE id = ?`, [body.name, body.comment, body.id])
  } catch (err) {
    console.log(err)
    return { error: err.message }
  }
  return {}
}

module.exports = {
  getRecordExamsByRecordId,
  createRecordExam,
  deleteRecordExam,
  updateRecordExam
}
