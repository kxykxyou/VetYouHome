const fs = require('fs')
const path = require('path')

// 1st class data
const users = [] // 十個醫師
const owners = [] // 十個飼主
const cages = [] // 36個籠位
const cageTypes = ['A', 'B', 'C', 'D']
const species = ['c', 'd']
const breeds = [] // 50 種貓品種、50 種狗品種
// const medicalOrders = []
// 就都給飼主寫
const exams = [] // 99種檢驗
const medicines = [] // 99種藥品
const doseUnits = ['mg/cap', 'mg/tab', 'mg/ml', 'mg/g']
const treatments = [] // 99種治療方式

// 2nd class data
const pets = []

// 3rd class data
const records = []
const inpatients = []
const inpatientDates = [
  '2022-10-31',
  '2022-10-01',
  '2022-11-04'
]

// 4th class data
const inpatientOrders = []
// const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
const frequencies = ['SID', 'BID', 'TID']
const frequencyMapSchedule = {
  SID: '7',
  BID: '7,19',
  TID: '7,13,19'
}

const recordExams = []
const recordMedications = []
const medicationType = ['藥粉', '膠囊', '錠劑', '藥水']

const recordTreatments = []

const firstTableMapData = {
  user: users,
  owner: owners,
  cage: cages,
  breed: breeds,
  exam: exams,
  medicine: medicines,
  treatment: treatments
}

const secondTableMapData = {
  pet: pets
}
const thirdTableMapData = {
  record: records,
  inpatient: inpatients
}

const fourthTableMapData = {
  inpatient_order: inpatientOrders,
  record_exam: recordExams,
  record_medication: recordMedications,
  record_treatment: recordTreatments
}

const data = {
  1: firstTableMapData,
  2: secondTableMapData,
  3: thirdTableMapData,
  4: fourthTableMapData
}

/**
 * =================================================================
 * 1st class data
 * =================================================================
 */

for (let i = 1; i < 11; i++) {
  const user = {
    hashed_password: 'hashed_password' + i,
    fullname: '獸醫' + i,
    cellphone: i < 10 ? '098765432' + i : '09876543' + i,
    email: 'vet' + i + '@example.com'
  }
  users.push(user)
}

for (let i = 1; i < 11; i++) {
  const owner = {
    fullname: '飼主' + i,
    cellphone: i < 10 ? '091234567' + i : '09123456' + i,
    email: 'owner' + i + '@example.com',
    address: '飼主住址' + i
  }
  owners.push(owner)
}

for (const type of cageTypes) {
  for (let i = 1; i < 10; i++) {
    const cage = {
      name: type + i
    }
    cages.push(cage)
  }
}

for (let i = 1; i < 51; i++) {
  for (const animalSpecies of species) {
    const breed = {
      species: animalSpecies,
      breed: animalSpecies === 'c' ? '貓咪品種' + i : '狗狗品種' + i
    }
    breeds.push(breed)
  }
}

for (let i = 1; i < 101; i++) {
  const exam = {
    name: '檢驗' + i,
    statement: '檢驗' + i + '的內建描述',
    price: Math.floor(Math.random() * 10) * 100
  }
  exams.push(exam)
}

for (let i = 1; i < 101; i++) {
  const medicine = {
    name: '藥品' + i,
    type: '藥品' + i + '的類別',
    dose: Math.floor(Math.random() * 10) * 10,
    dose_unit: doseUnits[Math.floor(Math.random() * doseUnits.length)],
    statement: '藥品' + i + '的內建描述',
    price: (Math.floor(Math.random() * 10) + 1) * 10
  }
  medicines.push(medicine)
}

for (let i = 1; i < 101; i++) {
  const treatment = {
    name: '治療' + i,
    statement: '治療' + i + '的內建描述',
    price: Math.floor(Math.random() * 10) * 1000
  }
  treatments.push(treatment)
}

