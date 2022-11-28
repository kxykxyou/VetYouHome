// sides = ['left', 'right']
const cacheRenderedInpatientOrders = {}

renderAllInpatientOrderHeaders()
async function renderAllInpatientOrderHeaders () {
  const { data } = await (await fetch(`/api/1.0/clinic/inpatientorders/pet/id/${petId}`, { headers })).json()
  console.log('inpatientorders: ', data)
  // let html = ''

  sides.forEach(side => {
    data.forEach(inpatientOrder => {
      $(`#${side}-inpatientorders-container`).append(makeSingleInpatientOrderHeaderHtml(inpatientOrder))
    })
  })
}

function makeSingleInpatientOrderHeaderHtml (inpatientOrder) {
  const headerTemplate = $('#inpatient-order-header-template').clone().removeAttr('id').removeAttr('hidden')
  headerTemplate.attr('key', inpatientOrder.inpatientOrderId)
  headerTemplate.find('.toggle-btn').find('.title').html(
    `${inpatientOrder.inpatientOrderCode} | ${new Date(inpatientOrder.targetDate).toISOString().split('T')[0]} | 主治醫師：${inpatientOrder.vetFullname}`
  )
  return headerTemplate
}

async function singleInpatientOrderDisplayTurn (thisTag) {
  const inpatientOrderId = $(thisTag).parents('.inpatientorder-container').attr('key')
  const inpatientOrderContentTag = $(thisTag).parent().siblings('.inpatientorder-content')
  if (!cacheRenderedInpatientOrders[inpatientOrderId]) {
    // 如果沒有render過該病歷
    await renderBothSingleInpatientOrder(inpatientOrderId)
  }
  inpatientOrderContentTag.css('display') === 'none' ? inpatientOrderContentTag.show() : inpatientOrderContentTag.hide()
}

async function renderBothSingleInpatientOrder (inpatientOrderId) {
  const { data } = await (await fetch(`/api/1.0/clinic/inpatientorders/complex/id/${inpatientOrderId}`, { headers })).json()
  const complexInpatientOrder = data
  cacheRenderedInpatientOrders[inpatientOrderId] = complexInpatientOrder
  // 加入inpatient order的基本資料
  const inpatientOrderTemplate = $('#inpatient-order-content-template').clone().removeAttr('id').removeAttr('hidden')
  inpatientOrderTemplate.attr('key', complexInpatientOrder.inpatientOrderId)
  inpatientOrderTemplate.find('.inpatient-summary').html(`${complexInpatientOrder.inpatientSummary}`)
  // cage render 籠位名稱(住院動物名字)

  inpatientOrderTemplate.find('.inpatient-cage').html(`${complexInpatientOrder.cage}`)
  inpatientOrderTemplate.find('.inpatientorder-comment').html(`${complexInpatientOrder.inpatientOrderComment}`)

  $(`.inpatientorder-container[key=${inpatientOrderId}]`).find('.inpatientorder-content').append(inpatientOrderTemplate)
  // insertInpatientOrderTable(inpatientOrderId, complexInpatientOrder.details)
  $(`.inpatientorder-container[key=${inpatientOrderId}]`).find('.inpatientorder-table').attr('key', inpatientOrderId)
  $(`.inpatientorder-container[key=${inpatientOrderId}]`).find('.inpatientorder-table').jsGrid(
    {
      width: '100%',
      height: 'auto',

      inserting: true,
      editing: true,
      sorting: true,
      paging: false,

      data: complexInpatientOrder.details,

      fields: [
        { name: 'id', type: 'number', visible: false, editing: false, validate: 'required' },
        { title: '優先級', name: 'priority', type: 'number', editing: true, validate: 'required' },
        { title: '內容', name: 'content', type: 'text', editing: true, validate: 'required' },
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
          const body = {
            ...item,
            inpatientOrderId
          }
          console.log('insert body: ', body)
          return $.ajax({
            headers,
            type: 'POST',
            url: '/api/1.0/clinic/inpatientorderdetails',
            data: JSON.stringify(body)
          })
        },
        updateItem: function (item) {
          if (item.priority === '' || item.priority === undefined || Math.floor(item.priority) < 0 || Math.floor(item.priority) > 99) {
            alert('優先級請輸入0~99的整數')
            const d = $.Deferred().reject()
            return d.promise()
          }
          console.log('update item: ', item)
          return $.ajax({
            headers,
            type: 'PUT',
            url: '/api/1.0/clinic/inpatientorderdetails',
            data: JSON.stringify(item)
          })
        },
        deleteItem: function (item) {
          console.log('delete item: ', item)
          return $.ajax({
            headers,
            type: 'DELETE',
            url: '/api/1.0/clinic/inpatientorderdetails',
            data: JSON.stringify(item)
          })
        }
      }
    }
  )
}

