const url = location.href
const petId = url.split('#')[url.split('#').length - 1]

function signgleRecordDisplayTrun (thisTag) {
  console.log($(thisTag).parent())
  const recordContentTag = $(thisTag).parent().siblings('.record-content')
  recordContentTag.css('display') === 'none' ? recordContentTag.css('display', 'block') : recordContentTag.css('display', 'none')
}

function displayTurn (thisTag) {
  console.log($(thisTag).parent())
  const recordContentTag = $(thisTag).siblings('.display')
  recordContentTag.css('display') === 'none' ? recordContentTag.css('display', 'block') : recordContentTag.css('display', 'none')
}
