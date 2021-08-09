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
    let alertStr = `
      ${validEntries} updated,
      ${invalidEntries.length} invalid - ${invalidEntries.join(', ')}
      Please use format m:ss.xxx
      `
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
    background-color: rgba(255, 255, 255, 0.7);
    font-weight: bold;
  }
  button:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.9);
  }
</style>