// async function insertInpatientOrderTable (inpatientOrderId, details) {
//   const { data } = await (await fetch(`/api/1.0/clinic/inpatientorderdetails/id/${inpatientOrderId}`, { headers })).json()
//   console.log('data: ', data)

//   $(`.inpatientorder-container[key=${inpatientOrderId}]`).find('.inpatientorder-table').jsGrid()
//   $(`.inpatientorder-table-${inpatientOrderId}`).jsGrid(
//     {
//       width: '100%',
//       height: 'auto',

//       inserting: true,
//       editing: true,
//       sorting: true,
//       paging: false,

//       data: details,

//       fields: [
//         { name: 'inpatientOrderDetailId', type: 'number', visible: false, editing: false },
//         { title: '優先級', name: 'priority', type: 'number', editing: true },
//         { title: '內容', name: 'content', type: 'text', editing: true },
//         { title: '頻率', name: 'frequency', type: 'text', editing: true },
//         { title: '預定時間', name: 'schedule', type: 'text', editing: true },
//         { title: '備註', name: 'comment', type: 'text', editing: true },
//         { type: 'control' }
//       ],
//       controller: {
//         insertItem: function (item) {
//           if (item.priority === '' || item.priority === undefined || Math.floor(item.priority) < 0 || Math.floor(item.priority) > 99) {
//             alert('優先級請輸入0~99的整數')
//             const d = $.Deferred().reject()
//             return d.promise()
//           }
//           if (item.content === '') {
//             alert('請輸入醫囑內容')
//             const d = $.Deferred().reject()
//             return d.promise()
//           }
//           console.log(item)
//           return item
//         },
//         updateItem: function (item) {
//           if (item.priority === '' || item.priority === undefined || Math.floor(item.priority) < 0 || Math.floor(item.priority) > 99) {
//             alert('優先級請輸入0~99的整數')
//             const d = $.Deferred().reject()
//             return d.promise()
//           }
//           if (item.content === '') {
//             alert('請輸入醫囑內容')
//             const d = $.Deferred().reject()
//             return d.promise()
//           }
//           console.log('update item: ', item)
//           return item
//         }
//       }
//     }
//   )
// }

function updateRemoveInpatientOrderModal (thisTag) {
  const key = $(thisTag).attr('key')
  $('#remove-inpatientorder-btn').attr('key', key)
}

async function deleteInpatientOrder (thisTag) {
  if (confirm('確定要刪除此份醫囑嗎？') !== true) { return }
  const id = $(thisTag).parents('.inpatientorder-container').attr('key')
  const response = await fetch('/api/1.0/clinic/inpatientorders', {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ id })
  })
  if (response.status !== 200) {
    console.log(response)
    return alert('刪除醫囑失敗!')
  }
  alert('刪除醫囑成功!')
  const inpatientOrderId = $(thisTag).parents('.inpatientorder-container').attr('key')
  return $(`.inpatientorder-container[key=${inpatientOrderId}]`).remove()
}

function editInpatientOrder (thisTag) {
  $(thisTag).hide()
  $(thisTag).siblings('.update-inpatientorder-btn').show()
  const container = $(thisTag).parents('.inpatientorder-container')
  container.find('.inpatientorder-comment').removeAttr('readonly')
  console.log(container)
}

async function updateInpatientOrder (thisTag) {
  const container = $(thisTag).parents('.inpatientorder-container')
  const body = {
    id: container.attr('key'),
    comment: $(thisTag).parents('.inpatientorder-container').find('.inpatientorder-comment').val()
  }
  const response = await fetch('/api/1.0/clinic/inpatientorders', {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  })
  if (response.status !== 200) {
    console.log(response)
    return alert('更新醫囑失敗！')
  }

  $(thisTag).hide()
  $(thisTag).siblings('.edit-inpatientorder-btn').show()

  container.find('.inpatientorder-comment').attr('readonly', '')

  return alert('更新病歷成功！')
}
