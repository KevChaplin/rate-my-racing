<script>
import quotes from '../stores/quotes.js'
import { fade } from 'svelte/transition'

let quoteIndex = Math.floor(Math.random() * quotes.length)
let quote = `"${quotes[quoteIndex].quote}"`
let author = `- ${quotes[quoteIndex].author}`

// -- Header element displaying app title and random quote (taken from store: quotes) --
</script>

<header>
	<h1>RATE MY RACING</h1>
  <h4>- for Assetto Corsa Competizione -</h4>
	<p transition:fade="{{ duration: 2000 }}"><em>{quote}</em><br>{author}</p>
</header>

<style>
	header {
		background-color: red;
		width: 100%;
		text-align: center;
		padding: 5px 0px;
		margin: 0px 0px;
		color: white
	}

  h1 {
		font-family: 'Fugaz One', cursive;
    font-size: 36px;
		line-height: 1;
    font-weight: bold;
		margin: 8px 0 6px 0;
    padding: 0 10px;
  }
	h4 {
		margin: 6px 0 10px 0;
		padding: 0 10px;
	}
	p {
		padding: 0 10px;
		margin: 5px 0;
	}

	@media only screen and (min-width: 600px) {
		header {
			padding: 10px 0;
		}
		h1 {
			font-size: 48px;
			margin: 16px 0 8px 0;
		}
		h4 {
			font-size: 24px;
			margin: 8px 0 16px 0;
		}
	}
</style>
