<script>
import { user, circuitData, inputArr } from '../stores/UserStore.js'
import { circuitEval, driverRating, userTitle } from '../stores/DerivedStore.js'
import SaveButton from './subcomponents/SaveButton.svelte'

// -- Record of users lap times and ratings at all circuits --
// User enters lap time (input elements)
// Save button (subcomponent: SaveButton.svelte) triggers check and update of stored user laptimes.

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

// Retrieve circuit rating for each circuit from derived store
function circuitRating(circuit) {
  let entry = $circuitEval.filter(item => item.circuit === circuit)
  return entry[0].rating
}
</script>

<div style="text-align:center">
  <h2>{$userTitle}</h2>
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
  <p>{circuitRating(entry.circuit)}</p>
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
