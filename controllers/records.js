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

async function getRecordById (req, res, next) {
  const id = req.params.id
  const [data] = await db.execute('SELECT * FROM record WHERE id = ?', [id])
  return res.status(200).json({ data: data[0] })
}

async function searchRecords (req, res, next) {
//   console.log('req:', req)
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
  if (req.query.dateStart && req.query.dateEnd) {
    sqlConditions.push('recordCreatedAt BETWEEN ? AND ?')
    queryValues.push(req.query.dateStart)
    queryValues.push(req.query.dateEnd)
  } else if (req.query.dateStart) {
    sqlConditions.push('recordCreatedAt >= ?')
    queryValues.push(req.query.dateStart)
  } else if (req.query.dateEnd) {
    sqlConditions.push('recordCreatedAt <= ?')
    queryValues.push(req.query.dateEnd)
  }

  sqlConditions = [
    ...sqlConditions,
    ...recordQueryFields
      .filter((field) => req.query[field])
      .map(field => `${field} = ?`)
  ]
  queryValues = [
    ...queryValues,
    ...recordQueryFields
      .filter((field) => req.query[field])
      .map((field) => req.query[field])
  ]

  if (sqlConditions.length > 0) {
    sql = sql + 'WHERE ' + sqlConditions.join(' AND ')
  }
  console.log('sqlConditions', sqlConditions)
  console.log('queryValues: ', queryValues)
  // console.log('sql: ', sql)
  const [data] = await db.execute(sql, queryValues)
  return res.status(200).json({ data })
}

module.exports = { getRecordById, searchRecords }
