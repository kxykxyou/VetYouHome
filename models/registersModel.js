const { db } = require('./mysql')

async function getAllTodayRegisters () {
  const [data] = await db.query(`
  SELECT 
    r.id AS registerId,
    r.reserve_time AS reserveTime,
    r.subjective AS registerSubjective,
    u.id AS vetId,
    u.fullname AS vetFullname,
    p.id AS petId,
    p.name AS petName,
    p.status AS petStatus,
    b.species AS petSpecies,
    b.breed AS petBreed,
    o.id AS ownerId,
    o.fullname AS ownerFullname,
    o.cellphone AS ownerCellphone

  FROM register AS r
  JOIN user AS u ON r.vet_id = u.id
  JOIN pet AS p ON r.pet_id = p.id
  JOIN breed AS b ON p.breed_id = b.id
  JOIN owner AS o ON p.owner_id = o.id
  WHERE DATE(r.reserve_time) = ?
  ORDER BY reserveTime
  `
  , [new Date().toISOString().split('T')[0]])
  return data
}

module.exports = {
  getAllTodayRegisters
}
