-- select r.id as record_id, r.code as record_code, p.name as pet_name, o.fullname as owner_name from record as r where r.code = 
-- vetId, recordCode, isArchive, dateStart, dateEnd, petOwnerFullname, petCode, petChip, petName, petSpecies, petBreed

-- /records/search
SELECT * FROM
(
	SELECT
	r.id as recordId, 
	r.code as recordCode, 
    r.created_at as recordCreatedAt, 
    r.is_archive as isArchive, 
    p.code as petCode, 
    p.name as petName, 
    p.chip as petChip,
    p.status as petStatus,
    o.fullname as ownerFullname,
    b.species as petSpecies,
    b.breed as petBreed,
    u.id as vetId,
    u.fullname as vetFullname
    FROM record as r
    JOIN pet as p on r.pet_id = p.id 
    JOIN owner as o on p.owner_id = o.id 
    JOIN breed as b on p.breed_id = b.id
    JOIN user as u on r.vet_id = u.id
    
    ) as new_table
    ;
