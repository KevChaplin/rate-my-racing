import { writable } from 'svelte/store'

export const name = writable('Kevin Chaplin')
export const nationality = writable('British')

export const inputArr = writable([
])

export const testTimeData = writable([
  {
    circuit: "Imola",
    time: "1:59.233"
  },
  {
    circuit: "Monaco",
    time: "1:48.102"
  }
])

export const inputArr = writable([

])

export const circuitData = writable([
  {
    id: 1,
    circuit: "Barcelona",
    location: "SPA",
    platinum: "1:44.500",
    gold: "1:45.900",
    silver: "1:47.900",
    user: "1:45.249"
  },
  {
    id: 2,
    circuit: "Bathurst",
    location: "AUS",
    platinum: "2:02.500",
    gold: "2:03.900",
    silver: "2:05.900",
    user: "2:04.288"
  },
  {
    id: 3,
    circuit: "Brands Hatch",
    location: "GBR",
    platinum: "1:24.000",
    gold: "1:25.400",
    silver: "1:26.900",
    user: "1:24.911"
  },
  {
    id: 4,
    circuit: "Hungaroring",
    location: "HUN",
    platinum: "1:44.500",
    gold: "1:45.900",
    silver: "1:47.400",
    user: "1:46.272"
  },
  {
    id: 5,
    circuit: "Kyalami",
    location: "ZAF",
    platinum: "1:42.000",
    gold: "1:43.400",
    silver: "1:45.400",
    user: "1:44.041"
  },
  {
    id: 6,
    circuit: "Laguna Seca",
    location: "USA",
    platinum: "1:23.500",
    gold: "1:24.900",
    silver: "1:26.400",
    user: "1:23.815"
  },
  {
    id: 7,
    circuit: "Misano",
    location: "ITA",
    platinum: "1:34.500",
    gold: "1:35.900",
    silver: "1:37.400",
    user: "1:35.913"
  },
  {
    id: 8,
    circuit: "Monza",
    location: "ITA",
    platinum: "1:48.500",
    gold: "1:49.900",
    silver: "1:51.900",
    user: "1:48.648"
  },
  {
    id: 9,
    circuit: "Nurburgring",
    location: "GER",
    platinum: "1:55.000",
    gold: "1:56.400",
    silver: "1:57.900",
    user: "1:55.688"
  },
  {
    id: 10,
    circuit: "Paul Ricard",
    location: "FRA",
    platinum: "1:55.000",
    gold: "1:56.400",
    silver: "1:58.400",
    user: "0:00.000"
  },
  {
    id: 11,
    circuit: "Silverstone",
    location: "GBR",
    platinum: "1:59.500",
    gold: "2:00.900",
    silver: "2:02.400",
    user: "1:59.713"
  },
  {
    id: 12,
    circuit: "Spa",
    location: "BEL",
    platinum: "2:19.500",
    gold: "2:20.900",
    silver: "2:22.900",
    user: "2:20.415"
  },
  {
    id: 13,
    circuit: "Suzuka",
    location: "JPN",
    platinum: "2:01.000",
    gold: "2:02.400",
    silver: "2:04.400",
    user: "2:03.451"
  },
  {
    id: 14,
    circuit: "Zandvoort",
    location: "NLD",
    platinum: "1:36.000",
    gold: "1:37.400",
    silver: "1:38.900",
    user: "1:36.759"
  },
  {
    id: 15,
    circuit: "Zolder",
    location: "BEL",
    platinum: "1:29.000",
    gold: "1:30.400",
    silver: "1:31.900",
    user: "1:29.332"
  },
])
