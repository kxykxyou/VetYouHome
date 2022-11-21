$(function () {
  $('#date-range').daterangepicker({
    autoUpdateInput: false,
    locale: {
      cancelLabel: 'Clear'
    }
  })

  $('#date-range').on('apply.daterangepicker', function (ev, picker) {
    // $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'))
    $(this).val(picker.startDate.format('YYYY/MM/DD') + ' - ' + picker.endDate.format('YYYY/MM/DD'))
  })

  $('#date-range').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('')
  })
})

$(function () {
  $('input[name="inpatientorder-date"]').daterangepicker({
    locale: {
      format: 'YYYY/MM/DD'
    },
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 1901,
    maxYear: parseInt(moment().format('YYYY'), 10)
  })

  // $('input[name="inpatientorder-date"]').on('apply.daterangepicker', function (ev, picker) {
  //   // $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'))
  //   $(this).val(picker.start.format('YYYY-MM-DD'))
  // })
})
