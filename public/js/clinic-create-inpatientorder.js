// renderCreateInpatientOrder()
const newInpatientOrder = {
  details: []
}

async function renderCreateInpatientOrder () {
//   if (petInfo.status != '3') {
//     return
//   }

  const { data } = await (await fetch(`/api/1.0/clinic/inpatients/mostrecent/pet/id/${petId}`, { headers })).json()
  if (!Object.keys(data).length) {
    $('#create-new-inpatientorder').html('該寵物無住院紀錄')
    console.log('該寵物無住院紀錄')
    return
  }
  console.log('該寵物最新住院資訊', data)
  $('#create-new-inpatientorder-cage').html(`籠位: ${data.cage}`)
  $('#create-new-inpatientorder-summary').html(`住院摘要: ${data.summary}`)

  //   $('#not-inpatient-alert').hide()
  //   $('#create-new-inpatientorder').show()
  newInpatientOrder.id = data.id
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
        { title: '優先級', name: 'priority', type: 'number', editing: true },
        { title: '醫囑內容', name: 'content', type: 'text', editing: true },
        { title: '頻率', name: 'frequency', type: 'text', editing: true },
        { title: '預定時間', name: 'schedule', type: 'text', editing: true },
        { title: '備註', name: 'comment', type: 'text', editing: true },
        { type: 'control' }
      ],
      controller: {
        insertItem: function (item) {
          if (item.priority === '' || item.priority === undefined || Math.floor(item.priority) < 0 || Math.floor(item.priority) > 99) {
            alert('優先級請輸入0~99的整數')
            const d = $.Deferred().reject()
            return d.promise()
          }
          if (item.content === '') {
            alert('請輸入醫囑內容')
            const d = $.Deferred().reject()
            return d.promise()
          }
          console.log(item)
          return item
        },
        updateItem: function (item) {
          if (item.priority === '' || item.priority === undefined || Math.floor(item.priority) < 0 || Math.floor(item.priority) > 99) {
            alert('優先級請輸入0~99的整數')
            const d = $.Deferred().reject()
            return d.promise()
          }
          if (item.content === '') {
            alert('請輸入醫囑內容')
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

async function createInpatientOrder () {
  newInpatientOrder.date = $('input[name="inpatientorder-date"]').val().replaceAll('/', '-')
  newInpatientOrder.comment = $('#new-inpatientorder-comment').val()
  console.log('newInpatientOrder: ', newInpatientOrder)
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
