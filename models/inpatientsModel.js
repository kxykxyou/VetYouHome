const { db } = require('./mysql')
const { randomCodeGenerator } = require('../utils/utils')
const inpatientQueryFields = [
  'inpatientCode',
  'vetId',
  'ownerFullname',
  'petCode',
  'petChip',
  'petName',
  'petSpecies',
  'petBreed'
]

async function query (id) {
  const [inpatient] = await db.execute('SELECT * FROM inpatient WHERE id = ?', [id])
  return inpatient
}

async function getChargedPets () {
  const [data] = await db.query(`
    SELECT *
    FROM
    (
      SELECT 
      i.id AS inpatientId,
      i.code AS inpatientCode, 
      i.charge_start AS chargeStart,
      i.charge_end AS chargeEnd,
      i.cage AS inpatientCage,
      i.summary AS inpatientSummary,
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
      
      FROM inpatient AS i
      JOIN user AS u ON i.vet_id = u.id
      JOIN pet AS p ON i.pet_id = p.id 
      JOIN breed AS b ON p.breed_id = b.id
      JOIN owner AS o ON p.owner_id = o.id 
    ) AS new_table
    WHERE chargeEnd IS NULL
    ORDER BY inpatientCage
  `)
  return data
}

async function searchInpatients (queryPairs) {
  let queryValues = []
  let sql = `
        SELECT *
        FROM
        (
            SELECT
            i.id AS inpatientId,
            i.code AS inpatientCode, 
            i.charge_start AS chargeStart,
            i.charge_end AS chargeEnd,
            i.cage AS cage,
            i.summary AS summary,
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
            FROM inpatient AS i
            JOIN user AS u ON i.vet_id = u.id
            JOIN pet AS p ON i.pet_id = p.id 
            JOIN breed AS b ON p.breed_id = b.id
            JOIN owner AS o ON p.owner_id = o.id 
        ) AS new_table
            `

  let sqlConditions = []
  if (queryPairs.dateStart && queryPairs.dateEnd) {
    sqlConditions.push('chargeEnd BETWEEN ? AND ?')
    queryValues.push(queryPairs.dateStart)
    queryValues.push(queryPairs.dateEnd)
  } else if (queryPairs.dateStart) {
    sqlConditions.push('chargeEnd >= ?')
    queryValues.push(queryPairs.dateStart)
  } else if (queryPairs.dateEnd) {
    sqlConditions.push('chargeEnd <= ?')
    queryValues.push(queryPairs.dateEnd)
  }

  sqlConditions = [
    ...sqlConditions,
    ...inpatientQueryFields
      .filter((field) => queryPairs[field])
      .map(field => `${field} = ?`)
  ]
  queryValues = [
    ...queryValues,
    ...inpatientQueryFields
      .filter((field) => queryPairs[field])
      .map((field) => queryPairs[field])
  ]

  if (sqlConditions.length > 0) {
    sql = sql + 'WHERE ' + sqlConditions.join(' AND ')
  }
  sql += ' ORDER BY inpatientId DESC'
  const [data] = await db.execute(sql, queryValues)
  return data
}

async function discharge (id) {
  const dbConnection = await db.getConnection()
  const date = (new Date()).toISOString().split('T')[0] // 取出UTC date
  await dbConnection.beginTransaction()
  let result
  try {
    // update 3 tables: inpatient.charge_end, pet.status , cage.pet_id
    const [inpatient] = await dbConnection.execute('SELECT * FROM inpatient WHERE id = ?', [id])
    result = await dbConnection.execute('UPDATE inpatient SET charge_end = ? WHERE id = ?', [date, id])
    await dbConnection.execute('UPDATE pet SET status = 0 WHERE id = ? ', [inpatient[0].pet_id])
    await dbConnection.execute('UPDATE cage SET inpatient_id = NULL WHERE name = ? ', [inpatient[0].cage])
    await dbConnection.commit()
  } catch (error) {
    await dbConnection.rollback()
    console.log(error)
  } finally {
    await dbConnection.release()
  }
  return result[0]
}

