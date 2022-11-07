const { db } = require('../models/mysql')
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

async function searchRecords (queryPairs) {
  let queryValues = []
  //   console.log(queryValues)
  let sql = `
        SELECT *
        FROM
        (
            SELECT
            r.id as recordId,
            r.code as recordCode, 
            r.created_at as recordCreatedAt, 
            r.is_archive as isArchive, 
            p.id as petId,
            p.name as petName, 
            p.code as petCode,
            p.chip as petChip,
            p.status as petStatus,
            b.species as petSpecies,
            b.breed as petBreed,
            o.fullname as ownerFullname,
            u.id as vetId,
            u.fullname as vetFullname
            FROM record as r 
            JOIN pet as p on r.pet_id = p.id 
            JOIN breed as b on p.breed_id = b.id
            JOIN owner as o on p.owner_id = o.id 
            JOIN user as u on r.vet_id = u.id
            ) as new_table
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
  console.log('sqlConditions', sqlConditions)
  console.log('queryValues: ', queryValues)
  const [data] = await db.execute(sql, queryValues)
  return data
}

module.exports = { getRecordById, searchRecords }
