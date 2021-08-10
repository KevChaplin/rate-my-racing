<script>
  import { circuitData } from '../stores/UserStore.js'
  import { fade } from 'svelte/transition';
</script>

<!-- Table of reference lap times for each rating at each circuit -->
<!-- Data in store: UserStore  -->

<div class="container" in:fade="{{delay: 500, duration: 1000}}" out:fade="{{duration: 400}}">
  <table>
    <tr>
      <th>CIRCUIT</th>
      <th class="platinum">PLATINUM</th>
      <th class="gold">GOLD</th>
      <th class="silver">SILVER</th>
      <th class="bronze">BRONZE</th>
    </tr>

    <!--  Note: all app circuit times stored in m:ss.xxx format, however times displayed here as m:ss.x for simplicity (no rounding needed based on data) -->
    {#each $circuitData as entry}
    <tr>
      <td>{entry.circuit}</td>
      <td>{entry.platinum.substring(0,6)}</td>
      <td>{entry.gold.substring(0,6)}</td>
      <td>{entry.silver.substring(0,6)}</td>
      <td>{`${entry.silver.substring(0,6)}+`}</td>
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
    table-layout: auto;
    width: 100%;
    border: none;
    border-spacing: 0 5px;
  }
  td {
    margin: 0;
    padding: 6px 0px;
    width: 20%;
    border: none;
    font-size: 14px;
  }
  th, td {
    background-color: rgba(255, 255, 255, 0.7);
    overflow: hidden;
  }
  th {
    padding: 10px 0;
  }
  .platinum {
    background: linear-gradient(330deg, #555564, #ffffff, #dedeff);
  }
  .gold {
    background: linear-gradient(330deg, #8f6B29, #FDE08D, #DF9F28);
  }
  .silver {
    background: linear-gradient(330deg, #454545, #cccccc, #d9d9d9);
  }
  .bronze {
    background: linear-gradient(330deg, #732100, #a14521, #ffdeca, #ca7345);
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
