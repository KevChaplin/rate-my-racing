<script>
  import { circuitData } from '../stores/UserStore.js'
  import { paceTimes, newPace } from '../stores/PaceStore.js'
  import convertTime from '../shared/convertTime.js'
  import CalculatePaceButton from './subcomponents/CalculatePaceButton.svelte'

  let currentCircuit = ""
  let currentPace = ""

  // Return current pace (lap time) for selected circuit.
  function getTime(circuit) {
    currentPace = $circuitData.filter(item => item.circuit === circuit)[0].user
  }

  // Add new input element to add new lap time.
  function addEntry() {
    $paceTimes = [...$paceTimes, ""]
  }

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

  // Update user laptimes (store: circuitData.user) with newly calculated lap time. Then reset page.
  function updateRecords() {
    if (!currentCircuit) {
      alert("Select circuit")
    } else if (!$newPace) {
      alert('Add lap times and click "Calculate" to set new pace')
    } else {
      let dataIndex = $circuitData.findIndex(item => item.circuit === currentCircuit)
      $circuitData[dataIndex].user = $newPace
      reset()
    }
  }
</script>

<div class="container">
  <div>
    <select name="circuit" id="circuit" bind:value={currentCircuit} on:change="{() => getTime(currentCircuit)}">
      <option value="">--Select Circuit--</option>
      {#each $circuitData as entry}
      <option value={entry.circuit}>{entry.circuit}</option>
      {/each}
    </select>
    <p>Current recorded pace:</p>
    <p>{currentPace}</p>
    <p>New Pace:</p>
    <p>{$newPace}</p>
  </div>

  <div class="lap-times">
    {#each $paceTimes as lap}
    <div>
      <input bind:value={lap} placeholder="0:00.000">
    </div>
    {/each}
    <button on:click={addEntry}>Add Lap</button>
    <button on:click={deleteEntry}>Delete Last</button>
    <CalculatePaceButton />
    <button on:click={updateRecords}>Update Records</button>
    <button on:click={reset}>Reset</button>
  </div>
</div>

<style>
  .container {
    text-align: center;
    width: 100%
  }

  p {
    color: white
  }

</style>
