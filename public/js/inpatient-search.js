const vetSelectionTag = $('#vet')
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

const searchResultTag = $('#history-search-result')
const petStatusMap = {
  0: '',
  1: '待看診',
  2: '看診中',
  3: '住院中'
}

initHistorySearchRender()

async function initRenderVetSelection () {
  const { data } = await (await fetch('/api/1.0/vets/all', { headers })).json()
  vets = [...data]
  let vetSelections = '<option selected="selected" key="">所有醫師</option>'
  vets.forEach(vet => {
    vetSelections += `<option key="${vet.id}">${vet.fullname}</option>`
  })
  vetSelectionTag.html(vetSelections)
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

async function initHistorySearchRender () {
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

$('#search-button').click(searchInpatients)

async function searchInpatients () {
  // Get query condition and make it to query string
  searchResultTag.empty()
  const dates = $('#date-range').val()
  const [dateStart, dateEnd] = dates ? dates.replaceAll('/', '-').split(' - ') : ['', '']

  const vetId = $('#vet option:selected').attr('key')
  const petSpecies = $('#pet-species option:selected').attr('key')
  const petBreed = $('#pet-breed option:selected').attr('key')
  const inpatientCode = $('#inpatient-code').val()
  const ownerFullname = $('#owner-fullname').val()
  const petName = $('#pet-name').val()

  const petCode = $('#pet-code').val()
  const petChip = $('#pet-chip').val()
  const queryPairs = {
    vetId,
    petSpecies,
    petBreed,
    inpatientCode,
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
  // fetch api and get data
  const response = await fetch('/api/1.0/inpatients/search' + queryString, { headers })
  if (response.status !== 200) { return alert('Server error!') }
  const { data } = await response.json()
  console.log('search results: ', data)
  data.sort((inpatient1, inpatient2) => {
    return new Date(inpatient2.chargeStart) - new Date(inpatient1.chargeStart)
  })

  const inpatientCardTemplate = $('#inpatient-card-template').clone().removeAttr('id hidden')
  inpatientCardTemplate.find('.operation-group').remove()
  data.forEach(inpatient => {
    const card = inpatientCardTemplate.clone()
    card.attr('key', inpatient.inpatientId)
    card.find('.cage').html(inpatient.cage)
    card.find('.summary').html(inpatient.summary ? inpatient.summary : '')
    card.find('.clinic-link').attr('href', `/clinic.html#${inpatient.petId}`)
    card.find('.pet-icon').attr('src', `/images/${inpatient.petSpecies === 'c' ? 'cat' : 'dog'}.png`)
    card.find('.inpatient-code').val(inpatient.inpatientCode)
    card.find('.pet-name').val(inpatient.petName)
    card.find('.charged-start').val(inpatient.chargeStart.split('T')[0])
    card.find('.charged-end').val(inpatient.chargeEnd ? inpatient.chargeEnd.split('T')[0] : '住院中')
    card.find('.vet-fullname').val(inpatient.vetFullname)
    card.find('.owner-fullname').val(inpatient.ownerFullname)
    card.find('.owner-cellphone').val(inpatient.ownerCellphone)
    searchResultTag.append(card)
  })
}
