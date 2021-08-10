<script>
	import { fade } from 'svelte/transition';
  import { user } from '../stores/UserStore.js'
  import { userTitle, driverRating , circuitEval } from '../stores/DerivedStore.js'

// -- Display user information --
// Inputs for Name and Nationality
// Users title and rating taken from store: DerivedStore

  let weakest = ""
  let strongest = ""
  let maxDelta
  let minDelta

	// Find weakest circuit (user time minus platinum time is highest)
	// Find strongest circuit (user time minus platinum time is lowest)
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
    <h2 class={$driverRating.rating}>{$userTitle}</h2>
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
	.Platinum {
		background: linear-gradient(#555564, #ffffff, #dedeff, #b6b6fc);
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
	}
	.Gold {
		background: linear-gradient(#8f6B29, #FDE08D, #DF9F28);
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
	}
	.Silver {
		background: linear-gradient(#757575 0%, #9E9E9E 45%, #E8E8E8 70%, #9E9E9E 85%, #757575);
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
	}
	.Bronze {
		background: linear-gradient(#732100, #a14521, #ffdeca, #ca7345);
						-webkit-text-fill-color: transparent;
						-webkit-background-clip: text;
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
