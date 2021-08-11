<script>
  import { createEventDispatcher } from 'svelte'
  import { fly, fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();
  export let items
  export let activeItem
  let showNav = false;

  function toggleNav() {
    showNav = !showNav
  }
</script>

<!-- For mobile screens, use sidebar nav element. Tab at top displays currently seleced tab. -->
<!-- For tablet or larger screens, sidebar nav is hidden, all tabs shown at top and are selectable -->

<!-- Tabs -->
<div class="tabs" transition:fade="{{ delay: 2000, duration: 2000 }}">
  <img src="icons/menu_white_36dp.svg" alt="Menu" on:click={() => toggleNav()}>
  <ul class="tab-ul">
    {#each items as item}
      <li class="tab-li" class:active={item === activeItem} on:click={() => dispatch('tabChange', item)}>
        <div>{item}</div>
      </li>
    {/each}
  </ul>
</div>

<!-- Side Nav Bar -->
{#if showNav}
<nav transition:fly="{{ x: -200, duration: 1000 }}">
  <ul class="nav-ul">
    {#each items as item}
      <li class="nav-li" class:active={item === activeItem} on:click={() => {toggleNav(); dispatch('tabChange', item)}}>
        <div>{item}</div>
      </li>
    {/each}
  </ul>
</nav>
{/if}

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
    background-color: rgba(0, 0, 0, 0.90);
    position: absolute;
    width: 200px;
    height: 250px;

  }
  .tabs {
    margin-left: auto;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.90);
    height: 50px;
    padding-top: 4px
  }
  .active {
    color: yellow;
    border-bottom: 2px solid yellow;
    padding-bottom: 8px;
    display: list-item;
  }

@media only screen and (min-width: 600px) {
  nav {
    display: none
  }
  .tab-li {
    display: list-item;
    cursor: pointer;
  }
  img {
    display: none;
  }
}

</style>
