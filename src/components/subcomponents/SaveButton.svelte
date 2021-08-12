<script>
  import { circuitData } from '../../stores/UserStore.js'
  import { inputArr } from '../../stores/UserStore.js'

// -- Button to validate and update user laptimes (for My Lap Times tab) --

  // User entered values (store:inputArr) values are checked for format m:ss:xxx.
  // If valid, relevent user lap time (store:circuitData) is updated.
  // If not valid, input value reset to value stored in store:circuitData. Error message.
  // Finally inputArr is reset to empty array.
  function saveTimes() {
    const timesRegex = /^([0-3]:[0-5][0-9]\.[0-9]{3})$/
    let data = [...$circuitData]
    let validEntries = 0
    let invalidEntries = []
    $inputArr.forEach(item => {
      let index = data.findIndex(entry => entry.circuit === item.circuit)
      if (timesRegex.test(item.inputValue)) {
        validEntries++
        data[index].user = item.inputValue
        circuitData.set([...data])
      }
      else {
        invalidEntries = [...invalidEntries, item.circuit]
        document.getElementById(item.circuit).value = data[index].user
      }
    })
    inputArr.set([])
    // Alert user of valid and invalid entries
    let validStr = `${validEntries} lap times updated`
    let invalidStr = invalidEntries.length > 0 ? `${invalidEntries.length} lap times invalid - ${invalidEntries.join(', ')}` : "";
    let adviceStr = invalidEntries.length > 0 ? "Please enter lap times in format m:ss.xxx" : "";
    let alertStr =
      `${validStr}
      ${invalidStr}
      ${adviceStr}`
    alert(alertStr)
  }
</script>

<button on:click|preventDefault={() => saveTimes()}>Update Records</button>

<style>

</style>
