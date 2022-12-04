$('#right-display-selector').change(initRenderCreateInpatientOrder)

const newInpatientOrder = {
  details: []
}

async function initRenderCreateInpatientOrder () {
  const { data } = await (await fetch(`/api/1.0/clinic/inpatients/mostrecent/pet/id/${petId}`, { headers })).json()
  if (!Object.keys(data).length) {
    $('#create-new-inpatientorder').html('該寵物無住院紀錄')
    console.log('該寵物無住院紀錄')
    return
  }
  if (data.charge_end) {
    $('#create-new-inpatientorder').html('該寵物目前非住院狀態')
    return
  }
  console.log('該寵物最新住院資訊', data)
  $('#create-new-inpatientorder-cage').html(`籠位: ${data.cage}`)
  $('#create-new-inpatientorder-summary').html(`住院摘要: ${data.summary}`)

  // render history inpatient order selection
  // 如果有歷史的住院醫囑才render selection
  if (allInpatientOrders.length) {
    const importSelectionTag = $('#target-inpatient-order')
    allInpatientOrders.forEach(inpatientOrder => {
      const option = $('<option>').attr('key', inpatientOrder.inpatientOrderId).html(`${inpatientOrder.inpatientOrderCode} | ${new Date(inpatientOrder.targetDate).toISOString().split('T')[0]} | 主治醫師：${inpatientOrder.vetFullname}`)
      importSelectionTag.append(option)
    })
  } else {
    $('.btn-import-order').attr('disabled', '')
  }

  newInpatientOrder.id = data.id // 此id為最近一次住院的inpatient.id
  renderNewInpatientOrderTable()
}

function renderNewInpatientOrderTable () {
  $('#new-inpatientorder-table').jsGrid(
    {
      width: '100%',
      height: 'auto',

      inserting: true,
      editing: true,
      sorting: true,
      paging: false,

      data: newInpatientOrder.details,

      fields: [
        { title: '優先級', name: 'priority', type: 'number', editing: true, validate: 'required', width: '10%', align: 'center' },
        { title: '內容', name: 'content', type: 'text', editing: true, validate: 'required' },
        { title: '頻率', name: 'frequency', type: 'text', editing: true, width: '10%', align: 'center' },
        { title: '預定時間', name: 'schedule', type: 'text', editing: true, width: '15%', align: 'center' },
        { title: '執行備註', name: 'comment', type: 'text', editing: true, width: '20%' },
        { type: 'control', width: '10%' }
      ],
      controller: {
        insertItem: function (item) {
          if (item.priority === '' || item.priority === undefined || Math.floor(item.priority) < 0 || Math.floor(item.priority) > 99) {
            alert('優先級請輸入0~99的整數')
            const d = $.Deferred().reject()
            return d.promise()
          }
          return item
        },
        updateItem: function (item) {
          if (item.priority === '' || item.priority === undefined || Math.floor(item.priority) < 0 || Math.floor(item.priority) > 99) {
            alert('優先級請輸入0~99的整數')
            const d = $.Deferred().reject()
            return d.promise()
          }
          console.log('update item: ', item)
          return item
        }
      }
    }
  )
}

async function importInpatientOrder () {
  const inpatientOrderId = $('#target-inpatient-order option:selected').attr('key')
  if (!inpatientOrderId || inpatientOrderId === '') {
    return alert('請選擇要匯入的醫囑')
  }
  // console.log(inpatientOrderId)
  const { data } = await (await fetch(`/api/1.0/inpatientorders/complex/id/${inpatientOrderId}`, { headers })).json()
  const inpatientOrderComplex = data
  inpatientOrderComplex.details.forEach(detail => {
    delete detail.id
    delete detail.inpatient_order_id
    delete detail.subtotal
    delete detail.time
    delete detail.price
  })
  newInpatientOrder.details = inpatientOrderComplex.details
  $('#new-inpatientorder-comment').html(inpatientOrderComplex.comment)
  renderNewInpatientOrderTable()
  $('#import-inpatient-order-modal').find('.btn-close').click() // 關閉modal
}

async function createInpatientOrder () {
  newInpatientOrder.date = $('input[name="inpatientorder-date"]').val().replaceAll('/', '-')
  newInpatientOrder.comment = $('#new-inpatientorder-comment').val()
  // console.log('newInpatientOrder: ', newInpatientOrder)
  const response = await fetch('/api/1.0/clinic/inpatientorders', {
    method: 'POST',
    headers,
    body: JSON.stringify(newInpatientOrder)
  })
  if (response.status !== 200) {
    return alert('建立醫囑失敗: ', response.message)
  }
  alert('建立醫囑成功！')
  return location.reload()
}
