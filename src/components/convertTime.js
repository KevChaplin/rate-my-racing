// receive time (string) and return time in milliseconds (number)
function convertTime(timeStr) {
  let min = parseInt(timeStr.substring(0,1))
  let sec = parseInt(timeStr.substring(2,4))
  let mil = parseInt(timeStr.substring(5))

  return (min * 60000) + (sec * 1000) + mil
}

export default convertTime
