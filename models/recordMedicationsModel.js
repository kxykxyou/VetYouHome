const { db } = require('./mysql')
const xss = require('xss')

async function getMedicationComplexByRecordId (id) {
  const [data] = await db.execute(`
  SELECT
    rm.id as medicationId,
    rm.name as medicationName,
    rm.type as medicationType,
    rm.comment as medicationComment,
    md.id as medicationDetailId,
    m.id as medicineId,
    m.name as medicineName,
    m.type as medicineType,
    m.dose as medicineUnitDose,
    m.dose_unit as medicineDoseUnit,
    m.price as price,
    md.dose as medicationDose,
    md.frequency as frequency, 
    md.day as day, 
    md.quantity as quantity, 
    md.discount as discount,
    md.subtotal as subtotal
  FROM record_medication as rm 
  JOIN medication_detail AS md on rm.id = md.record_medication_id
  JOIN medicine as m on md.medicine_id = m.id
  WHERE rm.record_id = ?;
  `, [id])
  return data
}

async function createRecordMedication (body) {
  const dbConnection = await db.getConnection()
  await dbConnection.beginTransaction()
  try {
    const [medication] = await dbConnection.execute(`
    INSERT INTO record_medication 
    (record_id, name, type, comment)
    VALUES
    (?, ?, ?, ?)`, [body.recordId, xss(body.name), xss(body.type), xss(body.comment)])
    const medicationId = medication.insertId
    const insertMedicationDetailPromises = body.details.map(async detail => {
      const [medicine] = await dbConnection.execute('SELECT id FROM medicine WHERE name = ?', [detail.medicineName])
      const medicineId = medicine[0].id
      await dbConnection.execute(`
      INSERT INTO medication_detail
      (record_medication_id, medicine_id, dose, frequency, day)
      VALUES
      (?, ?, ?, ?, ?)
      `, [medicationId, medicineId, detail.medicationDose, detail.frequency, detail.day])
    })
    await Promise.all(insertMedicationDetailPromises)
    await dbConnection.commit()
    return {}
  } catch (error) {
    console.log(error)
    await dbConnection.rollback()
    return { error: 'Internal Server Error', status_code: 500 }
  } finally {
    await dbConnection.release()
  }
}

async function createMedicationDetail (body) {
  try {
    const [medicine] = await db.execute('SELECT id FROM medicine WHERE name = ?', [body.medicineName])
    if (!medicine.length) {
      return { error: 'invalid medicine name', status_code: 400 }
    }
    const medicineId = medicine[0].id
    const [result] = await db.execute(`
    INSERT INTO medication_detail 
    (record_medication_id, medicine_id, dose, frequency, day)
    VALUES
    (?, ?, ?, ?, ?)
    `, [body.medicationId, medicineId, body.medicationDose, body.frequency, body.day])
    return { id: result.insertId }
  } catch (error) {
    console.log(error)
    return { error: 'Internal Sever Error', status_code: 500 }
  }
}

async function updateMedicationDetail (body) {
  try {
    const [medicine] = await db.execute('SELECT id FROM medicine WHERE name = ?', [body.medicineName])
    if (!medicine.length) {
      return { error: 'invalid medicine name', status_code: 400 }
    }
    const medicineId = medicine[0].id
    await db.execute(`
    UPDATE medication_detail SET 
    medicine_id = ?, dose = ?, frequency = ?, day = ?
    WHERE id = ?`,
    [medicineId, body.medicationDose, body.frequency, body.day, body.medicationDetailId])
  } catch (error) {
    console.log(error)
    return { error: 'Internal Sever Error', status_code: 500 }
  }
  return {}
}

async function updateRecordMedication (body) {
  try {
    await db.execute(`
    UPDATE record_medication SET 
    name = ?, type = ?, comment = ?
    WHERE id = ?`,
    [xss(body.name), xss(body.type), xss(body.comment), body.id])
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
  return {}
}

async function deleteRecordMedication (body) {
  try {
    await db.execute('DELETE FROM record_medication WHERE id = ?', [body.id])
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
  return {}
}

async function deleteMedicationDetail (body) {
  try {
    await db.execute('DELETE FROM medication_detail WHERE id = ?', [body.medicationDetailId])
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
  return {}
}

module.exports = {
  getMedicationComplexByRecordId,
  createRecordMedication,
  createMedicationDetail,
  updateRecordMedication,
  updateMedicationDetail,
  deleteRecordMedication,
  deleteMedicationDetail
}
