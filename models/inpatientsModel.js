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
            ORDER BY inpatientId DESC
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

module.exports = { getChargedPets, searchInpatients }
