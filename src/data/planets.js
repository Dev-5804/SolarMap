export const PLANET_CONSTANTS = {
  SCALE_DISTANCE: 80, // Linear scale multiplier for real AU (1 AU = 80 units)
  SCALE_SIZE: 0.2, // Earth is 0.2 units.
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
    radiusEarths: 0.38,
    orbitalPeriod: 0.24,
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
    radiusEarths: 0.95,
    orbitalPeriod: 0.62,
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
    distanceAU: 1.0,
    radiusEarths: 1.0,
    orbitalPeriod: 1.0,
    facts: {
      distanceFromSun: "149.6 million km (1.00 AU)",
      orbitalPeriod: "365.25 Earth days",
      surfaceTemp: "15°C (Average)",
      moons: 1,
      description: "Our home planet is the third planet from the Sun, and the only place we know of so far that's inhabited by living things. It's also the only planet in our solar system with liquid water on the surface."
    }
  },
  {
    id: "mars",
    name: "Mars",
    type: "Terrestrial Planet",
    textureUrl: "/models/mars.glb",
    distanceAU: 1.52,
    radiusEarths: 0.53,
    orbitalPeriod: 1.88,
    facts: {
      distanceFromSun: "227.9 million km (1.52 AU)",
      orbitalPeriod: "687 Earth days",
      surfaceTemp: "-60°C (Average)",
      moons: 2,
      description: "Mars is the fourth planet from the Sun – a dusty, cold, desert world with a very thin atmosphere. Mars is also a dynamic planet with seasons, polar ice caps, canyons, extinct volcanoes."
    }
  },
  {
    id: "jupiter",
    name: "Gas Giant",
    type: "Gas Giant",
    textureUrl: "/models/jupiter.glb",
    distanceAU: 5.2,
    radiusEarths: 11.2, // Jupiter is ~11.2 times Earth's radius
    orbitalPeriod: 11.86,
    facts: {
      distanceFromSun: "778.6 million km (5.2 AU)",
      orbitalPeriod: "11.86 Earth years",
      surfaceTemp: "-110°C (Average)",
      moons: 95,
      description: "Jupiter has a long history of surprising scientists—all the way back to 1610 when Galileo Galilei found the first moons beyond Earth. That discovery changed the way we see the universe."
    }
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "Gas Giant",
    textureUrl: "/models/saturn.glb",
    distanceAU: 9.58,
    radiusEarths: 9.4, 
    orbitalPeriod: 29.46,
    facts: {
      distanceFromSun: "1.43 billion km (9.58 AU)",
      orbitalPeriod: "29.45 Earth years",
      surfaceTemp: "-140°C (Average)",
      moons: 146,
      description: "Saturn is the sixth planet from the Sun and the second-largest planet in our solar system. Adorned with a dazzling, complex system of icy rings, Saturn is unique among the planets."
    }
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "Ice Giant",
    textureUrl: "/models/uranus.glb",
    distanceAU: 19.22,
    radiusEarths: 4.0,
    orbitalPeriod: 84.01,
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
    distanceAU: 30.05,
    radiusEarths: 3.9,
    orbitalPeriod: 164.8,
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
  facts: {
    description: "The Sun is a yellow dwarf star, a hot ball of glowing gases at the heart of our solar system. Its gravity holds the solar system together, keeping everything built around it in its orbit.",
    surfaceTemp: "5,500°C",
    age: "4.6 Billion Years"
  }
};
