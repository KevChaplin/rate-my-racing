<script>
  import { circuitData } from '../stores/UserStore.js'
  import { paceTimes } from '../stores/PaceStore.js'
  import convertTime from '../shared/convertTime.js'

  let value = ""
  let currentPace = ""
  let newPace = ""

  function getTime(circuit) {
    currentPace = $circuitData.filter(item => item.circuit === circuit)[0].user
  }

  function addEntry() {
    $paceTimes = [...$paceTimes, "0:00.000"]
  }

  function deleteEntry() {
    if ($paceTimes.length > 1) {
      $paceTimes = $paceTimes.slice(0,-1)
    } else {
      $paceTimes = ["0:00.000"]
    }
  }

  function calcPace() {
    let sum = $paceTimes.reduce((sum, time) => sum + convertTime(time), 0)
    let average = Math.floor(sum / $paceTimes.length)
    newPace = convertTime(average)
  }
</script>

<div class="container">
  <div>
    <select name="circuit" id="circuit" bind:value on:change="{() => getTime(value)}">
      <option value="">--Select Circuit--</option>
      {#each $circuitData as entry}
      <option value={entry.circuit}>{entry.circuit}</option>
      {/each}
    </select>
    <p>Current recorded pace:</p>
    <p>{currentPace}</p>
    <p>New Pace:</p>
    <p>{newPace}</p>
  </div>

  <div class="lap-times">
    {#each $paceTimes as lap}
    <div>
      <input bind:value={lap}>
    </div>
    {/each}
    <button on:click={addEntry}>Add Lap</button>
    <button on:click={deleteEntry}>Delete Last</button>
    <button on:click={calcPace}>Calculate Pace</button>
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
