const inpatientsContainerTag = $('#inpatients-container')
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
// // initRender()
initRenderInpatients()
// async function initRender () {

// }

async function initRenderInpatients () {
  const { data } = await (await fetch('/api/1.0/inpatients/charged')).json()
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

  let html = ''
  cageBlocksHasInpatients
    .forEach(cageBlock => {
      html += blockInitHtml(cageBlock)
    })
  inpatientsContainerTag.html(html)

  cageBlocksHasInpatients
    .forEach(cageBlock => {
      inpatientsContainer[cageBlock].tag = $(`#inpatients-display-${cageBlock}`)
    })

  console.log('inpatientsContainer: ', inpatientsContainer)
  // inpatients-display-${cage} 下新增各個病患卡片
  cageBlocksHasInpatients
    .forEach(cageBlock => {
      let cardHtml = ''
      inpatientsContainer[cageBlock].inpatients
        .forEach(inpatient => {
          cardHtml += cageCardHtml(inpatient)
        })
      inpatientsContainer[cageBlock].tag.html(cardHtml)
    })
}

function blockInitHtml (cageBlock) {
  return `
  <div
  id=block-${cageBlock}-cages"
  class="container block-cages border border-dark my-3"
  >
    <div class="row justify-content-center">
      <h4 class="text-center border-bottom border-dark">${inpatientsContainer[cageBlock].name}</h4>
    </div>
    <div id="inpatients-display-${cageBlock}" class="row">
    </div>
  </div>
  `
}

function cageCardHtml (inpatient) {
  return `
  <!-- 單一卡片 -->
  <div class="col-3 my-3">
    <!-- 籠位編號 + summary -->
    <div class="row">
      <div class="col-1">${inpatient.inpatientCage}</div>
      <div class="col">${inpatient.inpatientSummary ? inpatient.inpatientSummary : ''}</div>
    </div>
    <!-- 圖片與寵物基本資料 -->
    <div class="row">
      <!-- 寵物圖片 -->
      <div class="col">
        <a href="${'#'}">
          <img
            src="/images/${inpatient.petSpecies === 'd' ? 'dog' : 'cat'}.png"
            class="pet-icon col align-self-center"
            alt=""
          />
        </a>
      </div>
      <!-- 寵物基本資料 -->
      <div class="col">
        <p class="card-subtitle">${inpatient.petName}</p>
        <p class="card-subtitle">${inpatient.vetFullname}</p>
        <p class="card-subtitle">${inpatient.ownerFullname}</p>
        <p class="card-subtitle">${inpatient.ownerCellphone}</p>
      </div>
      <!-- 病歷操作icon -->
      <div class="btn-group">
        <button type="button" class="btn btn-default">
          <img
          src="/images/medical-record.png"
          class="operation-icon"
          alt=""
        />
        </button>
        <button type="button" class="btn btn-default">
          <img
          src="/images/medical-order.png"
          class="operation-icon"
          alt=""
        />
        </button>
        <button type="button" class="btn btn-default">
          <img
          src="/images/exchange.png"
          class="operation-icon"
          alt=""
        />
        </button>
        <button type="button" class="btn btn-default">
          <img
          src="/images/discharge.png"
          class="operation-icon"
          alt=""
        />
        </button>
      </div>
    </div>
  </div>`
}

function compareCage (cage1, cage2) {
  if (cage1 > cage2) { return 1 }
  if (cage1 < cage2) { return -1 }
  return 0
}
