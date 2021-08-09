<script>
	import { fade } from 'svelte/transition';
  import { user } from '../stores/UserStore.js'
  import { userTitle, driverRating , circuitEval } from '../stores/DerivedStore.js'

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

<div class="container" in:fade="{{delay: 500, duration: 1000}}" out:fade="{{duration: 400}}">
  <div class="contents">
    <h2>{$userTitle}</h2>
    <div class="profile">
      <p class="text-left">Name:</p>
      <input placeholder="Enter Name" bind:value={$user.name}>
      <p class="text-left">Nationality:</p>
      <input placeholder="Enter Nationality" bind:value={$user.nationality}>
      <p class="text-left">Rating:</p>
      <p class="text-right">{$driverRating.rating}</p>
      <p class="text-left">Nickname:</p>
      <p class="text-right">{`"${$driverRating.rank}"`}</p>
      <p class="text-left">Strongest Track:</p>
      <p class="text-right">{strongest}</p>
      <p class="text-left">Weakest Track:</p>
      <p class="text-right">{weakest}</p>
    </div>
  </div>
</div>

<style>
  .container {
    text-align: center;
  }

  .contents {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 15px 15px;
    margin-top: 15px;
  }

  h2 {
    text-align: center;
    margin: 10px;
    color: white;
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

  @media only screen and (min-width: 600px) {
		.contents {
			border-radius: 10px;
		}
    h2 {
      font-size: 36px;
    }
    p, input {
      font-size: 24px;
    }
    input {
      width: 300px;
    }
  }
</style>
