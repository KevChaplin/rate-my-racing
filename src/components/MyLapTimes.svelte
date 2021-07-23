<script>
import { name, rank} from '../stores/UserStore.js'
import { circuitData } from '../stores/UserStore.js'

let userTitle = ""

// insert "rank" at end of name (single name) or before surname (if present)
const regex = /(\s+[\w-]+)$/g

if (!regex.test($name)) {
  userTitle = `${$name} "${$rank}"`
} else {
  userTitle = $name.replace(regex, ` "${$rank}" ${$name.match(regex)}`)
}
</script>

<h2>{userTitle}</h2>

<div class="my-times" style="font-weight:bold">
  <p>CIRCUIT</p>
  <p>LOC.</p>
  <p>DLC</p>
  <p class="user-time">TIME</p>
  <p>RATING</p>
</div>

{#each $circuitData as entry}
<div class="my-times">
  <p>{entry.circuit}</p>
  <p>{entry.location}</p>
  <p>Base</p>
  <p class="user-time">{entry.user}</p>
  <p>Silver</p>
</div>
{/each}

<style>
  h2 {
    text-align: center;
    color: white
  }

  .my-times {
    box-sizing: border-box;
    width: 100%;
    background-color: black;
    border: 2px solid black;
    margin: 10px auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 2fr 2fr;
    grid-column-gap: 2px;
  }
  p {
    padding: 10px 5px;
    margin: 0;
    background-color: white;
    font-size: 14px;
    text-align: center
  }
  .user-time {
    background-color: #ffffb3;
  }
</style>
