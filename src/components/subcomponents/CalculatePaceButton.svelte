<script>
  import { paceTimes, newPace, delta } from '../../stores/PaceStore.js'
  import convertTime from '../../shared/convertTime.js'
  import { circuitData } from '../../stores/UserStore.js'

  export let currentPace
  export let currentCircuit

// -- Button to calculate lap pace and delta (difference from stored user lap time) at selected circuit --
// Check if circuit is selected
// User entered lap times (store:PaceStore) values checked for format m:ss:xxx.
// If valid, average lap time given. Delta between new and current pace calculated (if current pace set).
// If not valid, error message via alert.

  function calculatePace() {
    let paceNum
    let deltaNum

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
    // If circuit not selected or invalid entries present, show alert and reset newPace, else, calculate and set pace (store: newPace).
    if (!currentCircuit) {
      alert("Select circuit")
      newPace.set("")
    } else if (invalidEntries > 0) {
      alert(alertStr)
      newPace.set("")
    } else {
      let sum = $paceTimes.reduce((sum, time) => sum + convertTime(time), 0)
      paceNum = Math.floor(sum / $paceTimes.length)
      newPace.set(convertTime(paceNum))
    }

    // Calculate delta between new pace and current pace (if present) (newPace - circuitData.user).
    // If delta less than 10 seconds or one miunte, delta (string) is shortened to "s.xxx" or "ss.xxx" respectively.
    if (currentPace !== "0:00.000") {
      deltaNum = paceNum - convertTime(currentPace)
      let deltaStr = ""
      if ( Math.abs(deltaNum) < 10000 ) {
        deltaStr = convertTime(Math.abs(deltaNum)).substring(3,)
      } else if ( Math.abs(deltaNum) < 60000 ) {
        deltaStr = convertTime(Math.abs(deltaNum)).substring(2,)
      } else {
        deltaStr = convertTime(Math.abs(deltaNum))
      }
      if(deltaNum < 0) {
        delta.set(`- ${deltaStr}`)
      } else {
        delta.set(`+ ${deltaStr}`)
      }
    }
  }
</script>

<button id="calcPaceBtn" on:click|preventDefault={() => calculatePace()}>Calculate Pace</button>

<style>
  button {
    margin: auto;
    padding: 0.4em;
  }
</style>
