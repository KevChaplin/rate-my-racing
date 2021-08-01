<script>
	import Header from './components/Header.svelte'
	import UserProfile from './components/UserProfile.svelte'
	import MyLapTimes from './components/MyLapTimes.svelte'
	import ReferenceTimes from './components/ReferenceTimes.svelte'
	import PaceCalculator from './components/PaceCalculator.svelte'
	import Tabs from './shared/Tabs.svelte'

	//tabs
	let items = ["User Profile", "My Lap Times", "Reference Times", "Pace Calculator"]
	let activeItem = "User Profile"
	const tabChange = (e) => {
		activeItem = e.detail
	}
</script>

<Header />
<main>
	<Tabs {activeItem} {items} on:tabChange={tabChange}/>
	{#if activeItem === "User Profile"}
		<UserProfile />
	{:else if activeItem === "My Lap Times"}
		<MyLapTimes />
	{:else if activeItem === "Reference Times"}
		<ReferenceTimes />
	{:else if activeItem === "Pace Calculator"}
		<PaceCalculator />
	{/if}
</main>


<style>

</style>
