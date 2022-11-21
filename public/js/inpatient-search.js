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

$('#search-button').click(searchRecords)

async function searchRecords () {
  // Get query condition and make it to query string
  const dates = $('#date-range').val()
  const [dateStart, dateEnd] = dates ? dates.replaceAll('/', '-').split(' - ') : ['', '']

  const vetId = $('#vet option:selected').attr('key')
  const petSpecies = $('#pet-species option:selected').attr('key')
  // const isArchive = $('#is-archive option:selected').attr('key')
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
    // isArchive,
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
  const response = await fetch('/api/1.0/inpatients/search' + queryString, { headers })
  if (response.status !== 200) { return alert('Server error!') }
  const { data } = await response.json()
  let html = ''
  data.forEach(row => {
    html +=
    `
    <br>
    <div class="col">
      <div class="row">
        <div class="col-2">
          <a href="/clinic.html#${row.petId}">
            <img
              src="/images/${row.petSpecies === 'd' ? 'dog' : 'cat'}.png"
              class="pet-icon col align-self-center"
              alt=""
            />
          </a>
        </div>
        <div class="col">
          <p class="card-subtitle">${row.inpatientCode}</p>
          <p class="card-subtitle">${row.petName}</p>
          <p class="card-subtitle">${row.vetFullname}</p>
          <p class="card-subtitle">${row.ownerFullname}</p>
          <p class="card-subtitle">${row.ownerCellphone}</p>
          <p class="card-subtitle">${row.summary ? row.summary : ''}</p>
        </div>
      </div>
  </div>
    `
  })
  searchResultTag.html(html)
  console.log('search results: ', data)
}
