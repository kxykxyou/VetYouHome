const { db } = require('./mysql')
const recordExamsModel = require('./recordExamsModel')
const recordMedicationsModel = require('./recordMedicationsModel')
const recordTreatmentsModel = require('./recordTreatmentsModel')
const { randomCodeGenerator } = require('../utils/utils')
const recordQueryFields = [
  'vetId',
  'recordCode',
  'isArchive',
  'ownerFullname',
  'petCode',
  'petChip',
  'petName',
  'petSpecies',
  'petBreed'
]

async function getRecordById (id) {
  const [data] = await db.execute('SELECT * FROM record WHERE id = ?', [id])
  return data[0]
}

async function getAllRecordsByPetId (id) {
  const [data] = await db.execute(`
  SELECT 
      u.fullname as vetFullname,
      r.id as recordId,
      r.code as recordCode,
      r.created_at as recordCreatedAt,
      r.updated_at as recordUpdatedAt,
      r.subjective as subjective,
      r.objective as objective,
      r.assessment as assessment,
      r.plan as plan,
      r.is_archive as isArchive,
      r.total as total,
      r.is_paid as isPaid
  FROM pet as p 
  JOIN record as r on r.pet_id = p.id
  JOIN user as u on r.vet_id = u.id
  WHERE p.id = ?
    `, [id])
  return data
}

async function searchRecords (queryPairs) {
  let queryValues = []
  //   console.log(queryValues)
  let sql = `
        SELECT *
        FROM
        (
            SELECT
            r.id AS recordId,
            r.code AS recordCode, 
            r.created_at AS recordCreatedAt, 
            r.is_archive AS isArchive, 
            p.id AS petId,
            p.name AS petName, 
            p.code AS petCode,
            p.chip AS petChip,
            p.status AS petStatus,
            b.species AS petSpecies,
            b.breed AS petBreed,
            o.fullname AS ownerFullname,
            o.cellphone AS ownerCellphone,
            u.id AS vetId,
            u.fullname AS vetFullname
            FROM record AS r 
            JOIN pet AS p ON r.pet_id = p.id 
            JOIN breed AS b ON p.breed_id = b.id
            JOIN owner AS o ON p.owner_id = o.id 
            JOIN user AS u ON r.vet_id = u.id
            ) AS new_table
            `

  let sqlConditions = []
  if (queryPairs.dateStart && queryPairs.dateEnd) {
    sqlConditions.push('recordCreatedAt BETWEEN ? AND ?')
    queryValues.push(queryPairs.dateStart)
    queryValues.push(queryPairs.dateEnd)
  } else if (queryPairs.dateStart) {
    sqlConditions.push('recordCreatedAt >= ?')
    queryValues.push(queryPairs.dateStart)
  } else if (queryPairs.dateEnd) {
    sqlConditions.push('recordCreatedAt <= ?')
    queryValues.push(queryPairs.dateEnd)
  }

  sqlConditions = [
    ...sqlConditions,
    ...recordQueryFields
      .filter((field) => queryPairs[field])
      .map(field => `${field} = ?`)
  ]
  queryValues = [
    ...queryValues,
    ...recordQueryFields
      .filter((field) => queryPairs[field])
      .map((field) => queryPairs[field])
  ]

  if (sqlConditions.length > 0) {
    sql = sql + 'WHERE ' + sqlConditions.join(' AND ')
  }
  sql += ' ORDER BY recordId DESC'
  console.log('/records/search sqlConditions', sqlConditions)
  console.log('/records/search queryValues: ', queryValues)
  const [data] = await db.execute(sql, queryValues)
  return data
}

async function createRecord (vetId, body) {
  const { subjective, objective, assessment, plan, exams, medications, treatments, petId } = body
  const dbConnection = await db.getConnection()
  await dbConnection.beginTransaction()
  try {
    const [record] = await dbConnection.execute(`
      INSERT INTO record (code, vet_id, pet_id, subjective, objective, assessment, plan)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['REC' + '22' + randomCodeGenerator(5), vetId, petId, subjective, objective, assessment, plan])
    console.log('record: ', record)
    const recordId = record.insertId
    const examInsertPromises = exams.map(async (exam) => {
      const [examQuery] = await dbConnection.execute('SELECT id FROM exam WHERE name = ?', [exam.examName])
      const examId = examQuery[0].id
      await dbConnection.execute(`
      INSERT INTO record_exam 
      (record_id, exam_id, comment, file_path) 
      VALUES 
      (?, ?, ?, ?)`
      , [recordId, examId, exam.comment, ''])
    })
    console.log('after exam')
    const treatmentInsertPromises = treatments.map(async (treatment) => {
      const [treatmentQuery] = await dbConnection.execute('SELECT id FROM treatment WHERE name = ?', [treatment.treatmentName])
      const treatmentId = treatmentQuery[0].id
      await dbConnection.execute(`
      INSERT INTO record_treatment 
      (record_id, treatment_id, comment) 
      VALUES 
      (?, ?, ?)`
      , [recordId, treatmentId, treatment.comment])
    })
    console.log('after treatment')

    const medicationDetailInsertPromises = []
    Object.values(medications).forEach(async (medication) => {
      const [medicationResult] = await dbConnection.execute(`
        INSERT INTO record_medication
        (record_id, name, type, comment)
        VALUES
        (?, ?, ?, ?)`,
      [recordId, medication.name, medication.type, medication.comment])
      const medicationId = medicationResult.insertId
      const insertMedicationDetailPromises = medication.details.map(async (detail) => {
        const [medicineQuery] = await dbConnection.execute('SELECT id FROM medicine WHERE name = ?', [detail.medicineName])
        const medicineId = medicineQuery[0].id
        console.log(detail)
        await dbConnection.execute(`
          INSERT INTO medication_detail
          (record_medication_id, medicine_id, dose, frequency, day)
          VALUES
          (?, ?, ?, ?, ?)
          `, [medicationId, medicineId, detail.medicationDose, detail.frequency, detail.day])
      })
      medicationDetailInsertPromises.push(...insertMedicationDetailPromises)
    })

    console.log('prepared to promise.all')
    let insertionSuccess = true
    await Promise.all(examInsertPromises)
      .then(res => console.log('examInsertPromises result', res))
      .catch((res) => { insertionSuccess = false })
    await Promise.all(treatmentInsertPromises)
      .then(res => console.log('treatmentInsertPromises result', res))
      .catch((res) => { insertionSuccess = false })
    await Promise.all(medicationDetailInsertPromises)
      .then(res => console.log('medicationDetailInsertPromises', res))
      .catch((res) => { insertionSuccess = false })
    if (insertionSuccess) {
      await dbConnection.commit()
    } else {
      throw new Error('insertion failed')
    }
  } catch (err) {
    console.log('error happened while creating records', err)
    await dbConnection.rollback()
    return { error: err, status_code: 500 }
  } finally {
    await dbConnection.release()
  }
  return {}
}

async function deleteRecord (id) {
  try {
    await db.execute('DELETE FROM record WHERE id = ?', [id])
  } catch (err) {
    console.log(err)
    return { error: err.message }
  }
  return {}
}

async function updateRecord (body) {
  try {
    await db.execute(`
    UPDATE record SET 
    subjective = ?, objective = ?, assessment = ?, plan = ?
    WHERE id = ?`, [body.subjective, body.objective, body.assessment, body.plan, body.id])
  } catch (err) {
    console.log(err)
    return { error: err.message }
  }
  return {}
}

module.exports = {
  getRecordById,
  searchRecords,
  getAllRecordsByPetId,
  createRecord,
  deleteRecord,
  updateRecord
}
