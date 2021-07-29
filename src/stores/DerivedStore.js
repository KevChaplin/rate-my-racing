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
  "You shall not pass!",
  "Plz no Punterino!",
  "I am a driving god!",
  "The Stig",
  "Alien"
])

export const circuitEval = derived(circuitData, ($circuitData) => {
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

export const driverRating = derived(circuitEval, ($circuitEval) => {
  function points(rating) {
    return (
      rating === "Platinum" ? 3
      : rating === "Gold" ? 2
      : rating === "Silver" ? 1
      : 0
    )
  }
  let scoreTotal = $circuitEval.reduce(function(total, current) {
    return total + points(current.rating)
  }, 0)
  let scoreAvg = Math.round(scoreTotal / $circuitEval.length)

  return (
    scoreAvg === 3 ? "Platinum"
    : scoreAvg === 2 ? "Gold"
    : scoreAvg === 1 ? "Silver"
    : "Bronze"
  )
})
