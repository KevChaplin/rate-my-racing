<script>
import { name, rank} from '../stores/UserStore.js'
import { circuitData } from '../stores/UserStore.js'

let userTitle = ""

let testTime = "3:56.1"

function testFunction() {

  const testObj = document.getElementById("input1")
  console.log(testTime)
  if(testObj.checkValidity()) {console.log("valid")}
  if(testObj.validity.patternMismatch) {console.log ("patternMismatch")}
}

// insert "rank" at end of name (single name) or before surname (if present)
const regex = /(\s+[\w-]+)$/g

if (!regex.test($name)) {
  userTitle = `${$name} "${$rank}"`
} else {
  userTitle = $name.replace(regex, ` "${$rank}" ${$name.match(regex)}`)
}
</script>

<div style="text-align:center">
<h2>{userTitle}</h2>
<button on:click={() => testFunction()}>Save</button>
</div>

<div class="my-times" style="font-weight:bold">
  <p>CIRCUIT</p>
  <p>LOC.</p>
  <p>DLC</p>
  <p>TIME</p>
  <p>RATING</p>
</div>

<!-- input checks for user entered lap times in format m:ss.xxx with minimum of 1 decimal place entered. -->
<!-- note - preferred regex of ... \.[0-9]{1,3} not working as expected -->
<div class="my-times">
  <p>A track</p>
  <p>USA</p>
  <p>Base</p>
  <div class="user-time">
    <input id="input1" type="text" pattern="[0-3]:[0-5][0-9]\.[0-9][0-9]*[0-9]*" bind:value={testTime}>
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