/**
 * =================================================================
 * 2nd class data
 * @pet
 * const firstTableMapData = {
  user: users,
  owner: owners,
  cage: cageTypes,
  breed: breeds,
  exam: exams,
  medicine: medicines,
  treatment: treatments,
  pet: pets
}
 * =================================================================
 */

for (let i = 1; i < 101; i++) {
  const pet = {
    owner_id: Math.floor(Math.random() * 10) + 1,
    breed_id: Math.floor(Math.random() * 50) + 1,
    code: 'PET' + '22' + Math.floor(Math.random() * 100000),
    name: '寵物' + i,
    sex: Math.floor(Math.random() * 2),
    is_neutered: Math.floor(Math.random() * 2),
    birthday: '2020-10-10',
    chip: Math.floor(Math.random() * (10 ** 14)),
    comment: null,
    status: Math.floor(Math.random() * 4),
    status_comment: null
  }
  pets.push(pet)
}

/**
 * =================================================================
 * 3rd class data
 * @record: records
 * @inpatient: inpatients
 * =================================================================
 */

for (let i = 1; i < 501; i++) {
  const record = {
    code: 'REC' + '22' + Math.floor(Math.random() * 100000),
    vet_id: Math.floor(Math.random() * 10) + 1,
    pet_id: Math.floor(Math.random() * 100) + 1,
    subjective: '主觀症狀' + i,
    objective: '客觀數據' + i,
    assessment: '醫療診斷與評估' + i,
    plan: '治療計畫' + i,
    is_archive: Math.floor(Math.random() * 2)
  }
  records.push(record)
}

for (let i = 1; i < 101; i++) {
  const inpatient = {
    code: 'INP' + '22' + Math.floor(Math.random() * 100000),
    pet_id: Math.floor(Math.random() * 10) + 1,
    date: inpatientDates[Math.floor(Math.random() * inpatientDates.length)],
    cage: cages[Math.floor(Math.random() * cages.length)].name,
    comment: null
  }
  inpatients.push(inpatient)
}

/**
 * =================================================================
 * 4th class data
 * @inpatient_order: inpatientOrders,
 * @record_exam: recordExams,
 * @record_medication: recordMedications,
 * @record_treatment: recordTreatments
 * =================================================================
 */
for (let i = 1; i < 1001; i++) {
  const frequency = frequencies[Math.floor(Math.random() * frequencies.length)]
  const inpatientOrder = {
    inpatient_id: Math.floor(Math.random() * 100) + 1,
    priority: Math.floor(Math.random() * 100) + 1,
    content: '醫囑內容: ' + i,
    frequency,
    schedule: frequencyMapSchedule[frequency],
    comment: Math.floor(Math.random() * 2) ? '醫囑備註: ' + i : null
  }
  inpatientOrders.push(inpatientOrder)
}

for (let i = 1; i < 501; i++) {
  for (let j = 1; j < 3; j++) {
    const recordExam = {
      record_id: i,
      exam_id: Math.floor(Math.random() * 100) + 1,
      file_path: 'file_path',
      comment: Math.floor(Math.random() * 2) ? '檢驗備註: ' + i : null
    }
    const recordMedication = {
      record_id: i,
      medicine_id: Math.floor(Math.random() * 100) + 1,
      name: '處方藥名稱' + i,
      frequency: Math.floor(Math.random() * 3) + 1,
      day: Math.floor(Math.random() * 14) + 1,
      type: medicationType[Math.floor(Math.random() * medicationType.length)],
      comment: Math.floor(Math.random() * 2) ? '用藥備註: ' + i : null
    }

    const recordTreatment = {
      record_id: i,
      treatment_id: Math.floor(Math.random() * 100) + 1,

      comment: Math.floor(Math.random() * 2) ? '治療備註: ' + i : null
    }
    recordExams.push(recordExam)
    recordMedications.push(recordMedication)
    recordTreatments.push(recordTreatment)
  }
}

fs.writeFile(path.join(__dirname, 'fake-data.json'), JSON.stringify(data), (err) => {
  if (err) {
    console.log('failed to write fake data.')
    throw err
  }
  console.log('fake data saved!')
})
