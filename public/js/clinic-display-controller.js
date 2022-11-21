// control to show which content for each side container
const sideContainerTagsMap = {
  left: [
    $('#left-records-container'),
    $('#left-inpatientorders-container')
    // $('#left-create-record-container'),
    // $('#left-create-inpatientorder-container')
  ],
  right: [
    $('#right-records-container'),
    $('#right-inpatientorders-container'),
    $('#right-create-record-container'),
    $('#right-create-inpatientorder-container')
  ]
}

Object.keys(sideContainerTagsMap)
  .forEach(side => {
    $(`#${side}-display-selector`).on('change', function () {
      const key = $(this).children('option:selected').attr('key')
      sideContainerTagsMap[side].forEach(tag => {
        tag.hide()
      })
      $(`#${key}`).show()
    })
  })
