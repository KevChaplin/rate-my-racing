import { readable, writable, derived } from 'svelte/store'
import convertTime from '../components/convertTime.js'
import { circuitData } from '../stores/UserStore.js'

export const rank = writable('Plz no Punterino')

export const userRanks = readable([
  "Which one's the brake pedal?",
  "Why is this so difficult?",
  "I'm going back to Gran Turismo",
  "T1 menace",
  "Mobile chicane",
  "Captain Slow",
  "What does that blue flag mean?",
  "Divebomb!",
  "Rage quit",
  "A little knowledge is a dangerous thing",
  "Drift King",
  "Get outta my way!",
  "Plz no Punterino!",
  "I am a driving god!",
  "The Stig",
  "Alien"
])

export const assess = derived(circuitData, ($circuitData) => {
  let arr = []
  $circuitData.forEach(item => arr = [...arr,
    {
      circuit: item.circuit,
      userTime: convertTime(item.user),
      platinumDelta: item.user !== "0:00.000" ? convertTime(item.user) - convertTime(item.platinum) : "N/A",
      rating: item.user === "0:00.000" || convertTime(item.user) > convertTime(item.silver) ? "Bronze"
              : convertTime(item.user) > convertTime(item.gold) ? "Silver"
              : convertTime(item.user) > convertTime(item.platinum) ? "Gold"
              : "Platinum"
      }
  ])
  return arr
})
