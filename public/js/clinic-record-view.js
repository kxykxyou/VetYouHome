if (!localStorage.vyh_token) {
  location.href = '/signin.html'
}
// let cacheRecords // id: complex record objects
const cacheRenderedRecords = {} // id: complex record objects；已經render過的完整record的id
let petInfo
const sides = ['left', 'right']
const newMedicationsMap = {}
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.vyh_token}`,
  Accept: 'application/json'
}

const petStatusMap = {
  0: '非住院/非看診動物',
  1: '待看診',
  2: '看診中',
  3: '住院中'
}

const petId = url.split('#')[url.split('#').length - 1]

// autocomplete field prepare
// autocomplete data source files: exams, medicines, treatments
const EMTContainer = {}
createEMTAutocompleteFields()
async function createEMTAutocompleteFields () {
  EMTContainer.allExamNames = await (await fetch('/api/1.0/emt/exams', { headers })).json()
  EMTContainer.allMedicineNames = await (await fetch('/api/1.0/emt/medicines', { headers })).json()
  EMTContainer.allTreatmentNames = await (await fetch('/api/1.0/emt/treatments', { headers })).json()
  createAutocompleteField('autocompleteExam', EMTContainer.allExamNames)
  createAutocompleteField('autocompleteMedicine', EMTContainer.allMedicineNames)
  createAutocompleteField('autocompleteTreatment', EMTContainer.allTreatmentNames)
}

function createAutocompleteField (customName, data) {
  const customField = function (config) {
    jsGrid.Field.call(this, config)
  }
  customField.prototype = new jsGrid.Field({
    sorter: function (tag1, tag2) {
      return tag1.localeCompare(tag2)
    },
    itemTemplate: function (value) {
      return $('<div>').html(value)
    },
    insertTemplate: function (value) {
      return (this._insertAuto = $('<input type="text">').autocomplete({
        source: data
      }))
    },
    editTemplate: function (value) {
      return (this._editAuto = $('<input type="text">')
        .autocomplete({ source: data })
        .val(value))
    },
    insertValue: function () {
      return this._insertAuto.val()
    },
    editValue: function () {
      return this._editAuto.val()
    }
  })
  jsGrid.fields[customName] = customField
}

// functions and controllers
renderPetInfo(petId).then(() => {
  renderCreateInpatientOrder()
  renderCreateInpatientModal()
})
renderAllRecordHeaders(petId)

async function renderPetInfo (petId) {
  const { data } = await (await fetch(`/api/1.0/clinic/pets/id/${petId}`, { headers })).json()
  petInfo = data
  const dayDiff = (Date.now() - (new Date(data.birthday))) / (24 * 60 * 60 * 1000)
  // console.log(dayDiff)
  const year = Math.floor(dayDiff / 365)
  const month = Math.floor((dayDiff % 365) / 30)
  const petInfoTemplate = $('#pet-info-template').clone().removeAttr('id').removeAttr('hidden')
  petInfoTemplate.find('.pet-icon').attr('src', `/images/${data.petSpecies === 'c' ? 'cat' : 'dog'}.png`)
  petInfoTemplate.find('.pet-name').html(`${data.petName} / ${data.petCode}`)
  petInfoTemplate.find('.pet-species').html(`${data.petSpecies === 'c' ? '貓' : '狗'} / ${data.petBreed}`)
  petInfoTemplate.find('.pet-status').html(`狀態: ${petStatusMap[data.status]}`)
  petInfoTemplate.find('.pet-birthday').html(`生日: ${new Date(data.birthday).toISOString().split('T')[0]}`)
  petInfoTemplate.find('.pet-age').html(`年齡: ${year} y ${month} m`)
  if (petInfo.status === 3) { petInfoTemplate.find('.inpatient-btn').remove() }
  petInfoTemplate.find('.pet-chip').html(`${data.chip ? data.chip : '無'}`)
  petInfoTemplate.find('.pet-comment').html(`${data.comment ? data.comment : ''}`)
  $('#pet-info').html(petInfoTemplate)
}

async function renderCreateInpatientModal () {
  // cage selection for creating inpatient
  $('#modal-pet-name').html(`寵物: ${petInfo.petName}`)
  const { data } = await (await fetch('/api/1.0/cages/open', { headers })).json()
  // 籠位選擇html
  const cageSelection = $('#inpatient-target-cage')
  data.forEach(cage => {
    const option = $('<option>')
    cageSelection.append(option.attr('key', cage.name).html(cage.name))
  })
}

async function createInpatient () {
  const newInpatient = {
    petId: petInfo.petId,
    cage: $('#inpatient-target-cage option:selected').attr('key'),
    summary: $('#inpatient-summary').val()
  }
  console.log($('#inpatient-target-cage option:selected').attr('key'))
  const response = await fetch('/api/1.0/clinic/inpatients', {
    method: 'POST',
    headers,
    body: JSON.stringify(newInpatient)
  })
  if (response.status !== 200) {
    alert('收住院: ', response.message)
    return
  }
  alert('收住院成功！')
  return location.reload()
}

async function renderAllRecordHeaders (petId) {
  // get all records of target pet (not nested)
  const { data } = await (await fetch(`/api/1.0/clinic/records/pet/id/${petId}`, { headers })).json()
  // cacheRecords = data
  // const recordHeadersHtml = ''

  sides.forEach(side => {
    data.forEach(record => {
      $(`#${side}-records-container`).append(makeSingleRecordHeaderHtml(record))
    })
  })
}