async function swapCage (cage1, cage2) {
  const [patient1] = await db.execute('SELECT inpatient_id FROM cage WHERE name = ?', [cage1])
  const [patient2] = await db.execute('SELECT inpatient_id FROM cage WHERE name = ?', [cage2])

  const dbConnection = await db.getConnection()

  try {
  // 如果cage2沒有住病人的話，patient1改籠位, 對應的cages也update inpatient_id
    if (!patient2.length) {
      await dbConnection.execute('UPDATE inpatient SET cage = ? WHERE id = ?', [cage2, patient1[0].inpatient_id])
      await dbConnection.execute('UPDATE cage SET inpatient_id = ? WHERE name = ?', [patient1[0].inpatient_id, cage2])
    } else {
      // 兩個籠位都有住人，swap
      await dbConnection.execute('UPDATE inpatient SET cage = ? WHERE id = ?', [cage2, patient1[0].inpatient_id])
      await dbConnection.execute('UPDATE inpatient SET cage = ? WHERE id = ?', [cage1, patient2[0].inpatient_id])
      // flush兩個籠子的(因為cage.inpatient_id限制unique)
      await dbConnection.execute('UPDATE cage SET inpatient_id = NULL WHERE name in (?, ?)', [cage1, cage2])
      await dbConnection.execute('UPDATE cage SET inpatient_id = ? WHERE name = ?', [patient1[0].inpatient_id, cage2])
      await dbConnection.execute('UPDATE cage SET inpatient_id = ? WHERE name = ?', [patient2[0].inpatient_id, cage1])
    }
    dbConnection.commit()
  } catch (error) {
    console.log(error)
    await dbConnection.rollback()
  } finally {
    dbConnection.release()
  }
}

async function getAllInpatientOrdersByPetId (id) {
  const [data] = await db.execute(`
  SELECT 
    i.id as inpatientId,
    i.code as inpatientCode,
    i.cage as cage,
    u.fullname as vetFullname,
    io.id as inpatientOrderId,
    io.code as inpatientOrderCode,
    io.date as targetDate,
    io.created_at as inpatientOderCreatedAt,
    io.created_at as inpatientOderUpdatedAt,
    io.is_paid as inpatientOrderIsPaid,
    io.total as inpatientOrderTotal,
    io.comment as inpatientOrderComment
  FROM inpatient as i
  JOIN user as u on i.vet_id = u.id
  JOIN inpatient_order as io on io.inpatient_id = i.id
  WHERE i.pet_id = ?
  `, [id])
  return data
}

async function getInpatientAndOrderByInpatientOrderId (id) {
  const [data] = await db.execute(`
  SELECT 
    io.id as inpatientOrderId,
    io.code as inpatientOrderCode,
    io.date as targetDate,
    io.created_at as inpatientOderCreatedAt,
    io.updated_at as inpatientOderUpdatedAt,
    io.comment as inpatientOrderComment,
    io.is_paid as isPaid,
    io.total as total,
    i.cage as cage,
    i.summary as inpatientSummary,
    u.id as vetId,
    u.fullname as vetFullname,
    p.id as petId,
    p.name as petName,
    p.code as petCode
  FROM inpatient_order as io 
  JOIN inpatient as i on io.inpatient_id = i.id
  JOIN user as u on i.vet_id = u.id
  JOIN pet as p on i.pet_id = p.id
  WHERE io.id = ?;
    `, [id])
  return data[0]
}

async function getInpatientOrderDetailsByInpatientOrderId (id) {
  const [data] = await db.execute(`
  SELECT * FROM inpatient_order_detail WHERE inpatient_order_id = ?`
  , [id])
  return data
}

async function getInpatientOrderById (id) {
  const [data] = await db.execute('SELECT * FROM inpatient_order WHERE id = ?', [id])
  return data[0]
}

async function getMostRecentInpatientByPetId (id) {
  const [data] = await db.execute('SELECT * FROM inpatient WHERE id = (SELECT MAX(id) FROM inpatient WHERE pet_id = ?)', [id])
  return data[0]
}

async function createInpatientOrder (userId, body) {
  const dbConnection = await db.getConnection()
  let result
  try {
    await dbConnection.beginTransaction()
    const inpatientOrderInsertResult = await dbConnection.execute(`
      INSERT INTO inpatient_order (code, inpatient_id, date, comment) 
      VALUES (?, ?, ?, ?)`, ['ORD22' + randomCodeGenerator(5), body.id, body.date, body.comment])
    result = inpatientOrderInsertResult[0]
    const insertInpatientOrderDetailPromises = body.details.map(async (inpatientOrderDetail) => {
      await dbConnection.execute(`
        INSERT INTO inpatient_order_detail 
        (inpatient_order_id, priority, content, frequency, schedule, times, comment) 
        VALUES 
        (?, ?, ?, ?, ?, ?, ?)`, [
        result.insertId,
        inpatientOrderDetail.priority,
        inpatientOrderDetail.content,
        inpatientOrderDetail.frequency,
        inpatientOrderDetail.schedule,
        inpatientOrderDetail.schedule.split(',').length,
        inpatientOrderDetail.comment
      ])
    })
    await Promise.all(insertInpatientOrderDetailPromises)
    await dbConnection.commit()
    return { message: 'inpatient order & detail insert success!' }
  } catch (error) {
    console.log(error)
    await dbConnection.rollback()
    return { error: 'Error happened while create inpatient order', status_code: 500 }
  } finally {
    await dbConnection.release()
  }
}

