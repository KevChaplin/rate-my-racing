<script>
import quotes from '../stores/quotes.js'

let quoteIndex = Math.floor(Math.random() * quotes.length)
let quote = `"${quotes[quoteIndex].quote}"`
let author = `- ${quotes[quoteIndex].author}`

</script>

<header>
	<h1>RATE MY RACING</h1>
  <h4>for Assetto Corsa Competizione</h4>
	<p><em>{quote}</em><br>{author}</p>
</header>

<style>
	header {
		background-color: red;
		text-align: center;
		padding: 16px 16px;
		margin: 0;
		color: white
	}

  h1 {
    font-size: 36px;
    font-weight: 100;
    padding: 0 5px;
  }
</style>
