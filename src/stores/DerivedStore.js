import { readable, writable, derived } from 'svelte/store'
import convertTime from '../shared/convertTime.js'
import { user, circuitData } from '../stores/UserStore.js'

const userRanks = [
  "Brakes?",
  "Black Flag",
  "Going back to Gran Turismo",
  "Mobile Chicane",
  "Captain Slow",
  "T1 Menace",
  "Blue flag?",
  "Divebomb!",
  "Rage Quit",
  "Dangerous",
  "You shall not pass!",
  "Plz no Punterino!",
  "I am a driving god!",
  "The Stig",
  "Alien"
]

// -- Evaluation of user lap times at each circuit (array of objects containing: circuit; user lap time; % difference from platinum time; and rating)
export const circuitEval = derived(circuitData, ($circuitData) => {
  let arr = []
  $circuitData.forEach(item => arr = [...arr,
    {
      circuit: item.circuit,
      userTime: convertTime(item.user),
      platinumDelta: item.user !== "" ? (convertTime(item.user) - convertTime(item.platinum)) / convertTime(item.platinum) : "",
      rating: item.user === "" || convertTime(item.user) > convertTime(item.silver) ? "Bronze"
              : convertTime(item.user) > convertTime(item.gold) ? "Silver"
              : convertTime(item.user) > convertTime(item.platinum) ? "Gold"
              : "Platinum"
      }
  ])
  return arr
})

// -- Overall driver rating and driver rank --
export const driverRating = derived(circuitEval, ($circuitEval) => {
  //Allocate points per rating at each circuit. Find average accross all circuits to find overall driver rating.
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
  let rank
  let maxScore = $circuitEval.length * 3
  let ranksIndex = Math.round(scoreTotal / (maxScore / userRanks.length))
  // If scoreTotal = 0, no rank (new user).
  rank = scoreTotal === 0 ? "" : userRanks[ranksIndex]
  return {
    rating: rating,
    rank: rank
  }
})

// -- User Title --
// If user has no rank, title = user name.
// Else, insert "rank" at end of name (single name) or before surname to create a userTitle
export const userTitle = derived([user, driverRating], ([$user, $driverRating]) => {
  let userTitle = ""
  const surnameRegex = /(\s+[\w-]+)$/g

  if (!$driverRating.rank) {
    userTitle = $user.name
  } else if (!surnameRegex.test($user.name)) {
    userTitle = `${$user.name} "${$driverRating.rank}"`
  } else {
    userTitle = $user.name.replace(surnameRegex, ` "${$driverRating.rank}" ${$user.name.match(surnameRegex)}`)
  }
  return userTitle
})
