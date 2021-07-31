<script>
  import { user } from '../stores/UserStore.js'
  import { driverRating , circuitEval } from '../stores/DerivedStore.js'

  //find weakest circuit (user time minus platinum time is highest)
  //find strongest circuit (user time minus platinum time is lowest)
  let weakest = ""
  let strongest = ""
  let maxDelta
  let minDelta
  $circuitEval.forEach(item => {
    if (item.platinumDelta) {
      if ( !maxDelta || item.platinumDelta > maxDelta ) {
        maxDelta = item.platinumDelta
        weakest = item.circuit
      } else if ( !minDelta || item.platinumDelta < minDelta ) {
        minDelta = item.platinumDelta
        strongest = item.circuit
      }
    }
  })
</script>

<h2>User Profile</h2>
<div class="profile">
  <p class="text-left">Name:</p>
  <input placeholder="Enter Name" bind:value={$user.name}>
  <p class="text-left">Nationality:</p>
  <input placeholder="Enter Nationality" bind:value={$user.nationality}>
  <p class="text-left">Rating:</p>
  <p class="text-right">{$driverRating.rating}</p>
  <p class="text-left">Rank:</p>
  <p class="text-right">{`"${$driverRating.rank}"`}</p>
  <p class="text-left">Strongest Track:</p>
  <p class="text-right">{strongest}</p>
  <p class="text-left">Weakest Track:</p>
  <p class="text-right">{weakest}</p>
</div>

<style>
  h2 {
    text-align: center;
    margin: 10px;
  }

  .profile {
    padding: 5px;
    margin: 0;
    color: white;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(6, 1fr);
    justify-content: center;
  }

  .text-left {
    margin: 10px 0;
    text-align: right;
    padding-right: 5px
  }

  .text-right {
    margin: 10px 0;
    text-align: left;
    padding-left: 5px
  }

  input {
    width: 150px;
    border: 0;
    padding-left: 5px;
    margin: 0;
    color: white;
    background: none;
  }
  ::placeholder {
    color: silver;
  }

</style>
