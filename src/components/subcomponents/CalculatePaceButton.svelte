<script>
  import { paceTimes, newPace, delta } from '../../stores/PaceStore.js'
  import convertTime from '../../shared/convertTime.js'
  import { circuitData } from '../../stores/UserStore.js'

  export let currentPace
  export let currentCircuit

// -- Button to validate and calculate lap pace and delta (difference from stored user lap time) at selected circuit --
  function calculatePace() {
    let paceNum
    let deltaNum

    // Check and remove last entry if empty. (Empty entry automatically added if user presses return when entering data - for ease of data entry)
    if ( ($paceTimes.length > 1) && ($paceTimes[$paceTimes.length - 1] === "") ) {
      $paceTimes = [...$paceTimes.slice(0, -1)]
    }

    // Validate entries - user entered lap times (store: PaceStore, paceTimes) values checked for format m:ss:xxx
    const timesRegex = /^([0-3]:[0-5][0-9]\.[0-9]{3})$/
    let invalidEntries = 0
    $paceTimes.forEach(item => {
      if (!timesRegex.test(item)) {
        invalidEntries++
      }
    })

    // Alert string if invalid entries found
    let alertStr = `
      Invalid entries.
      Please use format m:ss.xxx
      `

    // If circuit not selected or invalid entries present, show alert and reset newPace
    // Else, calculate and set pace (store: newPace).
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

<button id="calcPaceBtn" on:click={() => calculatePace()}>Calculate Pace</button>

<style>

</style>
