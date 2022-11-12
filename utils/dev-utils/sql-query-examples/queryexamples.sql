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
    
    
-- /clinic/records/pet/id/:id
SELECT 
	u.fullname as vetFullname,
    r.id as recordId,
    r.code as recordCode,
    r.created_at as recordCreatedAt,
    r.updated_at as recordUpdatedAt,
    r.subjective as subjective,
    r.objective as objective,
    r.assessment as assessment,
    r.plan as plan,
    r.is_archive as isArchive,
    r.total as total,
    r.is_paid as isPaid
FROM pet as p 
JOIN record as r on r.pet_id = p.id
JOIN user as u on r.vet_id = u.id
WHERE p.id = 2;


-- /clinic/records/complex/id/:id
SELECT
   rm.id as medicationId,
   rm.name as medicationName,
   rm.type as medicationType,
   rm.comment as medicationComment,
   md.id as medicationDetailId,
   md.medicine_id as medicineId,
   m.name as medicineName,
   m.dose as medicineUnitDose,
   m.dose_unit as medicineDoseUnit,
   m.price as originalPrice,
   md.dose as medicationDose,
   md.frequency as frequency, 
   md.day as day, 
   md.price as price, 
   md.quantity as quantity, 
   md.discount as discount,
   md.subtotal as subtotal   
  FROM record_medication as rm 
  JOIN medication_detail AS md on rm.id = md.record_medication_id
  JOIN medicine as m on rm.medicine_id  = m.id
  WHERE record_id = 1;
  
SELECT 
    re.id as recordExamId,
    re.exam_id as examId,
    e.name as name,
    e.price as originalPrice,
    re.file_path as file_path,
    re.price as price,
    re.quantity as quantity,
    re.discount as discount,
    re.subtotal as subtotal,
    re.comment as comment
FROM record_exam as re
JOIN exam as e on re.exam_id = e.id
WHERE record_id = 1;


SELECT 
	rt.id as recordTreatmentId,
	rt.treatment_id as treatmentId,
    t.name as treatmentName,
    t.price as originalPrice,
    rt.price as price,
    rt.quantity as quantity,
    rt.discount as discount,
    rt.subtotal as subtotal,
    rt.comment as comment
FROM record_treatment as rt
JOIN treatment as t on rt.treatment_id = t.id
WHERE record_id = 1;
  