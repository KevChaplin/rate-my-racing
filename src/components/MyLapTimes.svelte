<script>
import { fade } from 'svelte/transition';
import { user, circuitData, inputArr } from '../stores/UserStore.js'
import { circuitEval, driverRating, userTitle } from '../stores/DerivedStore.js'
import SaveButton from './subcomponents/SaveButton.svelte'
import autoSeparator from '../shared/autoSeparator.js'

// -- Record of users lap times and ratings at all circuits --
  // User enters lap time (input elements)
  // Save button (subcomponent: SaveButton.svelte) triggers check and update of stored user laptimes.

let tooltip = "Use average lap time over at least 10 laps, with optimal track condition, track temperature 25-30C and at least 80L of fuel. Format m:ss.xxx."

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

// Retrieve circuit rating for each circuit from store: DerivedStore
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
        <td class="has-tooltip" data-tooltip={tooltip}>
        <input id={entry.circuit} type="text" value={entry.user} placeholder="0:00.000" on:input={e => autoSeparator(e)} on:change={(e) => inputChange(e)}>
      </td>
      <td value={circuitRating(entry.circuit)}>{circuitRating(entry.circuit)}</td>
    </tr>
    {/each}
  </table>
</div>

<style>
  .container {
    text-align: center;
    width: 100%;
    margin: 10px auto 0;
  }
  table {
    table-layout: auto;
    width: 100%;
    border: none;
    margin-top: 5px;
    border-spacing: 0 5px;
  }
  td {
    margin: 0;
    padding: 6px 0px;
    width: 25%;
    border: none;
    font-size: 14px;
  }
  td[value="Platinum"] {
    background: linear-gradient(330deg, #555564, #ffffff, #dedeff);
  }
  td[value="Gold"] {
    background: linear-gradient(330deg, #8f6B29, #FDE08D, #DF9F28);
  }
  td[value="Silver"] {
    background: linear-gradient(330deg, #454545, #cccccc, #d9d9d9);
  }
  td[value="Bronze"] {
    background: linear-gradient(330deg, #732100, #a14521, #ffdeca, #ca7345);
  }
  th, td {
    background-color: rgba(255, 255, 255, 0.7);
  }
  th {
    padding: 10px 0;
  }
  input {
    height: 100%;
    width: 70px;
    margin: 0;
    padding: 0;
    background-color: rgba(255, 255, 255, 0.2);
    text-align: center;
  }

  @media only screen and (min-width: 600px) {
    .container {
      width: 600px;
    }
    td {
      font-size: 16px;
    }
  }
</style>
