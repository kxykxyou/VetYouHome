async function generateFakeData () {
  require('dotenv').config('../../.env')
  const fsPromise = require('fs/promises')
  const path = require('path')
  const argon2 = require('argon2')
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
  const password = 'test'
  const hashedPassword = await argon2.hash(password, process.env.ARGON2_SALT)

  // 3rd class data
  const registers = []
  const appointmentTimeAndVetIdPair = [
    '10:00:00, 9',
    '10:00:00, 8',
    '10:30:00, 7',
    '11:00:00, 6',
    '11:30:00, 5',
    '10:00:00, 4',
    '10:30:00, 3',
    '11:00:00, 2',
    '11:30:00, 1',
    '12:00:00, 10',
    '12:30:00, 9',
    '13:00:00, 8',
    '13:30:00, 7',
    '14:00:00, 6',
    '14:30:00, 5',
    '15:00:00, 4',
    '15:30:00, 3',
    '16:00:00, 2',
    '16:30:00, 1'
  ]

  const records = []
  const inpatients = []
  const inpatientDates = [
    {
      inpatientDateStart: '2022-11-01',
      inpatientDateEnd: '2022-11-01',
      inpatientOrderCreatedAt: ['2022-11-01']
    }, {
      inpatientDateStart: '2022-10-30',
      inpatientDateEnd: '2022-10-31',
      inpatientOrderCreatedAt: ['2022-10-30', '2022-10-31']
    }, {
      inpatientDateStart: '2022-09-01',
      inpatientDateEnd: '2022-09-05',
      inpatientOrderCreatedAt: ['2022-09-01', '2022-09-02', '2022-09-03', '2022-09-04', '2022-09-05']
    }, {
      inpatientDateStart: '2022-08-24',
      inpatientDateEnd: '2022-08-26',
      inpatientOrderCreatedAt: ['2022-08-24', '2022-08-25', '2022-08-26']
    }
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

  // 5th class data
  const inpatientOrderDetails = []
  const medicationDetails = []

  /**
 * =================================================================
 * level maps data
 * =================================================================
 */
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
    register: registers,
    record: records,
    inpatient: inpatients
  }

  const fourthTableMapData = {
    inpatient_order: inpatientOrders,
    record_exam: recordExams,
    record_medication: recordMedications,
    record_treatment: recordTreatments
  }

  const fifthTableMapData = {
    inpatient_order_detail: inpatientOrderDetails,
    medication_detail: medicationDetails
  }

  const data = {
    1: firstTableMapData,
    2: secondTableMapData,
    3: thirdTableMapData,
    4: fourthTableMapData,
    5: fifthTableMapData
  }

  /**
 * =================================================================
 * 1st class data
 *user: users,
  owner: owners,
  cage: cageTypes,
  breed: breeds,
  exam: exams,
  medicine: medicines,
  treatment: treatments,
 * =================================================================
 */

  for (let i = 1; i < 11; i++) {
    const user = {
      hashed_password: hashedPassword,
      fullname: '獸醫' + i,
      cellphone: '09' + (i % 10).toString().repeat(8),
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

  let count = 1
  for (const type of cageTypes) {
    for (let i = 1; i < 10; i++) {
      const cage = {
        name: type + i,
        inpatient_id: 64 + count
      }
      cages.push(cage)
      count += 1
    }
  }

  for (const animalSpecies of species) {
    for (let i = 1; i < 51; i++) {
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
      dose: (Math.floor(Math.random() * 100) + 1) * 5,
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
 * const secondTableMapData = {
  pet: pets
}
 * =================================================================
 */

  for (let i = 1; i < 101; i++) {
    let breed_id
    if (i > 18 && i <= 27) {
      breed_id = Math.floor(Math.random() * 50) + 1
    } else if (i > 27 && i <= 36) {
      breed_id = Math.floor(Math.random() * 50) + 1 + 50
    } else {
      breed_id = Math.floor(Math.random() * 100) + 1
    }

    let status
    if (i < 37) {
      status = 3
    } else if (i < 51) {
      status = 1
    } else if (i < 56) {
      status = 2
    } else {
      status = 0
    }

    // 由status 決定 class 3 的register
    if (i >= 37 && i < 56) {
      const [time, vet_id] = appointmentTimeAndVetIdPair.pop().split(', ')
      const register = {
        vet_id,
        pet_id: i,
        reserve_time: new Date().toISOString().split('T')[0] + ' ' + time,
        subjective: '看診主訴' + status
      }
      registers.push(register)
    }

    const pet = {
      owner_id: Math.floor(Math.random() * 10) + 1,
      breed_id,
      code: 'PET' + '22' + Math.floor(Math.random() * 100000),
      name: '寵物' + i,
      sex: Math.floor(Math.random() * 2),
      is_neutered: Math.floor(Math.random() * 2),
      birthday: '2020-10-10',
      chip: Math.floor(Math.random() * (10 ** 14)),
      comment: '1. 藥物過敏: acetaminophen 2. 主人希望能自己餵藥',
      status,
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
      objective: '客觀檢查' + i,
      assessment: '醫療診斷與評估' + i,
      plan: '治療計畫' + i,
      is_archive: Math.floor(Math.random() * 2)
    }
    records.push(record)
  }

  let inpatient_count = 1
  for (let i = 1; i < 101; i++) {
    const dateSet = inpatientDates[Math.floor(Math.random() * inpatientDates.length)]
    const pet_id = Math.floor(Math.random() * 100) + 1
    const charge_start = dateSet.inpatientDateStart
    const charge_end = dateSet.inpatientDateEnd
    const cage = cages[Math.floor(Math.random() * cages.length)].name
    const vet_id = Math.floor(Math.random() * 10) + 1

    const inpatient = {
      code: 'INP' + '22' + Math.floor(Math.random() * 100000),
      pet_id,
      vet_id,
      charge_start,
      charge_end,
      cage,
      summary: 'summary for 住院動物' + i
    }

    if (i > 64) {
      inpatient.pet_id = inpatient_count
      inpatient.cage = cages[inpatient_count - 1].name
      // console.log(cages[inpatient_count - 1].name)
      // cage = cages[inpatient_count].name

      inpatient_count += 1
      delete inpatient.charge_start
      delete inpatient.charge_end
    }

    inpatients.push(inpatient)
    // 4th 要綁定日期的 inpatient order摻在這裡做
    dateSet.inpatientOrderCreatedAt.forEach(date => {
      const inpatientOrder = {
        code: 'ORD' + '22' + Math.floor(Math.random() * 100000),
        inpatient_id: i,
        // updater_id: vet_id,
        created_at: date,
        updated_at: date,
        date,
        is_paid: 1,
        comment: '住院醫囑單張備註：' + date
      }
      inpatientOrders.push(inpatientOrder)
    })
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

  for (let i = 1; i < 501; i++) {
    for (let j = 1; j < 4; j++) {
      const recordExam = {
        record_id: i,
        exam_id: Math.floor(Math.random() * 100) + 1,
        // name: '檢查名稱' + i + j,
        file_path: 'file_path',
        comment: Math.floor(Math.random() * 2) ? '檢驗備註: ' + i + ' - ' + j : ''
      }
      const recordMedication = {
        record_id: i,
        name: '處方名稱' + i + ' - ' + j,
        type: medicationType[Math.floor(Math.random() * medicationType.length)],
        comment: Math.floor(Math.random() * 2) ? '用藥備註: ' + i + ' - ' + j : ''
      }

      const recordTreatment = {
        record_id: i,
        treatment_id: Math.floor(Math.random() * 100) + 1,
        // name: '治療名稱' + i + j,
        comment: Math.floor(Math.random() * 2) ? '治療備註: ' + i + ' - ' + j : ''
      }
      recordExams.push(recordExam)
      recordMedications.push(recordMedication)
      recordTreatments.push(recordTreatment)
    }
  }

  /**
 * =================================================================
 * 5th class data
 * @inpatient_order_detail: inpatientOrderDetails,
 * =================================================================
 */

  for (let i = 1; i < 1001; i++) {
    const frequency = frequencies[Math.floor(Math.random() * frequencies.length)]
    const inpatientOrderDetail = {
      inpatient_order_id: Math.floor(Math.random() * inpatientOrders.length) + 1,
      priority: Math.floor(Math.random() * 100) + 1,
      content: '醫囑內容: ' + i,
      frequency,
      schedule: frequencyMapSchedule[frequency],
      comment: Math.floor(Math.random() * 2) ? '醫囑備註: ' + i : ''
    }
    inpatientOrderDetails.push(inpatientOrderDetail)
  }

  for (let i = 1; i < 1501; i++) {
    for (let j = 1; j <= (Math.floor(Math.random() * 3) + 1); j++) {
      const medicationDetail = {
        record_medication_id: i,
        medicine_id: Math.floor(Math.random() * 100) + 1,
        // name: '藥品名稱' + i + j,
        dose: (Math.floor(Math.random() * 20) + 1) * 5,
        frequency: Math.floor(Math.random() * 3) + 1,
        day: Math.floor(Math.random() * 14) + 1
      }
      medicationDetails.push(medicationDetail)
    }
  }

  // write json file
  await fsPromise.writeFile(path.join(__dirname, 'fake-data.json'), JSON.stringify(data))
  console.log('fake data saved!')
}

// generateFakeData()

module.exports = { generateFakeData }
