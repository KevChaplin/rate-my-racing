<script>
	import { fade } from 'svelte/transition';
  import { user } from '../stores/UserStore.js'
  import { userTitle, driverRating , circuitEval } from '../stores/DerivedStore.js'
	import { Email, Reddit, Facebook, Twitter } from 'svelte-share-buttons-component';

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
// -- For Social Media Links --
	let myUrl = "https://kevchaplin.github.io/rate-my-racing/"
	let shareText =
`${$userTitle}
${$driverRating.rating} rated driver
Assetto Corsa Competizione`;
	let shareTitle = $userTitle
	let shareEmail =
`Hey checkout my new rank from ${myUrl}

${shareText}`;
</script>

<div class="container" in:fade="{{delay: 500, duration: 1000}}" out:fade="{{duration: 400}}">
	{#if $user.name}
	<h2 class={$driverRating.rating}>{$userTitle}</h2>
	{/if}
	<table>
		<tr>
      <td class="left-text">Name:</td>
			<td class="right-text">
      	<input placeholder="Enter Name" bind:value={$user.name}>
			</td>
		</tr>
		<tr>
      <td class="left-text">Nationality:</td>
			<td class="right-text">
      	<input placeholder="Enter Nationality" bind:value={$user.nationality}>
			</td>
		</tr>
		<tr>
      <td class="left-text">Rating:</td>
			<td class="right-text">{$driverRating.rating}</td>
		</tr>
		<tr>
      <td class="left-text">Nickname:</td>
      <td class="right-text">{!$driverRating.rank ? "none" : `"${$driverRating.rank}"`}</td>
		</tr>
		<tr>
      <td class="left-text">Strongest Circuit:</td>
      <td class="right-text">{strongest}</td>
		</tr>
		<tr>
      <td class="left-text">Weakest Circuit:</td>
      <td class="right-text">{weakest}</td>
		</tr>
  </table>
	<div class="social-media">
		<Twitter class="share-button" text="{shareText}" url="{myUrl}" />
		<Reddit class="share-button" title="{shareText}" url="{myUrl}" />
		<Facebook class="share-button" url="{myUrl}" />
		<Email subject="{shareTitle}" body="{shareEmail}" />
	</div>
</div>


<style>
  .container {
    text-align: center;
  }
	h2 {
		text-align: center;
		margin: 4px 0 4px 0;
		color: white;
	}
  table{
		table-layout: auto;
		margin: 0 auto;
		border: none;
    padding: 0;
		color: white;
    width: 100%;
    border-spacing: 0 6px;
		font-size: 16px;
  }
	td {
		background-color: rgba(0, 0, 0, 0.7);
		margin: 0;
    padding: 6px 6px;
    width: 50%;
    border: none;
	}
	input {
    width: 150px;
    border: 0;
		padding: 0;
		margin: 6px 0;
    color: white;
    background: none;
		font-size: 14px;
  }
  ::placeholder {
    color: silver;
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
  .left-text {
    text-align: right;
  }
  .right-text {
    text-align: left;
  }
  input {
    width: 150px;
    border: 0;
		padding: 0;
		margin: 0;
    color: white;
    background: none;
  }
  ::placeholder {
    color: #707070;
  }
	.social-media {
		margin-top: 15px;
	}

  @media only screen and (min-width: 600px) {
		table {
			width: 600px;
			border-spacing: 0 10px
		}
    h2 {
			margin: 10px 0 5px 0;
      font-size: 36px;
    }
    td, input {
      font-size: 24px;
    }
    input {
      width: 300px;
    }
		.social-media {
			margin-top: 35px;
		}

  }
</style>
