const url = location.href
// let cacheRecords // id: complex record objects
const cacheRenderedRecords = {} // id: complex record objects；已經render過的完整record的id
const petInfoTag = $('#pet-info')
const sides = ['left', 'right']

const petStatusMap = {
  0: '',
  1: '待看診',
  2: '看診中',
  3: '住院中'
}

const petId = url.split('#')[url.split('#').length - 1]

renderPetInfo(petId)
renderAllRecordHeaders(petId)

async function renderPetInfo (petId) {
  const { data } = await (await fetch(`/api/1.0/clinic/pets/id/${petId}`)).json()
  const dayDiff = (Date.now() - (new Date(data.birthday))) / (24 * 60 * 60 * 1000)
  console.log(dayDiff)
  const year = Math.floor(dayDiff / 365)
  const month = Math.floor((dayDiff % 365) / 30)
  const html = `
  <div class="row">
    <div id="pet-icon" class="col-1">
      <img
        src="/images/${data.petSpecies === 'c' ? 'cat' : 'dog'}.png"
        alt=""
        class="pet-icon"
        style="width: 5vw; height: 'auto'"
      />
    </div>
    <div class="col-2">
      <div class="row">${data.petName} / ${data.petCode}</div>
      <div class="row">${data.petSpecies === 'c' ? '貓' : '狗'} / ${data.petBreed}</div>
      <div class="row">狀態: ${petStatusMap[data.status]}</div>
    </div>
    <div class="col-2">
      <div class="row">生日: ${new Date(data.birthday).toISOString().split('T')[0]}</div>
      <div class="row">年齡: ${year} y ${month} m</div>
    </div>
    <div class="col-2">
      <div class="row">晶片號碼</div>
      <div class="row">${data.chip}</div>
    </div>
    <div class="col-3">
      <div class="row">備註:</div>
      <div class="row border border-dark">
        ${data.comment}
      </div>
    </div>
  </div>
  `
  petInfoTag.html(html)
}

async function renderAllRecordHeaders (petId) {
  // get all records of target pet (not nested)
  const { data } = await (await fetch(`/api/1.0/clinic/records/pet/id/${petId}`)).json()
  // cacheRecords = data
  let recordHeadersHtml = ''
  data.forEach(record => {
    recordHeadersHtml += makeSingleRecordHeaderHtml(record)
  })
  sides.forEach(side => {
    $(`#${side}-records-container`).html(recordHeadersHtml)
  })
}

