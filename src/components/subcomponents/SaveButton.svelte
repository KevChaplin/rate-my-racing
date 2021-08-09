<script>
  import { circuitData } from '../../stores/UserStore.js'
  import { inputArr } from '../../stores/UserStore.js'

// -- Button to validate and update user laptimes --
// User entered values (store:inputArr) values are checked for format m:ss:xxx.
// if valid, relevent user times (store:circuitData) is updated.
// if not valid, input value reset to value stored in store:circuitData. Error message.
// finally inputArr is reset to empty array.
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
  button {
    margin: auto;
    padding: 5px 10px;
    border-radius: 5px;
    border: 2px black;
    background-color: rgba(255, 0, 0, 0.7);
    color: rgba(255, 255, 255, 0.7);
    font-weight: bold;
  }
  button:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.7);
    color: rgba(255, 0, 0, 0.7);
  }
</style>
