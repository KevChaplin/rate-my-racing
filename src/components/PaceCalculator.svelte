<script>
  import { onMount, afterUpdate } from 'svelte'
  import { fade } from 'svelte/transition';
  import { circuitData } from '../stores/UserStore.js'
  import { paceTimes, newPace, delta } from '../stores/PaceStore.js'
  import convertTime from '../shared/convertTime.js'
  import CalculatePaceButton from './subcomponents/CalculatePaceButton.svelte'
  import autoSeparator from '../shared/autoSeparator.js'

  // -- User selects circuit and enters one or more lap times.
  // Then can calculate average pace and delta compared to currrent pace at that circuit (if present).
  // User can then choose to update records with calculated pace.

  let currentCircuit = ""
  let currentPace = ""
  let entryAdded = false
  let tooltip = "With optimal track condition, track temperature 25-30C and at least 80L of fuel, complete at least 10 laps. Insert lap times here to calculate average pace, compare with current record and update if required. Format m:ss.xxx."

  // Move focus to newly created entry (for easy input of entries).
  // "entryAdded" variable included so that focus only moves when inut box complete - allows user to edit previous entries.
  afterUpdate(() => {
    if (entryAdded) {
      document.getElementById(`time${$paceTimes.length-1}`).focus()
      entryAdded = false
    }
   })

  // Return current pace (lap time) for selected circuit.
  function getTime(circuit) {
    currentPace = $circuitData.filter(item => item.circuit === circuit)[0].user
  }

  // Add new input element to allow user to add new lap time.
  function addEntry() {
    $paceTimes = [...$paceTimes, ""]
    entryAdded = true
  }

  //Add event listener for keypress 'return' when entering new laptime to add new line ("addEntry" function)
  function returnKey(e) {
    if (e.key !== "Enter") return;
    document.querySelector("#addBtn").click();
    e.preventDefault()
  }
  onMount(() => {
    document.getElementById("lap-times").addEventListener("keydown", returnKey);
    return () => document.getElementById("lap-times").removeEventListener("keydown", returnKey)
  })

  // Remove last lap time entry.
  function deleteEntry() {
    if ($paceTimes.length > 1) {
      $paceTimes = $paceTimes.slice(0,-1)
    } else {
      $paceTimes = [""]
    }
  }

  // Reset to original state (delete lap times, no track selected)
  function reset() {
    currentCircuit = ""
    currentPace = ""
    paceTimes.set([""])
    newPace.set("")
  }

  // Update user laptimes
  // Firstly initiate click on CalculatePaceButton to generate up-to-date pace and also check for errors.
  // If newPace is set, update store: circuitData.user with newly calculated lap time. Then reset page.
  function updateRecords() {
    document.getElementById("calcPaceBtn").click()
    if ($newPace) {
      let dataIndex = $circuitData.findIndex(item => item.circuit === currentCircuit)
      $circuitData[dataIndex].user = $newPace
      reset()
    }
  }
</script>

<div class="container" in:fade="{{delay: 500, duration: 1000}}" out:fade="{{duration: 400}}">
    <select name="circuit" id="circuit" bind:value={currentCircuit} on:change="{() => getTime(currentCircuit)}">
      <option value="">--Select Circuit--</option>
      {#each $circuitData as entry}
      <option value={entry.circuit}>{entry.circuit}</option>
      {/each}
    </select>
  <div class="records">
    {#if currentCircuit}
      <div class="records-row">
        <p class="text-left">Current Pace:</p>
        <p class="text-right">{currentPace}</p>
      </div>
    {/if}
    {#if $newPace}
      <div>
        <div class="records-row">
          <p class="text-left">New Pace:</p>
          <p class="text-right">{$newPace}</p>
        </div>
        <div class="records-row">
          <p class="text-left">Delta:</p>
          <p class="text-right {/^-/.test($delta) ? 'delta-negative' : 'delta-positive'}">{$delta}</p>
        </div>
      </div>
    {/if}
  </div>

  <div id="lap-times" class="lap-times">
    {#each $paceTimes as paceTime, i}
    <div class="has-tooltip" data-tooltip={tooltip}>
      <p class="text-left">Lap {i+1}</p>
      <input id={`time${i}`} bind:value={paceTime} placeholder="0:00.000" on:input={e => autoSeparator(e)}>
    </div>
    {/each}
  </div>
  <div>
    <button id="addBtn" on:click={addEntry}>Add Lap</button>
    <button id="deleteBtn" on:click={deleteEntry}>Delete Last</button>
    <CalculatePaceButton currentPace={currentPace} currentCircuit={currentCircuit} />
    <button on:click={updateRecords}>Update Records</button>
    <button on:click={reset}>Reset</button>
  </div>
</div>

<style>
  .container {
    text-align: center;
    width: 100%;
    color: black;
  }
  .records {
    margin: 0 auto;
    width: 260px;
  }
  .records-row {
    margin-bottom: 6px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
  }
  p, input, select {
    background-color: rgba(255, 255, 255, 0.7);
  }
  p {
    display: inline-block;
    padding: 6px;
    margin: 4px auto;
    border-radius: 4px;
  }
  input {
    width: 80px;
    border: 0;
  }
  select {
    margin-top: 10px;
  }
  .lap-times {
    margin-top: 16px;
  }
  .delta-positive {
    color: red;
    font-weight: bold;
  }
  .delta-negative {
    color: green;
    font-weight: bold;
  }
  .text-left {
    margin: 0 6px 0 0;
    text-align: right;
    padding-right: 8px
  }
  .text-right {
    margin: 0 0 0 6px;
    text-align: left;
    padding-left: 8px
  }

  @media only screen and (min-width: 600px) {
    p {
      margin: 8px auto;
    }
  }

</style>