async function createInpatientOrderDetail (inpatientOrderId, body) {
  try {
    const [result] = await db.execute(`
    INSERT INTO inpatient_order_detail 
    (inpatient_order_id, priority, content, frequency, schedule, comment)
    VALUES
    (?, ?, ?, ?, ?, ?)
    `, [body.inpatientOrderId, body.priority, body.content, body.frequency, body.schedule, body.comment])
    return { id: result.insertId }
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
}

async function createInpatient (userId, body) {
  const dbConnection = await db.getConnection()
  try {
    await dbConnection.beginTransaction()
    const [result] = await dbConnection.execute(`
    INSERT INTO inpatient (code, vet_id, pet_id, cage, summary) VALUES (?, ?, ?, ?, ?)
    `, ['INP' + '22' + randomCodeGenerator(5), userId, body.petId, body.cage, body.summary]
    )
    const inpatientId = result.insertId
    // update cage and pet info
    await dbConnection.execute(`
    UPDATE cage SET inpatient_id = ? WHERE name = ?
    `, [inpatientId, body.cage]
    )
    await dbConnection.execute('UPDATE pet SET status = 3 WHERE id = ?', [body.petId])
    await dbConnection.commit()
    return { message: 'inpatient insert success!' }
  } catch (error) {
    console.log(error)
    await dbConnection.rollback()
    return { error: 'Error happened while create inpatient order', status_code: 500 }
  } finally {
    await dbConnection.release()
  }
}

async function deleteInpatientOrder (id) {
  try {
    await db.execute('DELETE FROM inpatient_order WHERE id = ?', [id])
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
  return {}
}

async function deleteInpatientOrderDetail (body) {
  try {
    await db.execute('DELETE FROM inpatient_order_detail WHERE id = ?', [body.id])
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
  return {}
}

async function updateInpatientOrder (body) {
  try {
    await db.execute(`
    UPDATE inpatient_order SET
    comment = ?
    WHERE id = ?
    `, [body.comment, body.id]
    )
    return {}
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
}

async function updateInpatientOrderDetail (body) {
  try {
    await db.execute(`
    UPDATE inpatient_order_detail SET 
    priority = ?, content = ?, frequency = ?, schedule = ?, comment = ?
    WHERE id = ?`, [body.priority, body.content, body.frequency, body.schedule, body.comment, body.id])
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
  return {}
}

async function getTodayInpatientOrderComplexByInpatientId (inpatientId) {
  const today = new Date().toISOString().split('T')[0]

  const [todayInpatientOrder] = await db.execute(`
  SELECT 
    * 
  FROM inpatient as i
  JOIN inpatient_order as io on io.inpatient_id = i.id
  WHERE i.id = ? AND io.date = ?
  `, [inpatientId, today])
  if (!todayInpatientOrder.length) { return { data: {} } }

  const inpatientOrder = todayInpatientOrder[0]
  const [inpatientOrderDetails] = await db.execute('SELECT * FROM inpatient_order_detail WHERE inpatient_order_id = ?', [inpatientOrder.id])
  inpatientOrder.details = inpatientOrderDetails

  return { data: inpatientOrder }
}

async function getInpatientOrderComplexByInpatientOrderId (inpatientOrderId) {
  const [inpatientOrder] = await db.execute(`
  SELECT 
    * 
  FROM inpatient_order
  WHERE id = ?
  `, [inpatientOrderId])
  if (!inpatientOrder.length) { return { data: {} } }

  const [inpatientOrderDetails] = await db.execute('SELECT * FROM inpatient_order_detail WHERE inpatient_order_id = ?', [inpatientOrderId])
  inpatientOrder[0].details = inpatientOrderDetails

  return { data: inpatientOrder[0] }
}

module.exports = {
  query,
  getChargedPets,
  searchInpatients,
  discharge,
  swapCage,
  getAllInpatientOrdersByPetId,
  getInpatientAndOrderByInpatientOrderId,
  getInpatientOrderDetailsByInpatientOrderId,
  getInpatientOrderById,
  getMostRecentInpatientByPetId,
  getTodayInpatientOrderComplexByInpatientId,
  getInpatientOrderComplexByInpatientOrderId,
  createInpatientOrder,
  createInpatientOrderDetail,
  createInpatient,
  deleteInpatientOrder,
  deleteInpatientOrderDetail,
  updateInpatientOrder,
  updateInpatientOrderDetail
}
