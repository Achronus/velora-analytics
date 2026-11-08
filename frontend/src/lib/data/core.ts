import type { MissionsData } from "../types"

export const MISSIONS: MissionsData[] = [
  {
    id: "MI-01",
    name: "Collision avoidance",
    tagline: "sc01 avoiding tracked debris · CW layer · health models",
    tag: "active",
    active: true,
    stats: "5 campaigns · 5,912 runs · last 77.8%",
    vehicles: "sc01 · debris_03",
    dashboardCount: 8,
    description:
      "180 kg smallsat avoiding tracked debris · MuJoCo + CW orbital layer · thermal, structure and propulsion health models",
  },
  {
    id: "MI-02",
    name: "Rendezvous and docking",
    tagline: "Nanosat module docking · latch loads",
    tag: "spec only",
    active: false,
    stats: "no runs yet",
    vehicles: "mod-a ↔ mod-b · nanosat blocks",
    dashboardCount: 2,
  },
  {
    id: "MI-03",
    name: "Capture and detumble",
    tagline: "Servicer + 7-DOF arm · tumbling upper stage",
    tag: "early",
    active: false,
    stats: "1 campaign · 48 runs · last early",
    vehicles: "sweeper-1 · upper stage",
    dashboardCount: 1,
  },
  {
    id: "MI-04",
    name: "Low-gravity landing",
    tagline: "Powered descent on an irregular body",
    tag: "spec only",
    active: false,
    stats: "no runs yet",
    vehicles: "hopper-1 · asteroid",
    dashboardCount: 1,
  },
]
