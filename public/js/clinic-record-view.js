if (!localStorage.vyh_token) {
  location.href = '/signin.html'
}
const url = location.href
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
  location.reload()
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
  console.log(id)
  const response = await fetch('/api/1.0/clinic/records', {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ id })
  })
  if (response.status !== 200) {
    console.log(response)
    return alert('刪除病歷失敗!')
  }
  $(thisTag).parents('.record-container').remove()
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
      paging: true,

      data,

      fields: [
        { name: 'id', type: 'text', visible: false, editing: false },
        { title: '名稱', name: 'name', type: 'text', editing: true, validate: 'required' },
        { title: '說明', name: 'comment', type: 'text', editing: true },
        { type: 'control' }
      ],

      controller: {
        insertItem: function (item) {
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

      // onItemInserting: async function (data) {
      //   const body = {
      //     recordId,
      //     name: data.item.name,
      //     comment: data.item.comment
      //   }
      //   console.log(body)
      //   const headers = {
      //     'Content-Type': 'application/json',
      //     Accept: 'application/json',
      //     Authorization: `Bearer ${localStorage.vyh_token}`
      //   }
      //   const response = await fetch('/api/1.0/clinic/recordexams', {
      //     headers,
      //     method: 'POST',
      //     body: JSON.stringify(body)
      //   })
      //   if (response.status !== 200) {
      //     console.log((await response.json()))
      //     return alert('新增檢驗項目失敗！')
      //   }
      // }
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
        paging: true,

        data: medication.details,

        fields: [
          { name: 'id', type: 'number', visible: false, editing: false },
          // { name: 'medicineId', type: 'number', visible: false, editing: false },
          { title: '藥品', name: 'name', type: 'text', editing: true, validate: 'required' },
          { title: '劑量(mg/kg)', name: 'dose', type: 'number', editing: true },
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
      paging: true,

      data: newMedicationsMap[newMedicationKey].details,

      fields: [
        // { name: 'id', type: 'number', visible: false, editing: false },
        // { name: 'medicineId', type: 'number', visible: false, editing: false },
        { title: '藥品', name: 'name', type: 'text', editing: true, validate: 'required' },
        { title: '劑量(mg/kg)', name: 'dose', type: 'number', editing: true },
        { title: '頻率', name: 'frequency', type: 'number', editing: true },
        { title: '天數', name: 'day', type: 'number', editing: true },
        { type: 'control' }
      ]
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
  if (!newMedication.details.length || !newMedication.name) {
    return alert('新增處方失敗: 處方或藥品資訊不完全')
  }
  let detailCheck = true
  for (const detail of newMedication.details) {
    if (!detail.name || !detail.dose || !detail.frequency || !detail.day) {
      detailCheck = false
    }
  }

  if (!detailCheck) {
    return alert('新增處方失敗: 處方或藥品資訊不完全')
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
  alert('新增處方成功！')
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
        paging: true,

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
      paging: true,

      data,

      fields: [
        { name: 'id', type: 'text', visible: false, editing: false },
        { title: '名稱', name: 'name', type: 'text', editing: true, validate: 'required' },
        { title: '說明', name: 'comment', type: 'text', editing: true },
        { type: 'control' }
      ],

      controller: {
        insertItem: function (item) {
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

const backupHtml = `
<!-- key: record.id -->
<div
  id="record-container-1"
  key="1"
  class="record-container container"
  style="display: block"
>
  <div class="row record-header">
    <button
      type="button"
      class="btn btn-primary my-1"
      data-bs-toggle="button"
      autocomplete="off"
      aria-pressed="true"
      onclick="singleRecordDisplayTurn(this)"
    >
      <h3>REC2212345 | 2022/10/10 | 主治醫師：王小明</h3>
    </button>
  </div>
  <div class="container record-content">
    <div class="container soap-container">
      <div class="container soap soap-s">
        <p class="fs-3 header">Subjective主觀描述</p>
        <p class="fs-4 content">
          Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Distinctio iusto numquam, quasi molestiae ratione
          voluptas. Ullam, similique odit quam voluptatum harum
          itaque asperiores et accusamus debitis optio, sunt quae
          veritatis!
        </p>
      </div>
      <div class="container soap soap-o">
        <p class="fs-3 header">Objective客觀檢查</p>
        <p class="fs-4 content">
          Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Distinctio iusto numquam, quasi molestiae ratione
          voluptas. Ullam, similique odit quam voluptatum harum
          itaque asperiores et accusamus debitis optio, sunt quae
          veritatis!
        </p>
        <div class="container exam-result">
          <button
            type="button"
            class="btn btn-primary my-1"
            data-bs-toggle="button"
            autocomplete="off"
            aria-pressed="true"
            onclick="displayTurn(this)"
          >
            檢查結果
          </button>
          <div class="container display">
              <div class="form-group">
                  <div class="btn btn-default btn-file">
                    <i class="fas fa-paperclip"></i> 上傳檔案(限制10MB)
                    <input type="file" name="attachment" />
                  </div>
                </div>
                <div class="row">
                  <ul
                    class="mailbox-attachments d-flex align-items-stretch clearfix"
                  >
                    <li>
                      <span class="mailbox-attachment-icon"
                        ><i class="far fa-file-pdf"></i
                      ></span>

                      <div class="mailbox-attachment-info">
                        <a href="#" class="mailbox-attachment-name"
                          ><i class="fas fa-paperclip"></i>
                          Sep2014-report.pdf</a
                        >
                        <span
                          class="mailbox-attachment-size clearfix mt-1"
                        >
                          <span>1,245 KB</span>
                          <a
                            href="#"
                            class="btn btn-default btn-sm float-right"
                            ><i class="fas fa-cloud-download-alt"></i
                          ></a>
                        </span>
                      </div>
                    </li>
                    <li>
                      <span class="mailbox-attachment-icon"
                        ><i class="far fa-file-word"></i
                      ></span>

                      <div class="mailbox-attachment-info">
                        <a href="#" class="mailbox-attachment-name"
                          ><i class="fas fa-paperclip"></i> App
                          Description.docx</a
                        >
                        <span
                          class="mailbox-attachment-size clearfix mt-1"
                        >
                          <span>1,245 KB</span>
                          <a
                            href="#"
                            class="btn btn-default btn-sm float-right"
                            ><i class="fas fa-cloud-download-alt"></i
                          ></a>
                        </span>
                      </div>
                    </li>
                    <li>
                      <span class="mailbox-attachment-icon has-img"
                        ><img
                          src="../../dist/img/photo1.png"
                          alt="Attachment"
                      /></span>

                      <div class="mailbox-attachment-info">
                        <a href="#" class="mailbox-attachment-name"
                          ><i class="fas fa-camera"></i> photo1.png</a
                        >
                        <span
                          class="mailbox-attachment-size clearfix mt-1"
                        >
                          <span>2.67 MB</span>
                          <a
                            href="#"
                            class="btn btn-default btn-sm float-right"
                            ><i class="fas fa-cloud-download-alt"></i
                          ></a>
                        </span>
                      </div>
                    </li>
                    <li>
                      <span class="mailbox-attachment-icon has-img"
                        ><img
                          src="../../dist/img/photo2.png"
                          alt="Attachment"
                      /></span>

                      <div class="mailbox-attachment-info">
                        <a href="#" class="mailbox-attachment-name"
                          ><i class="fas fa-camera"></i> photo2.png</a
                        >
                        <span
                          class="mailbox-attachment-size clearfix mt-1"
                        >
                          <span>1.9 MB</span>
                          <a
                            href="#"
                            class="btn btn-default btn-sm float-right"
                            ><i class="fas fa-cloud-download-alt"></i
                          ></a>
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="container soap soap-a col-4">
          <p class="fs-3 header">Assessment評估</p>
          <p class="fs-4 content">
            Lorem, ipsum dolor sit amet consectetur adipisicing
            elit. Distinctio iusto numquam, quasi molestiae
            ratione voluptas. Ullam, similique odit quam
            voluptatum harum itaque asperiores et accusamus
            debitis optio, sunt quae veritatis!
          </p>
        </div>
        <div class="container soap soap-p col-6">
          <p class="fs-3 header">Plan計畫</p>
          <p class="fs-4 content">
            Lorem, ipsum dolor sit amet consectetur adipisicing
            elit. Distinctio iusto numquam, quasi molestiae
            ratione voluptas. Ullam, similique odit quam
            voluptatum harum itaque asperiores et accusamus
            debitis optio, sunt quae veritatis!
          </p>
        </div>
      </div>
    </div>
    <div class="container treatments-container">
      <h3>Treatment治療</h3>
      <div class="container treatment medication-continer">
        <button
          type="button"
          class="btn btn-primary my-1"
          data-bs-toggle="button"
          autocomplete="off"
          aria-pressed="true"
          onclick="displayTurn(this)"
        >
          Medication 用藥
        </button>
        <div id="medications-REC2212345" class="container display">
          <!-- key: record_medication.id -->
          <div key="1" class="container rx">
            <h5>處方藥名稱1</h5>
            <div class="row fw-bolder">供應形式：藥粉</div>
            <div class="row fw-bolder">
              備註: 備註for處方藥名稱1
            </div>

            <table class="record-medication">
              <thead>
                <tr>
                  <!-- key: medication_detail.id -->
                  <th>用藥細節id</th>
                  <th>藥品名稱</th>
                  <th>藥品劑量<br />(單位)</th>
                  <th>處方劑量<br />(mg/kg)</th>
                  <th>每日次數</th>
                  <th>天數</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td key="1">1</td>
                  <td>medicineA</td>
                  <td>50</td>
                  <td>100</td>
                  <td>3</td>
                  <td>7</td>
                </tr>
                <tr>
                  <td key="2">2</td>
                  <td>medicineB</td>
                  <td>70</td>
                  <td>50</td>
                  <td>1</td>
                  <td>7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="container treatment other-treatments-container">
        <button
          type="button"
          class="btn btn-primary my-1"
          data-bs-toggle="button"
          autocomplete="off"
          aria-pressed="true"
          onclick="displayTurn(this)"
        >
          Others treatments其他治療
        </button>
        <div id="treatmetns-REC2212345" class="container display">
          <div class="container tx">
            <table class="record-medication">
              <thead>
                <tr>
                  <th>治療id</th>
                  <th>項目</th>
                  <th>說明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <!-- key: record_exam.id -->

                  <td key="1">1</td>
                  <td>胸腔手術</td>
                  <td>取出胡迪娃娃</td>
                </tr>
                <tr>
                  <td key="2">2</td>
                  <td>健康檢查</td>
                  <td>手術前健康檢查</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="container payment-container">
      <h3>費用計算</h3>
      <div
        class="container payment payment-container payment-exams"
      >
        <button
          type="button"
          class="btn btn-primary my-1"
          data-bs-toggle="button"
          autocomplete="off"
          aria-pressed="true"
          onclick="displayTurn(this)"
        >
          醫療檢驗
        </button>
        <div id="payment-exams-REC2212345" class="container display">
          <!-- key: record_exam.id -->
          <div key="1" class="container">
            <table class="record-medication">
              <thead>
                <tr>
                  <!-- key: medication_detail.id -->
                  <th>檢驗id</th>
                  <th>項目</th>
                  <th>說明</th>
                  <th>單價</th>
                  <th>數量</th>
                  <th>小計</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td key="1">1</td>
                  <td>胸腔X光</td>
                  <td>前後兩側</td>
                  <td>600</td>
                  <td>2</td>
                  <td>1200</td>
                </tr>
                <tr>
                  <td key="2">2</td>
                  <td>血液檢查</td>
                  <td>WBC、RBC</td>
                  <td>500</td>
                  <td>1</td>
                  <td>500</td>
                </tr>
                <tr>
                  <td key="3">3</td>
                  <td>尿液檢查</td>
                  <td></td>
                  <td>200</td>
                  <td>1</td>
                  <td>200</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        class="container payment payment-container payment-medications"
      >
        <button
          type="button"
          class="btn btn-primary my-1"
          data-bs-toggle="button"
          autocomplete="off"
          aria-pressed="true"
          onclick="displayTurn(this)"
        >
          Medication 用藥
        </button>
        <div
          id="payment-medications-REC2212345"
          class="container display"
        >
          <!-- key: record_medication.id -->
          <div key="1" class="container rx">
            <h5>處方藥名稱1</h5>
            <div class="row fw-bolder">供應形式：藥粉</div>
            <div class="row fw-bolder">
              備註：備註for處方藥名稱1
            </div>

            <table class="record-medication">
              <thead>
                <tr>
                  <!-- key: medication_detail.id -->
                  <th>用藥細節id</th>
                  <th>藥品名稱</th>
                  <th>藥品劑量<br />(單位)</th>
                  <th>處方劑量<br />(mg/kg)</th>
                  <th>每日次數</th>
                  <th>天數</th>
                  <th>單價</th>
                  <th>製藥數量</th>
                  <th>折扣</th>
                  <th>小計</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td key="1">1</td>
                  <td>medicineA</td>
                  <td>50</td>
                  <td>100</td>
                  <td>3</td>
                  <td>7</td>
                  <td>100</td>
                  <td>21</td>
                  <td>1</td>
                  <td>2100</td>
                </tr>
                <tr>
                  <td key="2">2</td>
                  <td>medicineB</td>
                  <td>70</td>
                  <td>50</td>
                  <td>1</td>
                  <td>7</td>
                  <td>50</td>
                  <td>7</td>
                  <td>1</td>
                  <td>350</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        class="container payment payment-container payment-other-treatments"
      >
        <button
          type="button"
          class="btn btn-primary my-1 "
          data-bs-toggle="button"
          autocomplete="off"
          aria-pressed="true"
          onclick="displayTurn(this)"
        >
          Other treatments其他治療
        </button>
        <div
          id="payment-treatments-REC2212345"
          class="container display"
        >
          <div class="container tx">
            <table class="record-medication">
              <thead>
                <tr>
                  <th>id</th>
                  <th>項目</th>
                  <th>說明</th>
                  <th>單價</th>
                  <th>數量</th>
                  <th>折扣</th>
                  <th>小計</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <!-- key: record_exam.id -->

                  <td key="1">1</td>
                  <td>胸腔手術</td>
                  <td>取出胡迪娃娃</td>
                  <td>10000</td>
                  <td>1</td>
                  <td>1</td>
                  <td>10000</td>
                </tr>
                <tr>
                  <td key="2">2</td>
                  <td>健康檢查</td>
                  <td>手術前健康檢查</td>
                  <td>1500</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`