async function renderBothSingleRecord (recordId) {
  console.log(recordId)
  const { data } = await (await fetch(`/api/1.0/clinic/records/complex/id/${recordId}`)).json()
  const complexRecord = data
  cacheRenderedRecords[complexRecord.id] = complexRecord

  //   console.log('cacheRenderedRecords: ', cacheRenderedRecords)
  const recordContainerTags = $(`.record-container[key=${recordId}]`) //  is Object，除了target tags外還包含length; 往上找到tag帶有特定key的tag
  Object.values(recordContainerTags).splice(0, recordContainerTags.length) // 只拿tag，不拿length或其他沒有用到的attributes
    .map(recordContainerTag => $(recordContainerTag).children('.record-content'))
    .forEach(recordContentTag => {
      $(recordContentTag).html(makeSOAPHtml(complexRecord))
      $(`.exam-result-${complexRecord.id}`).html(makeExamResultsHtml(complexRecord.exams))

      // 加上medication headers，裡面留要給jsGrid寫表的空div
      const sortedMedications = Object.values(complexRecord.medications).sort((medication1, medication2) => medication1.medicationId - medication2.medicationId)
      $(`.medications-${complexRecord.id}`).html(makeMedicationHeadersHtml(complexRecord.id, sortedMedications))
      // 加上medication table
      insertMedicationTable(sortedMedications)

      insertTreatmentTable(complexRecord.id, complexRecord.treatments)

      // payment表格
      insertPaymentExamsTable(complexRecord.id, complexRecord.exams)

      // 加上payment medication headers，裡面留要給jsGrid寫表的空div
      $(`.medications-${complexRecord.id}`).html(makePaymentMedicationHeadersHtml(complexRecord.id, sortedMedications))
      // 加上payment medication table
      insertPaymentMedicationsTable(sortedMedications)

      // 加上payment treatment table
      insertPaymentTreatmentsTable(complexRecord.id, complexRecord.treatments)
    })
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

function makeSOAPHtml (data) {
  // render soap會順便連其他的空tag一起render好
  // singleRecordContentHtml
  return `
<div class="soap-container">
    <div class="soap soap-s">
        <p class="fs-3 header">Subjective主觀描述</p>
        <p class="fs-4 content">
            ${data.subjective}
        </p>
    </div>
    <div class="soap soap-o">
        <p class="fs-3 header">Objective客觀檢查</p>
        <p class="fs-4 content">
            ${data.objective}
        </p>
        <div class="exam-result">
            ${makeButtonHtml('檢查結果')}
            <div class="display exam-result-${data.id}">
            </div>
        </div>
    </div>
    <div class="row">
        <div class="soap soap-a col-4">
        <p class="fs-3 header">Assessment評估</p>
        <p class="fs-4 content">
            ${data.assessment}
        </p>
        </div>
        <div class="soap soap-p col-6">
        <p class="fs-3 header">Plan計畫</p>
        <p class="fs-4 content">
            ${data.plan}
        </p>
        </div>
    </div>
</div>
        <div class="treatments-container">
        <h3>Treatment治療</h3>
        <div class="treatment medication-container">
            ${makeButtonHtml('Medication用藥')}
            <div class="container display medications-${data.id}">
            </div>
        </div>
        <div class="treatment other-treatments-container">
            ${makeButtonHtml('Other treatments其他治療')}
            <div class="display treatment-table-${data.id}">
            </div>
        </div>
        </div>
        <div class="payment-container">
        <h3>費用計算</h3>
        <div
            class="payment payment-container payment-exams"
        >
            ${makeButtonHtml('Exam醫療檢驗')}
            <div class="display payment-exam-table-${data.id}">
            </div>
        </div>
        <div
            class="payment payment-container payment-medications"
        >
            ${makeButtonHtml('Medication用藥')}
            <div
            class="display payment-medication-${data.id}"
            >
            </div>
        </div>
        <div
            class="payment payment-container payment-other-treatments"
        >
            ${makeButtonHtml('Other treatments其他治療')}
            <div
            class="display payment-treatment-table-${data.id}"
            >
        </div>
    </div>
</div>
    `
}

function makeExamResultsHtml (exams) {
  let html = ''
  exams.forEach(exam => {
    html += `
        <li>
            <a href="/files/${exam.file_path}">${exam.file_path}</a>
        </li>
        `
  })
  return `
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
            ${html}
        </ul>
    </div>
    `
}

function makeMedicationHeadersHtml (recordId, sortedMedications) {
  // TODO: insert medication title and comment which will leave a blank <div> for inserting jsGrid table below
  let medicationHeadersHtml = ''
  sortedMedications.forEach(medication => {
    medicationHeadersHtml += `
    <!-- key: record_medication.id -->
    <div key="${medication.medicationId}" class="rx">
        <div class="fs-4 fw-bolder">${medication.name}</div>
        <div class="row fw-bolder">供應形式：${medication.type}</div>
        <div class="row fw-bolder">
            備註：${medication.comment}
        </div>
        <div class="medication-table-${medication.medicationId}"></div>
    </div>
  `
  })
  $(`.medications-${recordId}`).html(medicationHeadersHtml)
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
          { name: 'medicineId', type: 'number', visible: false, editing: false },
          { name: 'medicineName', type: 'text', editing: true },
          { name: 'medicationDose', type: 'number', editing: true },
          { name: 'frequency', type: 'number', editing: true },
          { name: 'day', type: 'number', editing: true },
          { type: 'control' }
        ]
      }
    )
  })
}

function insertTreatmentTable (recordId, treatments) {
  $(`.treatment-table-${recordId}`).jsGrid(
    {
      width: '100%',
      height: 'auto',

      inserting: true,
      editing: true,
      sorting: true,
      paging: true,

      data: treatments,

      fields: [
        { name: 'recordTreatmentId', type: 'number', visible: false, editing: false },
        { name: 'treatmentId', type: 'number', visible: false, editing: false },
        { name: 'treatmentName', type: 'text', editing: true },
        { name: 'comment', type: 'text', editing: true },
        { type: 'control' }
      ]
    }
  )
}

