import { readable, writable, derived } from 'svelte/store'
import convertTime from '../components/convertTime.js'
import { circuitData } from '../stores/UserStore.js'

const userRanks = [
  "Which one's the brake pedal?",
  "Why is this so difficult?",
  "I'm going back to Gran Turismo",
  "T1 Menace",
  "Mobile Chicane",
  "Captain Slow",
  "What does that blue flag mean?",
  "Divebomb!",
  "Rage Quit",
  "A little knowledge is a dangerous thing",
  "You shall not pass!",
  "Plz no Punterino!",
  "I am a driving god!",
  "The Stig",
  "Alien"
]

// Evaluate each circuit's user time and return rating and delta (difference from platimum time) for finding best and worst circuit.
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

// Return object of overall driver rating and driver rank
export const driverRating = derived(circuitEval, ($circuitEval) => {
  //Allocate points per rating per circuits. Find average accross all circuits to find overall driver rating.
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
  let rating = scoreAvg === 3 ? "Platinum"
    : scoreAvg === 2 ? "Gold"
    : scoreAvg === 1 ? "Silver"
    : "Bronze"

  // Allocate userRanks over range of possible scores (set up in case number of tracks change)
  let maxScore = $circuitEval.length * 3
  let ranksIndex = Math.round(scoreTotal / (maxScore / userRanks.length))
  let rank = userRanks[ranksIndex]

  return {
    rating: rating,
    rank: rank
  }
})
