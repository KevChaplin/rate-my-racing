import { writable } from 'svelte/store'

// Array of user input laptimes (string m:ss.xxx format) for a sinngle circuit to be used to calculate pace. (component: PaceCalculator)
export let paceTimes = writable(
  [""]
)

// New pace calculated from above array (string m:ss.xxx format).
export let newPace = writable("")

// Difference between new pace and current user pace at given circuit (string m:ss.xxx format).
export let delta = writable("")
