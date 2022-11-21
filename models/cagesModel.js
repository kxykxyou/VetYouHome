const { db } = require('./mysql')

async function getAllCages () {
  const [data] = await db.query(`
  SELECT 
    c.name as cageName,
    i.id as inpatientId,
    p.id as petId,
    p.name as petName
  FROM cage as c
  LEFT JOIN inpatient as i on c.inpatient_id = i.id
  LEFT JOIN pet as p on i.pet_id = p.id
  ORDER BY cageName
  `
  )
  return data
}

async function getOpenCages () {
  const [data] = await db.query('SELECT * FROM cage WHERE inpatient_id IS NULL ORDER BY name')
  return data
}

module.exports = {
  getAllCages,
  getOpenCages
}
