<script>
  import { paceTimes, newPace } from '../../stores/PaceStore.js'
  import convertTime from '../../shared/convertTime.js'

// User entered lap times (store:PaceStore) values are checked for format m:ss:xxx.
// If valid, average lap time given.
// If not valid, error message via alert.
  function calculatePace() {
    // Validate entries
    const timesRegex = /^([0-3]:[0-5][0-9]\.[0-9]{3})$/
    let invalidEntries = 0
    $paceTimes.forEach(item => {
      if (!timesRegex.test(item)) {
        invalidEntries++
      }
    })
    // Alert string
    let alertStr = `
      Invalid entries.
      Please use format m:ss.xxx
      `
    // If invalid entries present, show alert, else, calculate and set pace (store: newPace).
    if(invalidEntries > 0) {
      alert(alertStr)
    } else {
      let sum = $paceTimes.reduce((sum, time) => sum + convertTime(time), 0)
      let average = Math.floor(sum / $paceTimes.length)
      let pace = convertTime(average)
      newPace.set(pace)
    }
  }
</script>

<button on:click|preventDefault={() => calculatePace()}>Calculate Pace</button>

<style>
  button {
    margin: auto;
    padding: 5px 10px;
  }
</style>
