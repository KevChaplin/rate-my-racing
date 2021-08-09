<script>
import { fade } from 'svelte/transition';
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

<div class="container" in:fade="{{delay: 500, duration: 1000}}" out:fade="{{duration: 400}}">
  <SaveButton />
  <table>
    <tr>
      <th>CIRCUIT</th>
      <th>COUNTRY</th>
      <th>TIME</th>
      <th>RATING</th>
    </tr>
    {#each $circuitData as entry}
    <tr>
      <td>{entry.circuit}</td>
      <td>{entry.location}</td>
      <td>
        <input id={entry.circuit} type="text" value={entry.user} on:change={(e) => inputChange(e)}>
      </td>
      <td>{circuitRating(entry.circuit)}</td>
    </tr>
    {/each}
  </table>
</div>

<style>
  .container {
    text-align: center;
    width: 100%;
  }

    table {
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 10px;
      table-layout: auto;
      width: 100%;
      border: none;
      margin-top: 8px;
      border-spacing: 0;
    }
    td {
      margin: 0;
      width: 25%;
      border: none;
      font-size: 14px;
    }

    th, td {
      border-bottom: 1px solid black;
      overflow: hidden;
    }
    th {
      padding: 10px 0;
    }

  input {
    height: 100%;
    width: 80px;
    margin: 0;
    background-color: rgba(255, 255, 255, 0.2);
    text-align: center;
  }

  @media only screen and (min-width: 600px) {
    .container {
      width: 600px;
      margin: 10px auto 0;
    }
    td {
      font-size: 16px;
    }
  }
</style>
