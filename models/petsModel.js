const { db } = require('./mysql')

async function getPetById (id) {
  const [data] = await db.execute('SELECT * FROM pet WHERE id = ?', [id])
  return data[0]
}

async function getClinicPetById (id) {
  const [data] = await db.execute(`
  SELECT 
      p.id as petId,
      p.code as petCode,
      p.name as petName,
      p.sex,
      b.species as petSpecies,
      b.breed as petBreed,
      p.is_neutered as isNeutered,
      p.birthday,
      p.chip,
      p.status,
      p.comment,
      o.fullname as ownerFullname,
      o.cellphone as ownerCellphone
  FROM pet as p
  JOIN breed as b on b.id = p.breed_id
  JOIN owner as o on o.id = p.owner_id
  WHERE p.id = ?;
  `, [id])
  // console.log(data)
  return data[0]
}

module.exports = {
  getPetById,
  getClinicPetById
}
