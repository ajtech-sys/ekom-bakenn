export const toast = {
  success(msg: string) {
    console.log('SUCCESS:', msg)
    alert(msg)
  },
  error(msg: string) {
    console.error('ERROR:', msg)
    alert(msg)
  },
}
