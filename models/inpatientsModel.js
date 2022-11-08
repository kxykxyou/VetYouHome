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
  const [data] = await db.query('SELECT * FROM cage')
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
            i.id as inpatientId,
            i.code as inpatientCode, 
            i.charge_start as chargeStart,
            i.charge_end as chargeEnd,
            i.cage as cage,
            i.summary as summary,
            p.id as petId,
            p.name as petName, 
            p.code as petCode,
            p.chip as petChip,
            p.status as petStatus,
            b.species as petSpecies,
            b.breed as petBreed,
            o.fullname as ownerFullname,
            o.cellphone as ownerCellphone,
            u.id as vetId,
            u.fullname as vetFullname
            FROM inpatient as i
            JOIN user as u on i.vet_id = u.id
            JOIN pet as p on i.pet_id = p.id 
            JOIN breed as b on p.breed_id = b.id
            JOIN owner as o on p.owner_id = o.id 
            ) as new_table
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
