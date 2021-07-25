import { writable } from 'svelte/store'

export const name = writable('Kevin Chaplin')
export const nationality = writable('British')
export const rank = writable('Plz no Punterino')

export const testTimeData = writable({
  time: "1:59.233"
})

export const circuitData = writable([
  {
    id: 1,
    circuit: "Barcelona",
    location: "SPA",
    platinum: 104500,
    gold: 105900,
    silver: 107900,
    user: null
  },
  {
    id: 2,
    circuit: "Bathurst",
    location: "AUS",
    platinum: 122500,
    gold: 123900,
    silver: 125900,
    user: null
  },
  {
    id: 3,
    circuit: "Brands Hatch",
    location: "GBR",
    platinum: 84000,
    gold: 85400,
    silver: 86900,
    user: null
  },
  {
    id: 4,
    circuit: "Hungaroring",
    location: "HUN",
    platinum: 104500,
    gold: 105900,
    silver: 107400,
    user: null
  },
  {
    id: 5,
    circuit: "Kyalami",
    location: "ZAF",
    platinum: 102000,
    gold: 103400,
    silver: 105400,
    user: null
  },
  {
    id: 6,
    circuit: "Laguna Seca",
    location: "USA",
    platinum: 83500,
    gold: 84900,
    silver: 86400,
    user: null
  },
  {
    id: 7,
    circuit: "Misano",
    location: "ITA",
    platinum: 94500,
    gold: 95900,
    silver: 97400,
    user: null
  },
  {
    id: 8,
    circuit: "Monza",
    location: "ITA",
    platinum: 108500,
    gold: 109900,
    silver: 111900,
    user: null
  },
  {
    id: 9,
    circuit: "Nurburgring",
    location: "GER",
    platinum: 115000,
    gold: 116400,
    silver: 117900,
    user: null
  },
  {
    id: 10,
    circuit: "Paul Ricard",
    location: "FRA",
    platinum: 115000,
    gold: 116400,
    silver: 118400,
    user: null
  },
  {
    id: 11,
    circuit: "Silverstone",
    location: "GBR",
    platinum: 119500,
    gold: 120900,
    silver: 122400,
    user: null
  },
  {
    id: 12,
    circuit: "Spa",
    location: "BEL",
    platinum: 119500,
    gold: 120900,
    silver: 122400,
    user: null
  },
  {
    id: 13,
    circuit: "Suzuka",
    location: "JPN",
    platinum: 121000,
    gold: 122400,
    silver: 124400,
    user: null
  },
  {
    id: 14,
    circuit: "Zandvoort",
    location: "NLD",
    platinum: 96000,
    gold: 97400,
    silver: 98900,
    user: null
  },
  {
    id: 15,
    circuit: "Zolder",
    location: "BEL",
    platinum: 89000,
    gold: 90400,
    silver: 91900,
    user: null
  },
])
