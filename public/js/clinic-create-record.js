const newExams = []
const newCreateMedicationsMap = {}
const newTreatments = []

$('#right-display-selector').change(initRenderCreateRecord)

async function initRenderCreateRecord () {
  renderNewExamTable()
  renderNewTreatmentTable()
}

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
      paging: false,

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

  container.find('.medication-table').jsGrid(
    {
      width: '100%',
      height: 'auto',

      inserting: true,
      editing: true,
      sorting: true,
      paging: false,

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
      paging: false,

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

  const record = {
    subjective: $('#create-record-subjective').val(),
    objective: $('#create-record-objective').val(),
    assessment: $('#create-record-assessment').val(),
    plan: $('#create-record-plan').val(),
    exams: newExams,
    medications: newCreateMedicationsMap,
    treatments: newTreatments,
    petId
  }
  console.log(record)
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