async function renderBothSingleRecord (recordId) {
  // fetch 單一病歷 record & render
  const { data } = await (await fetch(`/api/1.0/records/id/${recordId}`, { headers })).json()
  const record = data
  console.log('rendered record: ', record)
  cacheRenderedRecords[record.id] = record
  const recordTemplate = $('#record-template').clone()
  recordTemplate.removeAttr('id')
  recordTemplate.removeAttr('hidden')
  recordTemplate.find('.s-textarea').val(record.subjective)
  recordTemplate.find('.o-textarea').val(record.objective)
  recordTemplate.find('.a-textarea').val(record.assessment)
  recordTemplate.find('.p-textarea').val(record.plan)

  renderExamTable(recordId)
  renderMedicationAndTable(recordId)
  renderTreatmentTable(recordId)

  $(`.record-container-${recordId}`).children('.record-content').html(recordTemplate)
}

async function singleRecordDisplayTurn (thisTag) {
  const recordId = $(thisTag).parent().parent().attr('key')
  const recordContentTag = $(thisTag).parent().siblings('.record-content')
  if (!cacheRenderedRecords[recordId]) {
    // 如果沒有render過該病歷
    await renderBothSingleRecord(recordId)
  }
  // recordContentTag.css('display') === 'none' ? recordContentTag.css('display', 'block') : recordContentTag.css('display', 'none')
  recordContentTag.css('display') === 'none' ? recordContentTag.show() : recordContentTag.hide()
}

function displayTurn (thisTag) {
  console.log($(thisTag).parent())
  const recordContentTag = $(thisTag).siblings('.display')
  // recordContentTag.css('display') === 'none' ? recordContentTag.css('display', 'block') : recordContentTag.css('display', 'none')
  recordContentTag.css('display') === 'none' ? recordContentTag.show() : recordContentTag.hide()
}

function editRecord (thisTag) {
  $(thisTag).siblings('.update-record').show()
  $(thisTag).hide()
  $(thisTag).siblings('.soap').children('.soap-textarea').removeAttr('readonly')
}

