// receive time (in string) and return time in milliseconds
function convertTime(timeStr) {
  let min = parseInt(timeStr.substring(0,1))
  let sec = parseInt(timeStr.substring(2,4))
  let mil = parseInt(timeStr.substring(5))

  return (min * 60000) + (sec * 1000) + mil
}

export default convertTime


// if (sec < 10) { sec = `0${sec}` }
//
// if (mil < 10) { mil = `00${mil}`}
// else if (mil < 100) { mil = `0${mil}`}
