<script>
import { name, rank} from '../stores/UserStore.js'
import { circuitData } from '../stores/UserStore.js'
import { testTimeData } from '../stores/UserStore.js'
import { afterUpdate } from 'svelte';

let userTitle = ""
let inputArr = []

// after store data is received, create array of all tracks and associated input times
afterUpdate(() => {
  $testTimeData.forEach(item => {
    inputArr.push(
      {
        circuit: item.circuit,
        inputValue: document.getElementById(item.circuit).value
      }
    )
  })
})

// on change in input value (on user entry) relevent inputArr entry (circuit) time is updated.
function inputChange(e) {
  let inputArrIndex = inputArr.findIndex(entry => entry.circuit == e.target.id)
  inputArr[inputArrIndex].inputValue = e.target.value
}

function updateTimes() {
  const timesRegex = /^([0-3]:[0-5][0-9]\.[0-9]{3})$/
  inputArr.forEach(item => {
    if (!timesRegex.test(item.inputValue))
    console.log("error")
  })

  // if(testObj.checkValidity()) {
  //   testTimeData.set([
  //     {
  //       circuit: "Imola",
  //       time: testObj.value
  //     }
  //   ])
  //   console.log(testObj.value, $testTimeData)
  // } else {
  //   console.log("error")
  // }
}

// insert "rank" at end of name (single name) or before surname
const surnameRegex = /(\s+[\w-]+)$/g

if (!surnameRegex.test($name)) {
  userTitle = `${$name} "${$rank}"`
} else {
  userTitle = $name.replace(surnameRegex, ` "${$rank}" ${$name.match(surnameRegex)}`)
}
</script>

<div style="text-align:center">
<h2>{userTitle}</h2>
<button on:click={() => updateTimes()}>Save</button>
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
<div class="my-times">
  <p>{$testTimeData[0].circuit}</p>
  <p>USA</p>
  <p>Base</p>
  <div class="user-time">
    <input id={$testTimeData[0].circuit} type="text" value={$testTimeData[0].time} on:change={(e) => inputChange(e)}>
  </div>
  <p>Silver</p>
</div>
<!-- test div -->
<div class="my-times">
  <p>{$testTimeData[1].circuit}</p>
  <p>USA</p>
  <p>Base</p>
  <div class="user-time">
    <input id={$testTimeData[1].circuit} type="text" value={$testTimeData[1].time} on:change={(e) => inputChange(e)}>
  </div>
  <p>Silver</p>
</div>


{#each $circuitData as entry}
<div class="my-times">
  <p>{entry.circuit}</p>
  <p>{entry.location}</p>
  <p>Base</p>
  <p class="user-time">{entry.user}</p>
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
