// Auto-fill colon and decimal point when inputting lap times for ease of data entry.
function autoSeparator(e) {
  if( (/^\d$/).test(e.target.value) ) {
    e.target.value += ":"
  } else if ( (/^\d:\d\d$/).test(e.target.value) ) {
    e.target.value += "."
  }
}

export default autoSeparator
