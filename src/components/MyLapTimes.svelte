<script>
import { name, rank} from '../stores/UserStore.js'
import { circuitData } from '../stores/UserStore.js'
import { inputArr } from '../stores/UserStore.js'
import SaveButton from './SaveButton.svelte'

//  LOGICAL FLOW:
// --> User enters lap time (input)
// --> Array of input lap times (store: inputArr) is updated.
// --> Update data button triggers check. Each entry in (inputArr) is checked for validity based on required format (m:ss:xxx)
// --> For each entry that is valid, array of user times (store: XXXXXX) is updated.
// --> For invalid entries, that entry's value is reset to the value recorder in (store: XXXX)

// On input change, update store: inputArr, which records all input values so they can be validated.
// Any changed input value is added to array, overwriting any already input values for same circuits.
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
<SaveButton />
</div>

<div class="my-times" style="font-weight:bold">
  <p>CIRCUIT</p>
  <p>LOC.</p>
  <p>DLC</p>
  <p>TIME</p>
  <p>RATING</p>
</div>

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