async function updateRecord (thisTag) {
  const id = $(thisTag).parents('.record-container').attr('key')
  $(thisTag).siblings('.edit-record').show()
  $(thisTag).hide()
  $(thisTag).siblings('.soap').children('.soap-textarea').attr('readonly', '')
  const subjective = $(thisTag).siblings('.soap-s').children('textarea').val()
  const objective = $(thisTag).siblings('.soap-o').children('textarea').val()
  const assessment = $(thisTag).siblings('.soap-a').children('textarea').val()
  const plan = $(thisTag).siblings('.soap-p').children('textarea').val()
  const body = { subjective, objective, assessment, plan, id }
  const response = await fetch('/api/1.0/clinic/records', {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  })
  if (response.status !== 200) {
    console.log((await response.json()))
    return alert('更新病歷失敗')
  }
  return alert('更新病歷成功！')
}

async function deleteRecord (thisTag) {
  if (confirm('確定要刪除病歷嗎？') !== true) { return }
  const id = $(thisTag).parents('.record-container').attr('key')
  // console.log(id)
  const response = await fetch('/api/1.0/clinic/records', {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ id })
  })
  if (response.status !== 200) {
    console.log(response)
    return alert('刪除病歷失敗!')
  }
  const recordId = $(thisTag).parents('.record-container').attr('key')
  $(`.record-container[key=${recordId}]`).remove()
  return alert('刪除病歷成功!')
}

async function renderExamTable (recordId) {
  const { data } = await (await fetch(`/api/1.0/clinic/recordexams/recordid/${recordId}`, { headers })).json()
  console.log('data: ', data)
  // const sourceData = ['auto1', 'auto2', 'auto3']

  $(`.record-container-${recordId}`).find('.exam-table').jsGrid(
    {
      width: '100%',
      height: 'auto',

      inserting: true,
      editing: true,
      sorting: true,
      paging: false,

      data,

      fields: [
        { name: 'id', type: 'number', visible: false, editing: false },
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
          const body = {
            ...item,
            recordId
          }
          console.log('insert body: ', body)
          return $.ajax({
            headers,
            type: 'POST',
            url: '/api/1.0/clinic/recordexams',
            data: JSON.stringify(body)
          })
        },
        updateItem: function (item) {
          if (!EMTContainer.allExamNames.includes(item.examName)) {
            alert('不存在的檢查項目！')
            const d = $.Deferred().reject()
            return d.promise()
          }
          console.log('update item: ', item)
          return $.ajax({
            headers,
            type: 'PUT',
            url: '/api/1.0/clinic/recordexams',
            data: JSON.stringify(item)
          })
        },
        deleteItem: function (item) {
          console.log('delete item: ', item)
          return $.ajax({
            headers,
            type: 'DELETE',
            url: '/api/1.0/clinic/recordexams',
            data: JSON.stringify(item)
          })
        }
      }
    }
  )
}

async function renderMedicationAndTable (recordId) {
  const { data } = await (await fetch(`/api/1.0/clinic/medicationcomplex/recordid/${recordId}`, { headers })).json()
  const medicationComplex = data
  const medicationContainer = $('#single-medication-container-template')
    .clone().removeAttr('id').removeAttr('hidden')
  console.log('medicationComplex: ', medicationComplex)
  if (!medicationComplex) { return }

  medicationComplex.forEach(medication => {
    const container = medicationContainer.clone().attr('key', medication.id)
    container.find('.medication-name').val(medication.name)
    container.find('.medication-type').val(medication.type)
    container.find('.medication-comment').val(medication.comment)
    $(`.record-container-${recordId}`).find('.all-medications-container').find('.add-medication').before(container)
    $(`.record-container-${recordId}`).find('.all-medications-container').find(`.medication-container[key=${medication.id}]`).find('.medication-table').jsGrid(
      {
        width: '100%',
        height: 'auto',

        inserting: true,
        editing: true,
        sorting: true,
        paging: false,

        data: medication.details,

        fields: [
          { name: 'id', type: 'number', visible: false, editing: false },
          // { name: 'medicineId', type: 'number', visible: false, editing: false },
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
            const body = {
              ...item,
              medicationId: medication.id
            }
            return $.ajax({
              headers,
              type: 'POST',
              url: '/api/1.0/clinic/medicationdetails',
              data: JSON.stringify(body)
            })
          },
          updateItem: function (item) {
            if (!EMTContainer.allMedicineNames.includes(item.medicineName)) {
              alert('不存在的藥品！')
              const d = $.Deferred().reject()
              return d.promise()
            }
            console.log('update item: ', item)
            return $.ajax({
              headers,
              type: 'PUT',
              url: '/api/1.0/clinic/medicationdetails',
              data: JSON.stringify(item)
            })
          },
          deleteItem: function (item) {
            console.log('delete item: ', item)
            return $.ajax({
              headers,
              type: 'DELETE',
              url: '/api/1.0/clinic/medicationdetails',
              data: JSON.stringify(item)
            })
          }
        }
      }
    )
  })
}

