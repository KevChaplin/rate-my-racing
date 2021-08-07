<script>
import quotes from '../stores/quotes.js'

let quoteIndex = Math.floor(Math.random() * quotes.length)
let quote = `"${quotes[quoteIndex].quote}"`
let author = `- ${quotes[quoteIndex].author}`

</script>

<header>
	<h1>RATE MY RACING</h1>
  <h4>- for Assetto Corsa Competizione -</h4>
	<p><em>{quote}</em><br>{author}</p>
</header>

<style>
	header {
		background-color: red;
		width: 100%;
		text-align: center;
		padding: 10px 0px;
		margin: 0px 0px;
		color: white
	}

  h1 {
    font-size: 36px;
    font-weight: bold;
		margin: 16px 0 8px 0;
    padding: 0;
  }
	h4 {
		margin: 8px 0 16px 0;
	}
</style>
