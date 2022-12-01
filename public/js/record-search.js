const speciesSelectionTag = $('#pet-species')
const breedSelectionTag = $('#pet-breed')

let vets
let allBreeds
const dogBreeds = []
const catBreeds = []
const breedMap = {
  c: catBreeds,
  d: dogBreeds
}
const petStatusMap = {
  0: '',
  1: '待看診',
  2: '看診中',
  3: '住院中'
}

initRender()

async function initRenderVetSelection () {
  const { data } = await (await fetch('/api/1.0/vets/all', { headers })).json()
  vets = data
  const user = JSON.parse(localStorage.user)
  // let vetSelections = '<option key="">所有醫師</option>'
  $('.vet-selector').append($('<option>').text('所有醫師'))
  vets.forEach(vet => {
    if (user.id === vet.id) {
      $('.vet-selector').append(`<option key=${vet.id} selected>${vet.fullname}</option>`)
    } else {
      $('.vet-selector').append($('<option>').attr('key', vet.id).text(vet.fullname))
    }
  })
}

async function initRenderPetBreedSelection () {
  const { data } = await (await fetch('/api/1.0/breeds/all', { headers })).json()
  allBreeds = [...data]
  let breedSelections = '<option selected="selected" key="">所有品種</option>'
  allBreeds.forEach(breed => {
    breedSelections += `<option key="${breed.breed}">${breed.breed}</option>`
    breedMap[breed.species].push(breed)
  })
  breedSelectionTag.html(breedSelections)
}

async function initRender () {
  initRenderVetSelection()
  initRenderPetBreedSelection()
}

function renderPetBreedSelection (breeds) {
  let breedSelections = '<option selected="selected" key="">所有品種</option>'
  breeds.forEach(breed => {
    breedSelections += `<option key="${breed.breed}">${breed.breed}</option>`
  })
  breedSelectionTag.html(breedSelections)
}

speciesSelectionTag.on('change', () => {
  const key = $('#pet-species option:selected').attr('key')
  if (!key) {
    renderPetBreedSelection(allBreeds)
  } else {
    renderPetBreedSelection(breedMap[key])
  }
})

async function searchRecords () {
  // empty previous search results
  $('#history-search-result').empty()
  // Get query condition and make it to query string
  const dates = $('#date-range').val()
  const [dateStart, dateEnd] = dates ? dates.replaceAll('/', '-').split(' - ') : ['', '']

  const vetId = $('#history-search-vet-selector option:selected').attr('key')
  const petSpecies = $('#pet-species option:selected').attr('key')
  const isArchive = $('#is-archive option:selected').attr('key')
  const petBreed = $('#pet-breed option:selected').attr('key')
  const recordCode = $('#record-code').val()
  const ownerFullname = $('#owner-fullname').val()
  const petName = $('#pet-name').val()

  const petCode = $('#pet-code').val()
  const petChip = $('#pet-chip').val()
  const queryPairs = {
    vetId,
    petSpecies,
    petBreed,
    isArchive,
    recordCode,
    ownerFullname,
    petName,
    petCode,
    petChip,
    dateStart,
    dateEnd
  }
  for (const [key, value] of Object.entries(queryPairs)) {
    if (!value) {
      delete queryPairs[key]
    }
  }
  const queryString = '?' + new URLSearchParams(queryPairs).toString()
  // // fetch api and get data
  const response = await fetch('/api/1.0/records/search' + queryString, { headers })
  if (response.status !== 200) { return alert('Server error!') }
  const { data } = await response.json()
  const recordCardTemplate = $('#record-card-template').clone().show().removeAttr('id')

  data.forEach(row => {
    const card = recordCardTemplate.clone()
    card.find('.clinic-link').attr('href', `/clinic.html#${row.petId}`)
    card.find('.pet-icon').attr('src', `/images/${row.petSpecies === 'd' ? 'dog' : 'cat'}.png`)
    card.find('.record-code').val(row.recordCode)
    card.find('.record-date').val(row.recordCreatedAt.split('T')[0])
    card.find('.pet-name').val(row.petName)
    card.find('.vet-fullname').val(row.vetFullname)
    card.find('.owner-fullname').val(row.ownerFullname)
    $('#history-search-result').append(card)
  })
  // console.log('search results: ', data)
}

async function searchUnarchiveRecords () {
  // clear previous search results
  $('#unarchive-search-result').empty()

  const vetId = $('#unarchive-vet-selector option:selected').attr('key')
  const queryPairs = {
    vetId,
    isArchive: 0
  }
  for (const [key, value] of Object.entries(queryPairs)) {
    if (!value) {
      delete queryPairs[key]
    }
  }
  const queryString = '?' + new URLSearchParams(queryPairs).toString()
  // // fetch api and get data
  let response = await fetch('/api/1.0/records/search' + queryString, { headers })
  if (response.status !== 200) {
    response = await response.json()
    console.log(response)
    return alert(response.error)
  }
  const { data } = await response.json()
  const recordCardTemplate = $('#record-card-template').clone().show().removeAttr('id')
  data.forEach(row => {
    const card = recordCardTemplate.clone()
    card.find('.clinic-link').attr('href', `/clinic.html#${row.petId}`)
    card.find('.pet-icon').attr('src', `/images/${row.petSpecies === 'd' ? 'dog' : 'cat'}.png`)
    card.find('.record-code').val(row.recordCode)
    card.find('.record-date').val(row.recordCreatedAt.split('T')[0])
    card.find('.pet-name').val(row.petName)
    card.find('.vet-fullname').val(row.vetFullname)
    card.find('.owner-fullname').val(row.ownerFullname)
    $('#unarchive-search-result').append(card)
  })
}
