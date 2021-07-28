<script>
  import { circuitData } from '../stores/UserStore.js'
</script>

<div class="my-times" style="font-weight:bold">
  <p class="entry">CIRCUIT</p>
  <p class="entry">PLAT.</p>
  <p class="entry">GOLD</p>
  <p class="entry">SILV.</p>
  <p class="entry">BRON.</p>
</div>

{#each $circuitData as entry}
<div class="my-times">
  <p class="entry">{entry.circuit}</p>
  <p class="entry">{entry.platinum}</p>
  <p class="entry">{entry.gold}</p>
  <p class="entry">{entry.silver}</p>
  <p class="entry">{`${entry.silver}+`}</p>
</div>
{/each}

<style>
  .my-times {
    box-sizing: border-box;
    width: 100%;
    background-color: black;
    border: 2px solid black;
    margin: 10px auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-column-gap: 2px;
  }
  .entry {
    padding: 5px 2px;
    margin: 0;
    background-color: white;
    font-size: 14px;
    text-align: center
  }
</style>
