<script>
  import { onMount, afterUpdate } from 'svelte'
  import { fade } from 'svelte/transition';
  import { circuitData } from '../stores/UserStore.js'
  import { paceTimes, newPace, delta } from '../stores/PaceStore.js'
  import convertTime from '../shared/convertTime.js'
  import CalculatePaceButton from './subcomponents/CalculatePaceButton.svelte'

  // -- User selects circuit and enters one or more lap times.
  // Then can calculate average pace and delta compared to currrent pace at that circuit (if present).
  // User can then choose to update records with calculated pace.

  let currentCircuit = ""
  let currentPace = ""
  let entryAdded = false

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

  // -- Update user laptimes --
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
  <div>
    <select name="circuit" id="circuit" bind:value={currentCircuit} on:change="{() => getTime(currentCircuit)}">
      <option value="">--Select Circuit--</option>
      {#each $circuitData as entry}
      <option value={entry.circuit}>{entry.circuit}</option>
      {/each}
    </select>
    {#if currentCircuit}
      <div>
        <p>Current recorded pace:</p>
        <p>{currentPace}</p>
      </div>
    {/if}
    {#if $newPace}
      <div>
        <div>
          <p>New Pace:</p>
          <p>{$newPace}</p>
        </div>
        <div>
          <p>Delta:</p>
          <p class="{/^-/.test($delta) ? 'delta-negative' : 'delta-positive'}">{$delta}</p>
        </div>
      </div>
    {/if}
  </div>

  <div id="lap-times" class="lap-times">
    {#each $paceTimes as lap,i}
    <div>
      <input id={`time${i}`} bind:value={lap} placeholder="0:00.000">
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
  p {
    display: inline-block;
    padding: 8px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 4px;
  }
  input {
    width: 80px;
    background-color: rgba(255, 255, 255, 0.7);
  }
  select {
    margin-top: 10px;
    background-color: rgba(255, 255, 255, 0.7);
  }

  .delta-positive {
    color: red;
    font-weight: bold;
  }
  .delta-negative {
    color: green;
    font-weight: bold;
  }

</style>
