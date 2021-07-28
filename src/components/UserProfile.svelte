<script>
  import { name, nationality } from '../stores/UserStore.js'
  import { rank, assess } from '../stores/AssessmentStore.js'

  let rank_entry;

  rank.subscribe(entry => {
    rank_entry = entry
  })

  //test
  console.log($assess)
</script>

<h2>User Profile</h2>
<div class="profile">
  <p class="text-left">Name:</p>
  <input placeholder="Lewis Hamilton" bind:value={$name}>
  <p class="text-left">Nationality:</p>
  <input placeholder="British" bind:value={$nationality}>
  <p class="text-left">Rating:</p>
  <p class="text-right">Silver</p>
  <p class="text-left">Rank:</p>
  <p class="text-right">{`"${rank_entry}"`}</p>
  <p class="text-left">Strongest Track:</p>
  <p class="text-right">Barcelona</p>
  <p class="text-left">Weakest Track:</p>
  <p class="text-right">Paul Ricard</p>
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
