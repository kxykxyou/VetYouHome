const { db } = require('./mysql')

async function getMedicationComplexByRecordId (id) {
  const [data] = await db.execute(`
  SELECT
    rm.id as medicationId,
    rm.name as medicationName,
    rm.type as medicationType,
    rm.comment as medicationComment,
    md.id as medicationDetailId,
    md.name as medicineName,
    md.dose as medicationDose,
    md.frequency as frequency, 
    md.day as day, 
    md.price as price, 
    md.quantity as quantity, 
    md.discount as discount,
    md.subtotal as subtotal
  FROM record_medication as rm 
  JOIN medication_detail AS md on rm.id = md.record_medication_id
  WHERE rm.record_id = ?;
  `, [id])
  if (!data.length) { return data }
  const groupedData = {}
  data.forEach(row => {
    if (!groupedData[row.medicationId]) {
      // 若該medication還沒被加入groupedData，則建立該medication array
      const medication = {
        id: row.medicationId,
        name: row.medicationName,
        type: row.medicationType,
        comment: row.medicationComment,
        details: []
      }
      groupedData[row.medicationId] = medication
    }
    const detail = {
      id: row.medicationDetailId,
      // medicineId: row.medicineId,
      name: row.medicineName,
      // medicineUnitDose: row.medicineUnitDose,
      // medicineDoseUnit: row.medicineDoseUnit,
      // originalPrice: row.originalPrice,
      dose: row.medicationDose,
      frequency: row.frequency,
      day: row.day,
      price: row.price,
      quantity: row.quantity,
      discount: row.discount,
      subtotal: row.subtotal
    }
    groupedData[row.medicationId].details.push(detail)
  })
  console.log('groupedData: ', groupedData)
  return { data: Object.values(groupedData) }
}

async function createRecordMedication (recordId, body) {
  const dbConnection = await db.getConnection()
  await dbConnection.beginTransaction()
  try {
    const [result] = await dbConnection.execute(`
    INSERT INTO record_medication 
    (record_id, name, type, comment)
    VALUES
    (?, ?, ?, ?)`, [recordId, body.name, body.type, body.comment])
    const medicationId = result.insertId
    const insertMedicationDetailPromises = body.details.map(detail => {
      return dbConnection.execute(`
      INSERT INTO medication_detail 
      (record_medication_id, name, dose, frequency, day)
      VALUES
      (?, ?, ?, ?, ?)
      `, [medicationId, detail.name, detail.dose, detail.frequency, detail.day])
    })
    await Promise.all(insertMedicationDetailPromises)
    await dbConnection.commit()
    return body
  } catch (err) {
    console.log(err)
    await dbConnection.rollback()
    return { error: err.message }
  } finally {
    await dbConnection.release()
  }
}

async function createMedicationDetail (medicationId, body) {
  try {
    console.log('body: ', body)
    const [result] = await db.execute(`
    INSERT INTO medication_detail 
    (record_medication_id, name, dose, frequency, day)
    VALUES
    (?, ?, ?, ?, ?)
    `, [medicationId, body.name, body.dose, body.frequency, body.day])
    return { id: result.insertId }
  } catch (err) {
    console.log(err)
    return { error: err.message }
  }
}

async function updateMedicationDetail (body) {
  try {
    await db.execute(`
    UPDATE medication_detail SET 
    name = ?, dose = ?, frequency = ?, day = ?
    WHERE id = ?`, [body.name, body.dose, body.frequency, body.day, body.id])
  } catch (err) {
    console.log(err)
    return { error: err.message }
  }
  return {}
}

async function updateRecordMedication (body) {
  try {
    await db.execute(`
    UPDATE record_medication SET 
    name = ?, type = ?, comment = ?
    WHERE id = ?`, [body.name, body.type, body.comment, body.id])
  } catch (err) {
    console.log(err)
    return { error: err.message }
  }
  return {}
}

async function deleteRecordMedication (body) {
  try {
    await db.execute('DELETE FROM record_medication WHERE id = ?', [body.id])
  } catch (err) {
    console.log(err)
    return { error: err.message }
  }
  return {}
}

async function deleteMedicationDetail (body) {
  try {
    await db.execute('DELETE FROM medication_detail WHERE id = ?', [body.id])
  } catch (err) {
    console.log(err)
    return { error: err.message }
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
