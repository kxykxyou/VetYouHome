if (!localStorage.user || !localStorage.vyh_token) {
  location.href = '/signin.html'
}
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.vyh_token}`,
  Accept: 'application/json'
}

const timezoneOffsetMilliseconds = new Date().getTimezoneOffset() * 60 * 1000

const url = location.href
if (url.includes('clinic.html')) {
  // 若為clinic頁面，加粗navbar的病歷系統
  $('a[href="/records.html"]').addClass('fw-bold').css('color', '#000000')
} else {
  const fileName = url.split('/')[url.split('/').length - 1]
  // 若非clinic頁面，則filter相對應的page link font
  $('.navbar-nav li a').each((i, e) => {
    if ($(e).attr('href') === '/' + fileName) {
      $(e).addClass('fw-bold').css('color', '#000000')
    }
  })
}

const user = JSON.parse(localStorage.user)
// $('#user-dropdown').append($('<p>').addClass('user-fullname').html(user.fullname))
$('#user-dropdown').append('&ensp;' + user.fullname + '&ensp;')

async function signout () {
  localStorage.clear()
  location.href = '/signin.html'
}
