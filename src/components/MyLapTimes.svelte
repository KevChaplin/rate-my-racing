<script>
import { name, rank} from '../stores/UserStore.js'
import { circuitData } from '../stores/UserStore.js'
import { inputArr } from '../stores/UserStore.js'

//  LOGICAL FLOW:
// --> User enters lap time in input elements.
// --> Array of input lap times (store: inputArr) is updated with each new entry.
// --> "Save"" data button triggers check. Each entry in (inputArr) is checked for validity based on required format (m:ss:xxx)
// --> For each entry that is valid, array of user times (store: XXXXXX) is updated.
// --> For invalid entries, that entry's value is reset to the value recorder in (store: XXXX)

// On input change, update store: inputArr, which records all input values so they can be validated.
// Any changed input value is added to array, overwriting any already input values for the same circuit.
function inputChange(e) {
  let newArr = $inputArr.filter(function(item) {
    return item.circuit !== e.target.id
  })
  newArr = [ ...newArr,
    {
      circuit: e.target.id,
      inputValue: e.target.value
    }
  ]
  inputArr.set([...newArr])
  // ^ CHECK
}

// User entered values (store:inputArr) values are checked for format m:ss:xxx.
// if valid, relevent user times (store:circuitData) is updated.
// if not valid, input value reset to value stored in store:circuitData. Error message.
// finally inputArr is reset to blank array.
function saveTimes() {
  const timesRegex = /^([0-3]:[0-5][0-9]\.[0-9]{3})$/
  let data = [...$circuitData]
  $inputArr.forEach(item => {
    let index = data.findIndex(entry => entry.circuit === item.circuit)
    if (timesRegex.test(item.inputValue)) {
      data[index].user = item.inputValue
      circuitData.set([...data])
    }
    else {
      document.getElementById(item.circuit).value = data[index].user
      console.log("error")
    }
  })
  inputArr.set([])
  console.log($circuitData)
}

// Insert "rank" at end of name (single name) or before surname
let userTitle = ""
const surnameRegex = /(\s+[\w-]+)$/g

if (!surnameRegex.test($name)) {
  userTitle = `${$name} "${$rank}"`
} else {
  userTitle = $name.replace(surnameRegex, ` "${$rank}" ${$name.match(surnameRegex)}`)
}

</script>

<div style="text-align:center">
<h2>{userTitle}</h2>
<button on:click|preventDefault={() => saveTimes()}>Save</button>
</div>

<div class="my-times" style="font-weight:bold">
  <p>CIRCUIT</p>
  <p>LOC.</p>
  <p>DLC</p>
  <p>TIME</p>
  <p>RATING</p>
</div>

<!-- input checks for user entered lap times in format m:ss.xxx with minimum of 1 decimal place entered. -->
<!-- note - preferred regex of ... \.[0-9]{1,3} not working as expected   pattern="[0-3]:[0-5][0-9]\.[0-9][0-9][0-9]" -->
<!-- test div -->

{#each $circuitData as entry}
<div class="my-times">
  <p>{entry.circuit}</p>
  <p>{entry.location}</p>
  <p>Base</p>
  <div class="user-time">
    <input id={entry.circuit} type="text" value={entry.user} on:change={(e) => inputChange(e)}>
  </div>
  <p>Silver</p>
</div>
{/each}

<style>
  h2 {
    color: white
  }
  button {
    margin: auto;
    padding: 5px 10px;
  }
  .my-times {
    box-sizing: border-box;
    width: 100%;
    background-color: black;
    border: 2px solid black;
    margin: 10px auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 2fr 2fr;
    grid-column-gap: 2px;
  }
  p {
    padding: 10px 5px;
    margin: 0;
    background-color: white;
    font-size: 14px;
    text-align: center
  }
  .user-time {
    background-color: #ffffb3;
  }
  input {
    height: 100%;
    width: 100%;
    margin: 0;
    text-align: center;
  }
</style>
