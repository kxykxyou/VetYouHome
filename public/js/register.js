let registers

initRegistersRender()

async function initRegistersRender () {
  const { data } = await (await fetch('/api/1.0/registers/today/all', { headers })).json()
  registers = data
  // 按照預約時間的順序排序
  registers.sort((register1, register2) => {
    return register2.reserve_time - register1.reserve_time
  })

  const queuePets = registers.filter(register => register.petStatus === 1)

  const calledPets = registers.filter(register => register.petStatus === 2)

  // inquiryFinishedPets狀態 0(看完診)
  const inquiryFinishedPets = registers.filter(register => register.petStatus === 0)

  const inpatientPets = registers.filter(register => register.petStatus === 3)

  const registerCard = $('#register-card-template').clone().remove('id hidden')

  // render 候診中(1)掛號寵物
  const queueContainer = $('#queue-container').find('.registers-display')
  queuePets.forEach(pet => {
    const queueCard = registerCard.clone()
    queueCard.find('.register-card').attr('key', pet.registerId)

    queueCard.find('.register-subjective').html(pet.registerSubjective)
    queueCard.find('.pet-icon').attr('src', `/images/${pet.petSpecies === 'c' ? 'cat' : 'dog'}.png`)
    queueCard.find('.clinic-link').attr('href', `/clinic.html#${pet.petId}`)
    queueCard.find('.pet-name').val(pet.petName)
    queueCard.find('.vet-fullname').val(pet.vetFullname)
    queueCard.find('.owner-fullname').val(pet.ownerFullname)
    queueCard.find('.owner-cellphone').val(pet.ownerCellphone)
    queueCard.find('.btn-call-register').attr('onclick', `callRegisterPet(${pet.petId})`)

    // 判斷是否預約時間是否超時，超時顯示紅色；反之則為藍色
    const now = Date.now()
    const reserveTime = new Date(pet.reserveTime).getTime()
    const localReserveTime = utcISOStringToLocalTimeString(pet.reserveTime, timezoneOffsetMilliseconds)
    queueCard.find('.reserve-time').html('預約時間: ' + localReserveTime)
    if (reserveTime > now) {
      queueCard.find('.reserve-header').addClass('text-primary')
    } else {
      queueCard.find('.reserve-header').addClass('text-danger')
    }
    queueContainer.append(queueCard)
  })

  // render 看診中(2)掛號寵物
  const calledContainer = $('#called-container').find('.registers-display')
  const calledCardTemplate = registerCard.clone()
  calledCardTemplate.find('.btn-call-register').remove()
  calledCardTemplate.find('.reserve-header').addClass('text-primary')
  calledPets.forEach(pet => {
    const calledCard = calledCardTemplate.clone()
    calledCard.find('.register-card').attr('key', pet.registerId)
    const localReserveTime = utcISOStringToLocalTimeString(pet.reserveTime, timezoneOffsetMilliseconds)
    calledCard.find('.reserve-time').html('預約時間: ' + localReserveTime)
    calledCard.find('.register-subjective').html(pet.registerSubjective)
    calledCard.find('.pet-icon').attr('src', `/images/${pet.petSpecies === 'c' ? 'cat' : 'dog'}.png`)
    calledCard.find('.clinic-link').attr('href', `/clinic.html#${pet.petId}`)
    calledCard.find('.pet-name').val(pet.petName)
    calledCard.find('.vet-fullname').val(pet.vetFullname)
    calledCard.find('.owner-fullname').val(pet.ownerFullname)
    calledCard.find('.owner-cellphone').val(pet.ownerCellphone)
    calledContainer.append(calledCard)
  })

  // render 看完診(0)的掛號寵物
  const finishedContainer = $('#finished-container').find('.registers-display')
  const finishedCardTemplate = registerCard.clone()
  finishedCardTemplate.find('.btn-call-register').remove()
  finishedCardTemplate.find('.reserve-header').addClass('text-success')
  inquiryFinishedPets.forEach(pet => {
    const finishedCard = finishedCardTemplate.clone()
    finishedCard.find('.register-card').attr('key', pet.registerId)
    const localReserveTime = utcISOStringToLocalTimeString(pet.reserveTime, timezoneOffsetMilliseconds)
    finishedCard.find('.reserve-time').html('預約時間: ' + localReserveTime)
    finishedCard.find('.register-subjective').html(pet.registerSubjective)
    finishedCard.find('.pet-icon').attr('src', `/images/${pet.petSpecies === 'c' ? 'cat' : 'dog'}.png`)
    finishedCard.find('.clinic-link').attr('href', `/clinic.html#${pet.petId}`)
    finishedCard.find('.pet-name').val(pet.petName)
    finishedCard.find('.vet-fullname').val(pet.vetFullname)
    finishedCard.find('.owner-fullname').val(pet.ownerFullname)
    finishedCard.find('.owner-cellphone').val(pet.ownerCellphone)

    finishedContainer.append(finishedCard)
  })

  // render 收治住院(3)的掛號寵物
  const inpatientContainer = $('#inpatient-container').find('.registers-display')
  const inpatientCardTemplate = registerCard.clone()
  inpatientCardTemplate.find('.btn-call-register').remove()
  inpatientCardTemplate.find('.reserve-header').addClass('text-warning')
  inpatientPets.forEach(pet => {
    const inpatientCard = inpatientCardTemplate.clone()
    inpatientCard.find('.register-card').attr('key', pet.registerId)
    const localReserveTime = utcISOStringToLocalTimeString(pet.reserveTime, timezoneOffsetMilliseconds)
    inpatientCard.find('.reserve-time').html('預約時間: ' + localReserveTime)
    inpatientCard.find('.register-subjective').html(pet.registerSubjective)
    inpatientCard.find('.pet-icon').attr('src', `/images/${pet.petSpecies === 'c' ? 'cat' : 'dog'}.png`)
    inpatientCard.find('.clinic-link').attr('href', `/clinic.html#${pet.petId}`)
    inpatientCard.find('.pet-name').val(pet.petName)
    inpatientCard.find('.vet-fullname').val(pet.vetFullname)
    inpatientCard.find('.owner-fullname').val(pet.ownerFullname)
    inpatientCard.find('.owner-cellphone').val(pet.ownerCellphone)

    inpatientContainer.append(inpatientCard)
  })
}

async function callRegisterPet (petId) {
  const response = await fetch(`/api/1.0/registers/call/pet/id/${petId}`, {
    method: 'PATCH',
    headers
  })

  if (response.status !== 200) {
    return alert('伺服器發生錯誤')
  }

  const pet = registers.find(register => register.petId === petId)

  alert(`已叫號寵物: ${pet.petName}`)
  location.href = `/clinic.html#${petId}`
}

function utcISOStringToLocalTimeString (UtcISOString, timezoneOffsetMilliseconds) {
  const localReserveTime = new Date(new Date(UtcISOString).getTime() - timezoneOffsetMilliseconds)
  return localReserveTime.toISOString().split('T')[1].split('.')[0].split(':').slice(0, 2).join(':')
}
