// receive time (string) and return time in milliseconds (number)
function strToTime(timeStr) {
  let min = parseInt(timeStr.substring(0,1))
  let sec = parseInt(timeStr.substring(2,4))
  let mil = parseInt(timeStr.substring(5))

  return (min * 60000) + (sec * 1000) + mil
}

// receive time (in milliseconds) and return time as a string (m:ss.xxx)
// leading zeros added where needed to maintain format
function timeToStr(timeVal) {
  let min = Math.floor(timeVal / 60000)
  let sec = Math.floor((timeVal - ( 60000 * min )) / 1000)
  if (sec < 10) { sec = `0${sec}`}
  let mil = timeVal - (min * 60000) - (sec * 1000)
  if (mil < 10) {
    mil = `00${mil}`
  } else if (mil < 100) {
    mil = `0${mil}`
  }
  return `${min}:${sec}.${mil}`
}

function convertTime(time) {
  if ( typeof time === 'string') {
    return strToTime(time)
  } else if ( typeof time === 'number') {
    return timeToStr(time)
  }
}

export default convertTime
