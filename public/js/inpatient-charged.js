const inpatientsContainerTag = $('#charged-inpatients-container')

let allChargedInpatients
let allCageStatus
const inpatientsContainer = {
  A: {
    name: '重症加護區',
    inpatients: []
  },
  B: {
    name: '特殊隔離區',
    inpatients: []
  },
  C: {
    name: '一般貓房',
    inpatients: []
  },
  D: {
    name: '一般犬房',
    inpatients: []
  }
}

initInpatientsRender()
async function initInpatientsRender () {
  await initRenderInpatients()
  console.log('allChargedInpatients', allChargedInpatients)
  initRenderSwapCageModal()
}

async function initRenderSwapCageModal () {
  const { data } = await (await fetch('/api/1.0/cages/all', { headers })).json()
  allCageStatus = data
  allCageStatus.sort((cage1, cage2) => cage1.cageName - cage2.cageName)
  let html = '<option selected="selected" key="">請選擇籠位</option>'
  allCageStatus.forEach(cage => {
    if (!cage.petId) {
      html += `<option key="${cage.cageName}">${cage.cageName}</option>`
    } else {
      html += `<option key="${cage.cageName}">${cage.cageName} / ${cage.petName}</option>`
    }
  })
  $('#target-cage').html(html)
}

async function initRenderInpatients () {
  const { data } = await (await fetch('/api/1.0/inpatients/charged', { headers })).json()
  allChargedInpatients = data
  console.log('charged inpatients: ', data)
  // 把 fetch的結果丟到inpatientsContainer中
  data.forEach(inpatient => {
    inpatientsContainer[inpatient.inpatientCage[0]].inpatients.push(inpatient)
  })
  // 排序按照籠位排序
  for (const cageBlock of Object.values(inpatientsContainer)) {
    cageBlock.inpatients.sort((cage1, cage2) => compareCage(cage1.cage, cage2.cage))
  }

  // inpatientsContainerTag下新增籠位，如果沒有病人的話就不要新增
  // cageBlock等於 {'A', 'B', 'C', 'D'}
  const cageBlocksHasInpatients = Object.keys(inpatientsContainer).filter(cageBlock => inpatientsContainer[cageBlock].inpatients.length)
  const blockCageContainer = $('#block-cage-container-template').clone().removeAttr('id hidden')

  cageBlocksHasInpatients
    .forEach(cageBlock => {
      const cageContainer = blockCageContainer.clone()
      cageContainer.find('.cage-header').html(inpatientsContainer[cageBlock].name)
      cageContainer.find('.inpatients-display').attr('id', `inpatients-display-${cageBlock}`)
      inpatientsContainerTag.append(cageContainer)
    })

  cageBlocksHasInpatients
    .forEach(cageBlock => {
      inpatientsContainer[cageBlock].tag = $(`#inpatients-display-${cageBlock}`)
    })

  console.log('inpatientsContainer: ', inpatientsContainer)
  // inpatients-display-${cage} 下新增各個病患卡片
  const inpatientCardTemplate = $('#inpatient-card-template').clone().removeAttr('id').removeAttr('hidden')
  inpatientCardTemplate.find('.charge-end-group').remove()
  cageBlocksHasInpatients
    .forEach(cageBlock => {
      inpatientsContainer[cageBlock].inpatients
        .forEach(inpatient => {
          const card = inpatientCardTemplate.clone()
          card.attr('key', inpatient.inpatientId)
          card.find('.cage').html(inpatient.inpatientCage)
          card.find('.summary').html(inpatient.inpatientSummary ? inpatient.inpatientSummary : '')
          card.find('.clinic-link').attr('href', `/clinic.html#${inpatient.petId}`)
          card.find('.pet-icon').attr('src', `/images/${inpatient.petSpecies === 'c' ? 'cat' : 'dog'}.png`)
          card.find('.inpatient-code').val(inpatient.inpatientCode)
          card.find('.pet-name').val(inpatient.petName)
          card.find('.charged-start').val(inpatient.chargeStart.split('T')[0])
          card.find('.vet-fullname').val(inpatient.vetFullname)
          card.find('.owner-fullname').val(inpatient.ownerFullname)
          card.find('.owner-cellphone').val(inpatient.ownerCellphone)
          card.find('.btn-check-inpatient-order').attr('onclick', `modalUpdateCurrentInpatientOrder(${inpatient.inpatientId})`)
          card.find('.btn-swap-cage').attr('onclick', `modalUpdateCurrentCage(${inpatient.inpatientId})`)
          card.find('.btn-discharge').attr('onclick', `discharge(${inpatient.inpatientId})`)

          inpatientsContainer[cageBlock].tag.append(card)
        })
    })
}