function addMedication (addMedicationBtn) {
  const container = $('#single-medication-container-template')
    .clone().removeAttr('hidden').removeAttr('id').addClass('new-medication')
  container.find('.medication-input').removeAttr('readonly')
  container.find('.edit-medication').remove()
  // 設定儲存按鈕
  const newMedicationKey = Date.now()
  newMedicationsMap[newMedicationKey] = { details: [] }
  container.find('.update-medication').show().addClass('add-medication').removeClass('update-medication').html('新增此處方')
    .attr('onclick', `saveNewMedication(this, ${newMedicationKey})`)

  container.find('.medication-table').jsGrid(
    {
      width: '100%',
      height: 'auto',

      inserting: true,
      editing: true,
      sorting: true,
      paging: false,

      data: newMedicationsMap[newMedicationKey].details,

      fields: [
        // { name: 'id', type: 'number', visible: false, editing: false },
        // { name: 'medicineId', type: 'number', visible: false, editing: false },
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
  $(addMedicationBtn).before(container)
}

async function saveNewMedication (thisTag, newMedicationKey) {
  const id = $(thisTag).parents('.record-container').attr('key') // record id
  const newMedication = newMedicationsMap[newMedicationKey]
  newMedication.recordId = id
  newMedication.name = $(thisTag).parents('.medication-container').find('.medication-name').val()
  newMedication.type = $(thisTag).parents('.medication-container').find('.medication-type').val()
  newMedication.comment = $(thisTag).parents('.medication-container').find('.medication-comment').val()
  if (!newMedication.name || !newMedication.details.length) {
    return alert('新增處方失敗: 無處方名稱或無用藥')
  }
  let detailCheck = true
  for (const detail of newMedication.details) {
    if (
      !detail.medicineName
    ) {
      detailCheck = false
      break
    }
  }

  if (!detailCheck) {
    return alert('新增處方失敗: 缺乏用藥名稱')
  }

  const response = await fetch('/api/1.0/clinic/recordmedications', {
    headers,
    method: 'POST',
    body: JSON.stringify(newMedication)
  })
  if (response.status !== 200) {
    console.log(response)
    return alert('新增處方失敗！')
  }
  $(thisTag).parents('.all-medications-container').children('.medication-container').remove()
  renderMedicationAndTable(id) // record id
  return alert('新增處方成功！')
}

async function deleteMedication (thisTag) {
  if (confirm('確定要刪除處方嗎？') !== true) { return }
  if (!$(thisTag).parents('.medication-container').attr('key')) {
    return $(thisTag).parent().remove() // for 舊病歷中新建立的醫囑，
  }
  const id = $(thisTag).parent().attr('key')
  console.log(id)
  const response = await fetch('/api/1.0/clinic/recordmedications',
    {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id })
    }
  )
  console.log(response)
  if (response.status !== 200) {
    return alert('刪除處方失敗！')
  }
  $(thisTag).parent().remove()
}

async function editMedication (thisTag) {
  $(thisTag).siblings().children('input').removeAttr('readonly')
  $(thisTag).hide()
  $(thisTag).siblings('.update-medication').show()
}

async function updateMedication (thisTag) {
  const id = $(thisTag).parent().attr('key')
  const body = {
    id,
    name: $(thisTag).parent().find('.medication-name').val(),
    type: $(thisTag).parent().find('.medication-type').val(),
    comment: $(thisTag).parent().find('.medication-comment').val()
  }
  const response = await fetch('/api/1.0/clinic/recordmedications',
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    }
  )
  console.log(response)
  if (response.status !== 200) {
    return alert('修改處方名稱/形式/備註失敗！')
  }
  alert('修改處方名稱/形式/備註成功！')
  $(thisTag).hide()
  $(thisTag).siblings('.edit-medication').show()
}

