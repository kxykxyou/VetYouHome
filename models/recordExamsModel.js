const { db } = require('./mysql')
const xss = require('xss')

async function getRecordExamsByRecordId (id) {
  const [data] = await db.execute(`
  SELECT 
    re.id as recordExamId,
    e.name as examName,
    e.price as price,
    re.file_path as filePath,
    re.quantity as quantity,
    re.discount as discount,
    re.subtotal as subtotal,
    re.comment as comment
  FROM record_exam as re
  JOIN exam as e on re.exam_id = e.id
  WHERE record_id = ?`
  , [id])
  return data
}

async function createRecordExam (body) {
  try {
    const [exam] = await db.execute('SELECT id FROM exam WHERE name = ?', [body.examName])
    const examId = exam[0].id
    const [result] = await db.execute(`
    INSERT INTO record_exam 
    (record_id, exam_id, comment, file_path) 
    VALUES 
    (?, ?, ?, ?)`
    , [body.recordId, examId, body.comment, ''])

    return { id: result.insertId }
  } catch (error) {
    console.log(error)
    return { error: error.message, status_code: 500 }
  }
}

async function deleteRecordExam (body) {
  try {
    await db.execute('DELETE FROM record_exam WHERE id = ?', [body.recordExamId])
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
  return {}
}

async function updateRecordExam (body) {
  console.log('body: ', body)
  try {
    const [exam] = await db.execute('SELECT id FROM exam WHERE name = ?', [body.examName])
    const examId = exam[0].id
    await db.execute(`
    UPDATE record_exam SET 
    exam_id = ?, file_path = ?, quantity = ?, discount = ?, subtotal = ?, comment = ?
    WHERE id = ?`,
    [
      examId,
      body.filePath !== undefined ? body.filePath : '',
      body.quantity !== undefined ? body.quantity : 1,
      body.discount !== undefined ? body.discount : 1,
      body.subtotal !== undefined ? body.subtotal : 0,
      xss(body.comment),
      body.recordExamId
    ])
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
  return {}
}

module.exports = {
  getRecordExamsByRecordId,
  createRecordExam,
  deleteRecordExam,
  updateRecordExam
}
