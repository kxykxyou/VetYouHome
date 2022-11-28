if (!localStorage.user) {
  location.href = '/signin.html'
}
const url = location.href
const fileName = url.split('/')[url.split('/').length - 1]
$('.navbar-nav li a').each((i, e) => {
  if ($(e).attr('href') === '/' + fileName) {
    $(e).addClass('fw-bold').css('color', '#000000')
  }
})
const user = JSON.parse(localStorage.user)
$('#user-dropdown').append(user.fullname)
async function signout () {
  localStorage.clear()
  location.href = '/signin.html'
}
