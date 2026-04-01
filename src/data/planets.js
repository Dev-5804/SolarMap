export const PLANET_CONSTANTS = {
  SCALE_DISTANCE: 80, // Linear scale multiplier for real AU (1 AU = 80 units)
  SCALE_SIZE: 0.2, // Earth is 0.2 units.
  SCALE_MOON_DISTANCE: 0.1, // Visual scalar multiplier to decouple Moon orbits from raw planetary AU physics
  TIME_SCALE: 3155760, // 10 seconds = 1 Earth year => 31557600s / 10
  SUN_RADIUS_EARTHS: 109.2, // The Sun is exactly 109.2 times Earth's radius
};

export const planetsData = [
  {
    id: "mercury",
    name: "Mercury",
    type: "Terrestrial Planet",
    textureUrl: "/models/mercury.glb",
    distanceAU: 0.39,
    orbitalPeriod: 0.24, // 88 Earth days converted safely into Earth-Years for mathematical continuity
    radiusEarths: 0.38,
    rotationPeriodHours: 1408, // 58.6 Earth days
    facts: {
      distanceFromSun: "57.9 million km (0.39 AU)",
      orbitalPeriod: "88 Earth days",
      surfaceTemp: "-173°C to 427°C",
      moons: 0,
      description: "The smallest planet in our solar system and closest to the Sun—is only slightly larger than Earth's Moon. Mercury is the fastest planet, zipping around the Sun every 88 Earth days."
    }
  },
  {
    id: "venus",
    name: "Venus",
    type: "Terrestrial Planet",
    textureUrl: "/models/venus.glb",
    distanceAU: 0.72,
    orbitalPeriod: 0.615, // 225 Earth days converted safely into Earth-Years 
    radiusEarths: 0.95,
    rotationPeriodHours: -5832, // -243 Earth days (retrograde) rotation
    facts: {
      distanceFromSun: "108.2 million km (0.72 AU)",
      orbitalPeriod: "225 Earth days",
      surfaceTemp: "462°C (Average)",
      moons: 0,
      description: "Venus is the second planet from the Sun and is Earth's closest planetary neighbor. It's one of the four inner, terrestrial planets, and it's often called Earth's twin because it's similar in size and density."
    }
  },
  {
    id: "earth",
    name: "Earth",
    type: "Terrestrial Planet",
    textureUrl: "/models/earth.glb",
    textureUrl: "/models/earth.glb",
    distanceAU: 1.0,
    radiusEarths: 1.0,
    orbitalPeriod: 1.0,
    rotationPeriodHours: 23.9,
    facts: {
      distanceFromSun: "149.6 million km (1.00 AU)",
      orbitalPeriod: "365.25 Earth days",
      surfaceTemp: "15°C (Average)",
      moons: 1,
      description: "Our home planet is the third planet from the Sun, and the only place we know of so far that's inhabited by living things. It's also the only planet in our solar system with liquid water on the surface."
    },
    moons: [
      {
        id: "luna",
        name: "The Moon",
        type: "Natural Satellite",
        textureUrl: "/models/moons/Luna.glb",
        radiusEarths: 0.27,
        distanceBaseRadii: 3,
        orbitalPeriodDays: 27.3,
        rotationPeriodHours: 655.7,
        facts: {
          distanceFromSun: "149.6 million km (1.00 AU)",
          orbitalPeriod: "27.3 Earth days",
          surfaceTemp: "-173°C to 127°C",
          description: "Earth's only natural satellite is simply called the Moon because people didn't know other moons existed until Galileo Galilei discovered four moons orbiting Jupiter in 1610."
        }
      }
    ]
  },
  {
    id: "mars",
    name: "Mars",
    type: "Terrestrial Planet",
    textureUrl: "/models/mars.glb",
    textureUrl: "/models/mars.glb",
    distanceAU: 1.52,
    radiusEarths: 0.53,
    orbitalPeriod: 1.88,
    rotationPeriodHours: 24.6,
    facts: {
      distanceFromSun: "227.9 million km (1.52 AU)",
      orbitalPeriod: "687 Earth days",
      surfaceTemp: "-60°C (Average)",
      moons: 2,
      description: "Mars is the fourth planet from the Sun – a dusty, cold, desert world with a very thin atmosphere. Mars is also a dynamic planet with seasons, polar ice caps, canyons, extinct volcanoes."
    },
    moons: [
      {
        id: "phobos",
        name: "Phobos",
        type: "Martian Moon",
        textureUrl: "/models/moons/Phobos.glb",
        radiusEarths: 0.08, // Scaled visually (real is much smaller)
        distanceBaseRadii: 1.8,
        orbitalPeriodDays: 0.3,
        rotationPeriodHours: 7.6,
        facts: {
          orbitalPeriod: "8 Hours",
          description: "Phobos is the larger and inner of the two natural satellites of Mars, speeding completely around the planet 3 times every Martian day."
        }
      },
      {
        id: "deimos",
        name: "Deimos",
        type: "Martian Moon",
        textureUrl: "/models/moons/Deimos.glb",
        radiusEarths: 0.04,
        distanceBaseRadii: 3,
        orbitalPeriodDays: 1.2,
        rotationPeriodHours: 30.3,
        facts: {
          orbitalPeriod: "30 Hours",
          description: "Deimos is the smaller and outermost of the two natural satellites of Mars. It is lumpy, heavily cratered, and irregularly shaped."
        }
      }
    ]
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "Gas Giant",
    textureUrl: "/models/jupiter.glb",
    textureUrl: "/models/jupiter.glb",
    distanceAU: 5.2,
    radiusEarths: 11.2, // Jupiter is ~11.2 times Earth's radius
    orbitalPeriod: 11.86,
    rotationPeriodHours: 9.9,
    facts: {
      distanceFromSun: "778.6 million km (5.2 AU)",
      orbitalPeriod: "11.86 Earth years",
      surfaceTemp: "-110°C (Average)",
      moons: 95,
      description: "Jupiter has a long history of surprising scientists—all the way back to 1610 when Galileo Galilei found the first moons beyond Earth. That discovery changed the way we see the universe."
    },
    moons: [
      { id: "io", name: "Io", type: "Galilean Moon", textureUrl: "/models/moons/Io.glb", radiusEarths: 0.28, distanceBaseRadii: 1.5, orbitalPeriodDays: 1.7, rotationPeriodHours: 42, facts: { orbitalPeriod: "1.7 Days", description: "The most volcanically active world in the solar system." } },
      { id: "europa", name: "Europa", type: "Galilean Moon", textureUrl: "/models/moons/Europa_1_3138.glb", radiusEarths: 0.24, distanceBaseRadii: 2.2, orbitalPeriodDays: 3.5, rotationPeriodHours: 85, facts: { orbitalPeriod: "3.5 Days", description: "Europa is thought to have an iron core, a rocky mantle, and an ocean of salty water underneath its ice crust." } },
      { id: "ganymede", name: "Ganymede", type: "Galilean Moon", textureUrl: "/models/moons/Ganymede.glb", radiusEarths: 0.41, distanceBaseRadii: 3.5, orbitalPeriodDays: 7.1, rotationPeriodHours: 171, facts: { orbitalPeriod: "7.1 Days", description: "The largest moon in our solar system, Ganymede is bigger than the planet Mercury." } },
      { id: "callisto", name: "Callisto", type: "Galilean Moon", textureUrl: "/models/moons/Callisto.glb", radiusEarths: 0.37, distanceBaseRadii: 5.0, orbitalPeriodDays: 16.6, rotationPeriodHours: 400, facts: { orbitalPeriod: "16.6 Days", description: "Callisto is a dead, heavily cratered icy rock with apparently no geologic activity." } },
    ]
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "Gas Giant",
    textureUrl: "/models/saturn.glb",
    textureUrl: "/models/saturn.glb",
    distanceAU: 9.58,
    radiusEarths: 9.4, 
    orbitalPeriod: 29.46,
    rotationPeriodHours: 10.7,
    facts: {
      distanceFromSun: "1.43 billion km (9.58 AU)",
      orbitalPeriod: "29.45 Earth years",
      surfaceTemp: "-140°C (Average)",
      moons: 146,
      description: "Saturn is the sixth planet from the Sun and the second-largest planet in our solar system. Adorned with a dazzling, complex system of icy rings, Saturn is unique among the planets."
    },
    moons: [
      { id: "titan", name: "Titan", type: "Saturnian Moon", textureUrl: "/models/moons/Titan.glb", radiusEarths: 0.40, distanceBaseRadii: 2.5, orbitalPeriodDays: 15.9, rotationPeriodHours: 382, facts: { orbitalPeriod: "15.9 Days", description: "Titan is the only moon in our solar system that has clouds and a dense atmosphere." } }
    ]
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "Ice Giant",
    textureUrl: "/models/uranus.glb",
    textureUrl: "/models/uranus.glb",
    distanceAU: 19.22,
    radiusEarths: 4.0,
    orbitalPeriod: 84.01,
    rotationPeriodHours: -17.2, // Retrograde
    facts: {
      distanceFromSun: "2.87 billion km (19.22 AU)",
      orbitalPeriod: "84 Earth years",
      surfaceTemp: "-195°C (Average)",
      moons: 28,
      description: "Uranus is the seventh planet from the Sun, and has the third-largest diameter in our solar system. It was the first planet found with the aid of a telescope and rotates on its side."
    }
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "Ice Giant",
    textureUrl: "/models/neptune.glb",
    textureUrl: "/models/neptune.glb",
    distanceAU: 30.05,
    radiusEarths: 3.9,
    orbitalPeriod: 164.8,
    rotationPeriodHours: 16.1,
    facts: {
      distanceFromSun: "4.50 billion km (30.05 AU)",
      orbitalPeriod: "164.8 Earth years",
      surfaceTemp: "-200°C (Average)",
      moons: 16,
      description: "Dark, cold, and whipped by supersonic winds, ice giant Neptune is the eighth and most distant planet in our solar system. Neptune is the only planet in our solar system not visible to the naked eye."
    }
  }
];

export const sunData = {
  id: "sun",
  name: "The Sun",
  type: "Yellow Dwarf Star",
  textureUrl: "/models/sun.glb",
  rotationPeriodHours: 609.12, // 25 Earth days at equator
  radiusEarths: 109.2,
  facts: {
    description: "The Sun is a yellow dwarf star, a hot ball of glowing gases at the heart of our solar system. Its gravity holds the solar system together, keeping everything built around it in its orbit.",
    surfaceTemp: "5,500°C",
    age: "4.6 Billion Years"
  }
};
