const { db } = require('./mysql')
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
  console.log('query inpatient:', inpatient)
  return inpatient
}

async function getChargedPets () {
  const sql = `
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
  `
  const [data] = await db.query(sql)
  return data
}

async function searchInpatients (queryPairs) {
  let queryValues = []
  //   console.log(queryValues)
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
  console.log('sqlConditions', sqlConditions)
  console.log('queryValues: ', queryValues)
  const [data] = await db.execute(sql, queryValues)
  return data
}

async function discharge (id) {
  const dbConnection = await db.getConnection()
  const date = (new Date()).toISOString().split('T')[0]
  await dbConnection.beginTransaction()
  let result
  try {
    // update 3 tables: inpatient.charge_end, pet.status , cage.pet_id
    const [inpatient] = await dbConnection.execute('SELECT * FROM inpatient WHERE id = ?', [id])
    result = await dbConnection.execute('UPDATE inpatient SET charge_end = ? WHERE id = ?', [date, id])
    dbConnection.execute('UPDATE pet SET status = 0 WHERE id = ? ', [inpatient[0].pet_id])
    dbConnection.execute('UPDATE cage SET pet_id = NULL WHERE name = ? ', [inpatient[0].cage])
    console.log('result: ', result[0])
    await dbConnection.commit()
  } catch (err) {
    await dbConnection.rollback()
    console.log('discharge failed! id: ', id)
    console.log(err)
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
  } catch (err) {
    console.log(err)
    await dbConnection.rollback()
  } finally {
    dbConnection.release()
  }
}

module.exports = {
  query,
  getChargedPets,
  searchInpatients,
  discharge,
  swapCage
}
