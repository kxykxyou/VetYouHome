const url = location.href
let cacheRecords // id: complex record objects
const cacheRenderedRecordIds = {} // id: complex record objects；已經render過的完整record的id
const displayBlockTags = [
  $('#left-container'),
  $('#right-container')
]

const petId = url.split('#')[url.split('#').length - 1]

renderAllRecordHeaders(petId)

async function renderAllRecordHeaders (petId) {
  // get all records of target pet (not nested)
  const { data } = await (await fetch(`/api/1.0/clinic/records/pet/id/${petId}`)).json()
  cacheRecords = data
  let recordHeadersHtml = ''
  data.forEach(record => {
    recordHeadersHtml += makeSingleRecordHeaderHtml(record)
  })
  displayBlockTags.forEach(tag => {
    tag.html(recordHeadersHtml)
  })
}

async function renderBothSingleRecord (recordId) {
  console.log(recordId)
  const { data } = await (await fetch(`/api/1.0/clinic/records/complex/id/${recordId}`)).json()
  const complexRecord = data
  cacheRenderedRecordIds[complexRecord.id] = complexRecord

  //   console.log('cacheRenderedRecordIds: ', cacheRenderedRecordIds)
  const recordContainerTags = $(`.record-container[key=${recordId}]`) //  is Object，除了target tags外還包含length; 往上找到tag帶有特定key的tag
  Object.values(recordContainerTags).splice(0, displayBlockTags.length) // 只拿tag，不拿length或其他沒有用到的attributes
    .map(recordContainerTag => $(recordContainerTag).children('.record-content'))
    .forEach(recordContentTag => { // 視為
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

      insertPaymentTreatmentsTable(complexRecord.id, complexRecord.treatments)
      // 加上其他治療
    })

  //   makePaymentExamTableHtml(data.exams)
  //   makePaymentMedicationTableHtml(data.medications)
  //   makePaymentTreatmentTableHtml(data.treatments)
}

async function singleRecordDisplayTurn (thisTag) {
  const recordId = $(thisTag).parent().parent().attr('key')
  const recordContentTag = $(thisTag).parent().siblings('.record-content')
  if (!cacheRenderedRecordIds[recordId]) {
    // 如果沒有render過該病歷
    await renderBothSingleRecord(recordId)
  }
  recordContentTag.css('display') === 'none' ? recordContentTag.css('display', 'block') : recordContentTag.css('display', 'none')
}

function displayTurn (thisTag) {
  console.log($(thisTag).parent())
  const recordContentTag = $(thisTag).siblings('.display')
  recordContentTag.css('display') === 'none' ? recordContentTag.css('display', 'block') : recordContentTag.css('display', 'none')
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
          { name: 'medicationDetailId', type: 'number', editing: false },
          { name: 'medicineId', type: 'number', editing: false },
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
        { name: 'recordTreatmentId', type: 'number', editing: false },
        { name: 'treatmentId', type: 'number', editing: false },
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
        { name: 'recordExamId', type: 'number', editing: false },
        { name: 'examId', type: 'number', editing: false },
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
  // TODO: insert medication title and comment which will leave a blank <div> for inserting jsGrid table below
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
          { name: 'medicationDetailId', type: 'number', editing: false },
          { name: 'medicineId', type: 'number', editing: false },
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
        { name: 'recordTreatmentId', type: 'number', editing: false },
        { name: 'treatmentId', type: 'number', editing: false },
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

function makeSingleRecordContentHtml (data) {}

async function jsGridTest () {
  const clients = [
    { Name: 'Otto Clay', Age: 25, Country: 1, Address: 'Ap #897-1459 Quam Avenue', Married: false },
    { Name: 'Connor Johnston', Age: 45, Country: 2, Address: 'Ap #370-4647 Dis Av.', Married: true },
    { Name: 'Lacey Hess', Age: 29, Country: 3, Address: 'Ap #365-8835 Integer St.', Married: false },
    { Name: 'Timothy Henson', Age: 56, Country: 1, Address: '911-5143 Luctus Ave', Married: true },
    { Name: 'Ramona Benton', Age: 32, Country: 3, Address: 'Ap #614-689 Vehicula Street', Married: false }
  ]

  const countries = [
    { Name: '', Id: 0 },
    { Name: 'United States', Id: 1 },
    { Name: 'Canada', Id: 2 },
    { Name: 'United Kingdom', Id: 3 }
  ]

  $('#jsGrid').jsGrid({
    width: '100%',
    height: '400px',

    inserting: true,
    editing: true,
    sorting: true,
    paging: true,

    data: clients,

    fields: [
      { name: 'Name', type: 'text', width: 150, validate: 'required' },
      { name: 'Age', type: 'number', width: 50 },
      { name: 'Address', type: 'text', width: 200 },
      { name: 'Country', type: 'select', items: countries, valueField: 'Id', textField: 'Name' },
      { name: 'Married', type: 'checkbox', title: 'Is Married', sorting: false },
      { type: 'control' }
    ]
  })
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
