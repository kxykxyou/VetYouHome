if (!localStorage.vyh_token) {
  location.href = '/signin.html'
}

const inpatientsContainerTag = $('#charged-inpatients-container')
const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${localStorage.vyh_token}`
}

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

// $('window').ready(initRenderInpatients)
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
  // console.log('allCageStatus', allCageStatus)
  let html = '<option selected="selected" key="">請選擇籠位</option>'
  allCageStatus.forEach(cage => {
    // console.log(cage.name)
    if (!cage.petId) {
      html += `<option key="${cage.cageName}">${cage.cageName}</option>`
      // console.log(cage.cageName)
    } else {
      // const inpatient = allChargedInpatients.find(inpatient => inpatient.inpatientCage === cage.name)
      // console.log(inpatient)

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
      // .attr('id', `block-${cageBlock}-cages`)
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
          // card.find('.cage').html(inpatient.inpatientCage)

          inpatientsContainer[cageBlock].tag.append(card)
        })
    })
}

// function blockInitHtml (cageBlock) {
//   return `
//   <div
//   id="block-${cageBlock}-cages"
//   class="block-cages border border-dark my-3"
//   >
//     <div class="row justify-content-center">
//       <h4 class="text-center border-bottom border-dark">${inpatientsContainer[cageBlock].name}</h4>
//     </div>
//     <div id="inpatients-display-${cageBlock}" class="row">
//     </div>
//   </div>
//   `
// }

// function cageCardHtml (inpatient) {
//   return `
//   <!-- 單一卡片 -->
//   <div class="col-3 my-3 inpatient-card" key=${inpatient.inpatientId}>
//     <!-- 籠位編號 + summary -->
//     <div class="row">
//       <div class="col-1">${inpatient.inpatientCage}</div>
//       <div class="col">${inpatient.inpatientSummary ? inpatient.inpatientSummary : ''}</div>
//     </div>
//     <!-- 圖片與寵物基本資料 -->
//     <div class="row">
//       <!-- 寵物圖片 -->
//       <div class="col">
//         <a href="/clinic.html#${inpatient.petId}">
//           <img
//             src="/images/${inpatient.petSpecies === 'd' ? 'dog' : 'cat'}.png"
//             class="pet-icon col align-self-center"
//             alt=""
//           />
//         </a>
//       </div>
//       <!-- 寵物基本資料 -->
//       <div class="col">
//         <p class="card-subtitle">${inpatient.petName}</p>
//         <p class="card-subtitle">${inpatient.vetFullname}</p>
//         <p class="card-subtitle">${inpatient.ownerFullname}</p>
//         <p class="card-subtitle">${inpatient.ownerCellphone}</p>
//       </div>
//       <!-- 病歷操作icon -->
//       <div class="btn-group">
//         <button type="button" class="btn btn-default">
//           <a href="/clinic.html#${inpatient.petId}">
//             <img
//             src="/images/medical-record.png"
//             class="operation-icon"
//             alt=""
//             />
//           </a>
//         </button>
//         <button type="button" class="btn btn-default" data-bs-toggle="modal" data-bs-target="#inpatientorder-modal" onclick="modalUpdateCurrentInpatientOrder(${inpatient.inpatientId})">
//           <img
//           src="/images/medical-order.png"
//           class="operation-icon"
//           alt=""
//         />
//         </button>
//         <button type="button" class="btn btn-default" data-bs-toggle="modal" data-bs-target="#swap-cage-modal" onclick="modalUpdateCurrentCage(${inpatient.inpatientId})">
//           <img
//           src="/images/exchange.png"
//           class="operation-icon"
//           alt=""
//         />
//         </button>
//         <button type="button" class="btn btn-default" onclick="discharge(${inpatient.inpatientId})">
//           <img
//           src="/images/discharge.png"
//           class="operation-icon"
//           alt=""
//         />
//         </button>
//       </div>
//     </div>
//   </div>`
// }

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

  // console.log(inpatientId)
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

  if (!Object.keys(complexInpatientOrder).length) {
    return $('#inpatientorder-table').html('尚未建立今日醫囑！')
  }
  // console.log(complexInpatientOrder)
  $('#inpatientorder-table').jsGrid({
    width: '100%',
    height: 'auto',

    inserting: false,
    editing: false,
    sorting: true,
    paging: false,

    data: complexInpatientOrder.details,

    fields: [
      // { name: 'inpatientOrderDetailId', type: 'number', visible: false, editing: false },
      { title: '優先級', name: 'priority', type: 'number', editing: false },
      { title: '內容', name: 'content', type: 'text', editing: false },
      { title: '頻率', name: 'frequency', type: 'text', editing: false },
      { title: '預定時間', name: 'schedule', type: 'text', editing: false },
      { title: '備註', name: 'comment', type: 'text', editing: false }
      // { type: 'control' }
    ]
  })
}

// function insertInpatientOrderTable (inpatientOrderId, details) {
//   $(`.inpatientorder-table-${inpatientOrderId}`).jsGrid()
// }

function compareCage (cage1, cage2) {
  if (cage1 > cage2) { return 1 }
  if (cage1 < cage2) { return -1 }
  return 0
}
