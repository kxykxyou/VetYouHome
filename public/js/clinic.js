const petId = url.split('#')[url.split('#').length - 1]
const sides = ['left', 'right']
const SOAPs = [
  'subjective',
  'objective',
  'assessment',
  'plan'
]
const petStatusMap = {
  0: '非住院/非看診動物',
  1: '待看診',
  2: '看診中',
  3: '住院中'
}