function insertMedicationTable (sortedMedications) {
  sortedMedications.forEach(medication => {
    $(`.medication-table-${medication.medicationId}`).jsGrid(
      {
        width: '100%',
        height: 'auto',

        inserting: true,
        editing: true,
        sorting: true,
        paging: false,

        data: medication.details,

        fields: [
          { name: 'medicationDetailId', type: 'number', visible: false, editing: false },
          // { name: 'medicineId', type: 'number', visible: false, editing: false },
          { title: '藥品', name: 'medicineName', type: 'text', editing: true, validate: 'required' },
          { title: '劑量(mg/kg)', name: 'medicationDose', type: 'number', editing: true },
          { title: '頻率', name: 'frequency', type: 'number', editing: true },
          { title: '天數', name: 'day', type: 'number', editing: true },
          { type: 'control' }
        ],

        controller: {
          insertItem: function (item) {
            const body = {
              ...item,
              medicationId: medication.id
            }
            return $.ajax({
              headers,
              type: 'POST',
              url: '/api/1.0/clinic/medicationdetails',
              data: JSON.stringify(body)
            })
          },
          updateItem: function (item) {
            console.log('update item: ', item)
            return $.ajax({
              headers,
              type: 'PUT',
              url: '/api/1.0/clinic/medicationdetails',
              data: JSON.stringify(item)
            })
          },
          deleteItem: function (item) {
            console.log('delete item: ', item)
            return $.ajax({
              headers,
              type: 'DELETE',
              url: '/api/1.0/clinic/medicationdetails',
              data: JSON.stringify(item)
            })
          }
        }
      }
    )
  })
}

async function renderTreatmentTable (recordId) {
  const { data } = await (await fetch(`/api/1.0/clinic/recordtreatments/recordid/${recordId}`, { headers })).json()

  $(`.record-container-${recordId}`).find('.treatment-table').jsGrid(
    {
      width: '100%',
      height: 'auto',

      inserting: true,
      editing: true,
      sorting: true,
      paging: false,

      data,

      fields: [
        { name: 'recordTreatmentId', type: 'number', visible: false, editing: false },
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
          const body = {
            ...item,
            recordId
          }
          console.log('insert body: ', body)
          return $.ajax({
            headers,
            type: 'POST',
            url: '/api/1.0/clinic/recordtreatments',
            data: JSON.stringify(body)
          })
        },
        updateItem: function (item) {
          if (!EMTContainer.allTreatmentNames.includes(item.treatmentName)) {
            alert('不存在的治療項目！')
            const d = $.Deferred().reject()
            return d.promise()
          }
          console.log('update item: ', item)
          return $.ajax({
            headers,
            type: 'PUT',
            url: '/api/1.0/clinic/recordtreatments',
            data: JSON.stringify(item)
          })
        },
        deleteItem: function (item) {
          console.log('delete item: ', item)
          return $.ajax({
            headers,
            type: 'DELETE',
            url: '/api/1.0/clinic/recordtreatments',
            data: JSON.stringify(item)
          })
        }
      }
    }
  )
}

function makeSingleRecordHeaderHtml (record) {
  const headerTemplate = $('#record-header-template').clone().removeAttr('hidden').removeAttr('id')
  headerTemplate.attr('key', record.recordId).addClass(`record-container-${record.recordId}`)
  headerTemplate.find('.toggle-btn').find('.title').html(
    `${record.recordCode} | ${new Date(record.recordCreatedAt).toISOString().split('T')[0]} | 主治醫師：${record.vetFullname}`
  )
  return headerTemplate
}
