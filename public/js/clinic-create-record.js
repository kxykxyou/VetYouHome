const newExams = []
const newCreateMedicationsMap = {}
const newTreatments = []

$('#right-display-selector').change(initRenderCreateRecord)
// initRenderCreateRecord()

async function initRenderCreateRecord () {
  renderNewExamTable()
  // renderMedicationTable()
  renderNewTreatmentTable()
}

// async function addNewMedication (thisTag) {
//   medicationCount += 1
//   const container = $('#single-medication-container-template').clone().removeAttr('hidden')
//   container.children()
//   const newMedicationContainer = $(thisTag).siblings('.new-medications-container')
//   // const html = `
//   //   <div key = ${medicationCount} class="new-medication-${medicationCount}">
//   //       <label >處方名稱</label>
//   //       <input name="medication-name" type="text" />
//   //       <label >供應形式</label>
//   //       <input name="medication-type" type="text" />
//   //       <label ">備註</label>
//   //       <input name="medication-comment" type="text" />
//   //       <button
//   //           type="button"
//   //           class="btn btn-danger my-1"
//   //           onclick="deleteMedication(this)"
//   //       >
//   //       刪除處方
//   //       </button>
//   //       <br />
//   //       <div class="new-medication-table"></div>
//   //   </div>
//   // `
//   newMedicationContainer.prepend(container)

//   $(thisTag).siblings('.new-medications-container').children().last().find('.new-medication-table').jsGrid(
//     {
//       width: '100%',
//       height: 'auto',

//       inserting: true,
//       editing: true,
//       sorting: true,
//       paging: true,

//       data: newMedications[medicationCount].details,

//       fields: [
//         // { name: 'medicineId', type: 'number', visible: false, editing: false },
//         { title: '藥品', name: 'medicineName', type: 'text', editing: true },
//         // { name: 'medicineUnitDose', type: 'number', editing: false },
//         // { name: 'medicineDoseUnit', type: 'text', editing: false },
//         { title: '劑量', name: 'medicationDose', type: 'number', editing: true },
//         { title: '頻率', name: 'frequency', type: 'number', editing: true },
//         { title: '天數', name: 'day', type: 'number', editing: true },
//         // { title: '原價', name: 'originalPrice', type: 'number', editing: false },
//         // { name: 'price', type: 'number', editing: true },
//         // { title: '製藥數量', name: 'quantity', type: 'number', editing: true },
//         // { title: '折扣', name: 'discount', type: 'number', editing: true },
//         // { title: '小計', name: 'subtotal', type: 'number', editing: false },
//         { type: 'control' }
//       ]
//     })
// }

async function deleteNewMedication (thisTag) {
  if (confirm('確定要刪除處方嗎？') === true) {
    const key = $(thisTag).parent().attr('key')
    $(thisTag).parent().remove()
    delete newCreateMedicationsMap[key]
  }
}

async function renderNewExamTable () {
  $('#new-exams-table').jsGrid(
    {
      width: '100%',
      height: 'auto',

      inserting: true,
      editing: true,
      sorting: true,
      paging: true,

      data: newExams,

      fields: [
        { title: '名稱', name: 'examName', type: 'autocompleteExam', editing: true, validate: 'required' },
        { title: '說明', name: 'comment', type: 'text', editing: true },
        { type: 'control' }
      ],
      controller: {
        insertItem: function (item) {
          if (!EMTContainer.allExamNames.includes(item.examName)) {
            alert('不存在的檢查項目！')
            const d = $.Deferred().reject()
            return d.promise()
          }
          return item
        },
        updateItem: function (item) {
          console.log('update item: ', item)
          if (!EMTContainer.allExamNames.includes(item.examName)) {
            alert('不存在的檢查項目！')
            const d = $.Deferred().reject()
            return d.promise()
          }
          return item
        },
        deleteItem: function (item) {
          console.log('delete item: ', item)
        }
      }
    }
  )
}

