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
