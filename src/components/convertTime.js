// receive time (in milliseconds) and return time in m:ss:xxx format
function convertTime(time) {
  let min = Math.floor(time / 60000)
  let sec = Math.floor((time - min * 60000) / 1000)
  let mil = time - (min * 60000) - ( sec * 1000)

  if (sec < 10) { sec = `0${sec}` }

  if (mil < 10) { mil = `00${mil}`}
  else if (mil < 100) { mil = `0${mil}`}

  return `${min}:${sec}.${mil}`
}

export default convertTime
