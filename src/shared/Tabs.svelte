<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher();
  export let items
  export let activeItem
</script>

<!-- Tabs -->
<div class="tabs">
  <img src="icons/menu_white_36dp.svg" alt="Menu">
  <ul class="tab-ul">
    {#each items as item}
      <li class="tab-li" class:active={item === activeItem} on:click={() => dispatch('tabChange', item)}>
        <div>{item}</div>
      </li>
    {/each}
  </ul>
</div>

<nav>
  <ul class="nav-ul">
    {#each items as item}
      <li class="nav-li" class:active={item === activeItem} on:click={() => dispatch('tabChange', item)}>
        <div>{item}</div>
      </li>
    {/each}
  </ul>
</nav>

<style>
  img {
    position: absolute;
    left: 25px;
    cursor: pointer;
    height: 50px;
  }
  ul {
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 8px 0px;
    list-style-type: none;
  }
  .tab-ul {
    flex-direction: row;
  }
  .nav-ul {
    height: 100%;
    flex-direction: column;
    justify-content: space-around;
  }
  li {
    margin: 0 16px;
    font-size: 16px;
    color: white;
  }
  .tab-li {
    display: none;
  }
  .nav-li {
    cursor: pointer;
  }
  nav {
    background-color: rgba(0, 0, 0, 0.95);
    position: absolute;
    width: 200px;
    height: 250px;

  }
  .tabs {
    margin-left: auto;
    margin: 0;
  }
  .active {
    color: yellow;
    border-bottom: 2px solid yellow;
    padding-bottom: 8px;
    display: list-item;
  }
</style>
