// sides = ['left', 'right']
const cacheRenderedInpatientOrderIds = {}

renderAllInpatientOrderHeaders()
async function renderAllInpatientOrderHeaders () {
  const { data } = await (await fetch(`/api/1.0/clinic/inpatientorders/pet/id/${petId}`)).json()
  console.log('inpatientorders: ', data)
  let html = ''
  data.forEach(inpatientOrder => {
    html += makeSingleInpatientOrderHeaderHtml(inpatientOrder)
  })

  sides.forEach(side => {
    $(`#${side}-inpatientorders-container`).html(html)
  })
}

function makeSingleInpatientOrderHeaderHtml (inpatientOrder) {
  return `
          <!-- key: inpatient_order.id -->
          <div
              key="${inpatientOrder.inpatientOrderId}"
              class="inpatientorder-container inpatientorder-container-${inpatientOrder.inpatientOrderId}"
              style="display: block"
              >
              <div class="row inpatientorder-header mx-1">
                  <button
                  type="button"
                  class="btn btn-primary my-1"
                  data-bs-toggle="button"
                  autocomplete="off"
                  aria-pressed="true"
                  onclick="singleInpatientOrderDisplayTurn(this)"
                  >
                  <h3>${inpatientOrder.inpatientOrderCode} | ${new Date(inpatientOrder.targetDate).toISOString().split('T')[0]} | 主治醫師：${inpatientOrder.vetFullname}</h3>
                  </button>
              </div>
              <div class="inpatientorder-content display">
              </div>
          </div>
         `
}

async function singleInpatientOrderDisplayTurn (thisTag) {
  const inpatientOrderId = $(thisTag).parent().parent().attr('key')
  const inpatientOrderContentTag = $(thisTag).parent().siblings('.inpatientorder-content')
  if (!cacheRenderedInpatientOrderIds[inpatientOrderId]) {
    // 如果沒有render過該病歷
    await renderBothSingleInpatientOrder(inpatientOrderId)
  }
  inpatientOrderContentTag.css('display') === 'none' ? inpatientOrderContentTag.show() : inpatientOrderContentTag.hide()
}

async function renderBothSingleInpatientOrder (inpatientOrderId) {
  const { data } = await (await fetch(`/api/1.0/clinic/inpatientorders/complex/id/${inpatientOrderId}`)).json()
  const complexInpatientOrder = data
  cacheRenderedInpatientOrderIds[inpatientOrderId] = complexInpatientOrder
  // 加入inpatient order的基本資料
  const generalHtml = `
    <div class="row">
        <div class="inpatient-summary">住院摘要: ${complexInpatientOrder.inpatientSummary}</div>
        <div class="inpatient-cage">籠位: ${complexInpatientOrder.cage}</div>
    </div>
    <div class="inpatientorder-table-${complexInpatientOrder.inpatientOrderId}"></div>
    <div class="inpatientorder-comment-${complexInpatientOrder.inpatientOrderId}">
        <div class="comment-title">備註:</div>
        <div class="comment-content">
            ${complexInpatientOrder.inpatientOrderComment}
        </div>
    </div>
    `
  $(`.inpatientorder-container-${inpatientOrderId}`).children('.inpatientorder-content').html(generalHtml)
  insertInpatientOrderTable(inpatientOrderId, complexInpatientOrder.details)
}

function insertInpatientOrderTable (inpatientOrderId, details) {
  $(`.inpatientorder-table-${inpatientOrderId}`).jsGrid({
    width: '100%',
    height: 'auto',

    inserting: true,
    editing: true,
    sorting: true,
    paging: true,

    data: details,

    fields: [
      { name: 'inpatientOrderDetailId', type: 'number', visible: false, editing: false },
      { name: 'priority', type: 'number', editing: true },
      { name: 'content', type: 'text', editing: true },
      { name: 'frequency', type: 'text', editing: true },
      { name: 'schedule', type: 'text', editing: true },
      { name: 'comment', type: 'text', editing: true },
      { type: 'control' }
    ]
  })
}
