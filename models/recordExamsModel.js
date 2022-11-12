const { db } = require('./mysql')

async function getRecordExamsByRecordId (id) {
  const [data] = await db.execute(`
  SELECT 
    re.id as recordExamId,
    re.exam_id as examId,
    e.name as name,
    e.price as originalPrice,
    re.file_path as file_path,
    re.price as price,
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

module.exports = { getRecordExamsByRecordId }