async function discharge (inpatientId) {
  if (confirm('確定要讓此病患出院嗎？') !== true) {
    return
  }
  const body = {
    inpatientId
  }
  const response = await fetch('/api/1.0/inpatients/discharge', {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  if (response.status !== 200) {
    alert(response.status, response.data.message)
  } else {
    const inpatient = allChargedInpatients.find(inpatient => inpatient.inpatientId === inpatientId)
    alert(`籠位: ${inpatient.inpatientCage} ${inpatient.petName}\n辦理出院成功!`)
    location.reload()
  }
}

function modalUpdateCurrentCage (inpatientId) {
  const inpatient = allChargedInpatients.find(inpatient => inpatient.inpatientId === inpatientId)
  $('#current-cage').attr({ key: inpatient.inpatientCage })
  $('#current-cage').html(`
    <h4>目前籠位: ${inpatient.inpatientCage} ${inpatient.petName}</h4>
    <p class="">${inpatient.inpatientSummary}</p>
    `)
}

async function swapCage () {
  const currentCage = $('#current-cage').attr('key')
  const targetCage = $('#target-cage option:selected').attr('key')
  if (!targetCage) { alert('請選擇籠位') }
  console.log('currentCage: ', currentCage)
  console.log('targetCage: ', targetCage)

  // TODO: POST to swap cage API
  const body = {
    currentCage,
    targetCage
  }
  const response = await fetch('/api/1.0/inpatients/swapcage', {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  if (response.status !== 200) {
    alert(response.status, response.data.message)
  } else {
    alert('交換籠位成功！')
    location.reload()
  }
}

async function modalUpdateCurrentInpatientOrder (inpatientId) {
  const { data } = await (await fetch(`/api/1.0/inpatients/id/${inpatientId}/inpatientorders/complex/today`, { headers })).json()
  const complexInpatientOrder = data
  console.log('complexInpatientOrder: ', complexInpatientOrder)

  const inpatientInfo = allChargedInpatients.find(inpatient => inpatient.inpatientId === inpatientId)
  $('#inpatientorder-current-cage').html(`${inpatientInfo.inpatientCage} - ${inpatientInfo.petName}`)
  // console.log(complexInpatientOrder)
  if (!Object.keys(complexInpatientOrder).length) {
    $('#inpatient-order-comment').empty()
    return $('#inpatientorder-table').html('尚未建立今日醫囑！')
  }

  $('#inpatient-order-comment').html(`${complexInpatientOrder.comment}`)
  $('#inpatientorder-table').jsGrid({
    width: '100%',
    height: 'auto',

    inserting: false,
    editing: false,
    sorting: true,
    paging: false,

    data: complexInpatientOrder.details,

    fields: [
      { title: '優先級', name: 'priority', type: 'number', editing: true, validate: 'required', width: '10%', align: 'center' },
      { title: '內容', name: 'content', type: 'text', editing: true, validate: 'required', headercss: 'text-align: center' },
      { title: '頻率', name: 'frequency', type: 'text', editing: true, width: '10%', align: 'center' },
      { title: '預定時間', name: 'schedule', type: 'text', editing: true, width: '15%', align: 'center' },
      { title: '執行備註', name: 'comment', type: 'text', editing: true, width: '30%' }
    ]
  })
}

function compareCage (cage1, cage2) {
  if (cage1 > cage2) { return 1 }
  if (cage1 < cage2) { return -1 }
  return 0
}