function addNewMedication (addNewMedicationBtn) {
  const container = $('#single-medication-container-template')
    .clone().removeAttr('hidden').removeAttr('id').addClass('new-medication')
  container.find('.medication-input').removeAttr('readonly')
  container.find('.delete-medication').attr('onclick', 'deleteNewMedication(this)')
  container.find('.edit-medication').remove()
  container.find('.update-medication').remove()
  // 設定儲存按鈕
  const newMedicationKey = Date.now()
  container.attr('key', newMedicationKey)
  newCreateMedicationsMap[newMedicationKey] = { details: [] }
  // container.find('.update-medication').show().addClass('add-medication').removeClass('update-medication').html('新增此處方')
  //   .attr('onclick', `saveNewMedication(this, ${newMedicationKey})`)

  container.find('.medication-table').jsGrid(
    {
      width: '100%',
      height: 'auto',

      inserting: true,
      editing: true,
      sorting: true,
      paging: true,

      data: newCreateMedicationsMap[newMedicationKey].details,

      fields: [
        { title: '藥品', name: 'medicineName', type: 'autocompleteMedicine', editing: true, validate: 'required' },
        { title: '劑量(mg/kg)', name: 'medicationDose', type: 'number', editing: true },
        { title: '頻率', name: 'frequency', type: 'number', editing: true },
        { title: '天數', name: 'day', type: 'number', editing: true },
        { type: 'control' }
      ],
      controller: {
        insertItem: function (item) {
          if (!EMTContainer.allMedicineNames.includes(item.medicineName)) {
            alert('不存在的藥品！')
            const d = $.Deferred().reject()
            return d.promise()
          }
          return item
        }
      }
    }
  )
  $(addNewMedicationBtn).before(container)
}

async function renderNewTreatmentTable () {
  $('#new-treatments-table').jsGrid(
    {
      width: '100%',
      height: 'auto',

      inserting: true,
      editing: true,
      sorting: true,
      paging: true,

      data: newTreatments,

      fields: [
        { title: '名稱', name: 'treatmentName', type: 'autocompleteTreatment', editing: true, validate: 'required' },
        { title: '說明', name: 'comment', type: 'text', editing: true },
        { type: 'control' }
      ],
      controller: {
        insertItem: function (item) {
          if (!EMTContainer.allTreatmentNames.includes(item.treatmentName)) {
            alert('不存在的治療項目！')
            const d = $.Deferred().reject()
            return d.promise()
          }
          return item
        },
        updateItem: function (item) {
          if (!EMTContainer.allTreatmentNames.includes(item.treatmentName)) {
            alert('不存在的治療項目！')
            const d = $.Deferred().reject()
            return d.promise()
          }
          console.log('update item: ', item)
          return item
        },
        deleteItem: function (item) {
          console.log('delete item: ', item)
        }
      }
    }
  )
}

async function createRecord () {
  for (const [key, newMedication] of Object.entries(newCreateMedicationsMap)) {
    const medicationContainer = $(`.new-medication[key=${key}]`)
    newMedication.name = medicationContainer.find('.medication-name').val()
    if (newMedication.name === '' || newMedication.name === undefined || !newMedication.details.length) {
      return alert('缺乏處方名稱或處方中未開立藥品')
    }
    newMedication.type = medicationContainer.find('.medication-type').val()
    newMedication.comment = medicationContainer.find('.medication-comment').val()
  }

  // let total = 0
  // newExams.forEach(exam => {
  //   total += exam.subtotal
  // })
  // newTreatments.forEach(treatment => {
  //   total += treatment.subtotal
  // })
  // Object.keys(newMedications).forEach(key => {
  //   newMedications[key].details.forEach(medicine => {
  //     total += medicine.subtotal
  //   })
  // })
  const record = {
    subjective: $('#create-record-subjective').val(),
    objective: $('#create-record-objective').val(),
    assessment: $('#create-record-assessment').val(),
    plan: $('#create-record-plan').val(),
    exams: newExams,
    medications: newCreateMedicationsMap,
    treatments: newTreatments,
    // total,
    petId
  }
  console.log(record)
  return
  const response = await fetch('/api/1.0/clinic/records', {
    method: 'POST',
    headers,
    body: JSON.stringify(record)
  })

  console.log(response)
  if (response.status !== 200) {
    console.log(response)
    return alert('新增病歷失敗!')
  }
  alert('新增病歷成功!')
  return location.reload()
}
