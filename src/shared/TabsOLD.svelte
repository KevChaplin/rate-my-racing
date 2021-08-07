<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher();
  export let items
  export let activeItem
</script>

<!-- reusable tabs -->
<div class="tabs">
  <ul>
    {#each items as item}
      <li on:click={() => dispatch('tabChange', item)}>
        <div class:active={item === activeItem}>{item}</div>
      </li>
    {/each}
  </ul>
</div>

<style>
  .tabs {
    margin-left: auto;
    margin-bottom: 8px;
  }
  ul {
    display: flex;
    justify-content: center;
    padding-right: 0;
    list-style-type: none;
  }
  li {
    margin: 0 16px;
    font-size: 16px;
    color: white;
    cursor: pointer;
  }
  .active {
    color: yellow;
    border-bottom: 2px solid yellow;
    padding-bottom: 8px;
  }
</style>