function insertPaymentExamsTable (recordId, exams) {
  $(`.payment-exam-table-${recordId}`).jsGrid(
    {
      width: '100%',
      height: 'auto',

      inserting: true,
      editing: true,
      sorting: true,
      paging: true,

      data: exams,

      fields: [
        { name: 'recordExamId', type: 'number', visible: false, editing: false },
        { name: 'examId', type: 'number', visible: false, editing: false },
        { name: 'name', type: 'text', editing: true },
        { name: 'comment', type: 'text', editing: true },
        { name: 'originalPrice', type: 'number', editing: false },
        { name: 'price', type: 'number', editing: true },
        { name: 'quantity', type: 'number', editing: true },
        { name: 'discount', type: 'number', editing: true },
        { name: 'subtotal', type: 'number', editing: false },
        { type: 'control' }
      ]
    }
  )
}

function makePaymentMedicationHeadersHtml (recordId, sortedMedications) {
  // insert medication title and comment which will leave a blank <div> for inserting jsGrid table below
  let paymentMedicationHeadersHtml = ''
  sortedMedications.forEach(medication => {
    paymentMedicationHeadersHtml += `
      <!-- key: record_medication.id -->
      <div key="${medication.medicationId}" class="rx">
          <div class="fs-4 fw-bolder">${medication.name}</div>
          <div class="row fw-bolder">供應形式：${medication.type}</div>
          <div class="row fw-bolder">
              備註：${medication.comment ? medication.comment : ''}
          </div>
          <div class="payment-medication-table-${medication.medicationId}"></div>
      </div>
    `
  })
  $(`.payment-medication-${recordId}`).html(paymentMedicationHeadersHtml)
}

function insertPaymentMedicationsTable (sortedMedications) {
  sortedMedications.forEach(medication => {
    $(`.payment-medication-table-${medication.medicationId}`).jsGrid(
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
          { name: 'medicineId', type: 'number', visible: false, editing: false },
          { name: 'medicineName', type: 'text', editing: true },
          { name: 'medicineUnitDose', type: 'number', editing: false },
          { name: 'medicineDoseUnit', type: 'text', editing: false },
          { name: 'medicationDose', type: 'number', editing: true },
          { name: 'frequency', type: 'number', editing: true },
          { name: 'day', type: 'number', editing: true },
          { name: 'originalPrice', type: 'number', editing: false },
          { name: 'price', type: 'number', editing: true },
          { name: 'quantity', type: 'number', editing: true },
          { name: 'discount', type: 'number', editing: true },
          { name: 'subtotal', type: 'number', editing: false },
          { type: 'control' }
        ]
      }
    )
  })
}
function insertPaymentTreatmentsTable (recordId, treatments) {
  $(`.payment-treatment-table-${recordId}`).jsGrid(
    {
      width: '100%',
      height: 'auto',

      inserting: true,
      editing: true,
      sorting: true,
      paging: true,

      data: treatments,

      fields: [
        { name: 'recordTreatmentId', type: 'number', visible: false, editing: false },
        { name: 'treatmentId', type: 'number', visible: false, editing: false },
        { name: 'treatmentName', type: 'text', editing: true },
        { name: 'comment', type: 'text', editing: true },
        { name: 'originalPrice', type: 'number', editing: false },
        { name: 'price', type: 'number', editing: true },
        { name: 'quantity', type: 'number', editing: true },
        { name: 'discount', type: 'number', editing: true },
        { name: 'subtotal', type: 'number', editing: false },
        { type: 'control' }
      ]
    }
  )
}

function makeButtonHtml (buttonName) {
  return `
    <button
        type="button"
        class="btn btn-primary my-1"
        data-bs-toggle="button"
        autocomplete="off"
        aria-pressed="true"
        onclick="displayTurn(this)"
    >
        ${buttonName}
    </button>
    `
}

function makeSingleRecordHeaderHtml (record) {
  return `
        <!-- key: record.id -->
        <div
            key="${record.recordId}"
            class="record-container record-container-${record.recordId}"
            style="display: block"
            >
            <div class="row record-header mx-1">
                <button
                type="button"
                class="btn btn-primary my-1"
                data-bs-toggle="button"
                autocomplete="off"
                aria-pressed="true"
                onclick="singleRecordDisplayTurn(this)"
                >
                <h3>${record.recordCode} | ${new Date(record.recordCreatedAt).toISOString().split('T')[0]} | 主治醫師：${record.vetFullname}</h3>
                </button>
            </div>
            <div class="record-content display">
            </div>
        </div>
    `
}

// function makeSingleRecordContentHtml (data) {}

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
