import { writable } from 'svelte/store'

export let paceTimes = writable(
  [""]
)

export let newPace = writable("")
