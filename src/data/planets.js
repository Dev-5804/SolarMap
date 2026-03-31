export const planetsData = [
  {
    id: "mercury",
    name: "Mercury",
    type: "Terrestrial Planet",
    textureUrl: "/models/mercury.glb",
    distance: 12, // Safely outside the sun'
    size: 0.8, // Visual model scale
    orbitSpeed: 0.04, // Speed of revolution
    rotationSpeed: 0.01, // Speed of rotation
    facts: {
      distanceFromSun: "57.9 million km",
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
    distance: 18,
    size: 1.2,
    orbitSpeed: 0.015,
    rotationSpeed: -0.005, // Venus rotates backwards
    facts: {
      distanceFromSun: "108.2 million km",
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
    distance: 25,
    size: 1.3,
    orbitSpeed: 0.01,
    rotationSpeed: 0.02,
    facts: {
      distanceFromSun: "149.6 million km",
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
    distance: 32,
    size: 0.9,
    orbitSpeed: 0.008,
    rotationSpeed: 0.018,
    facts: {
      distanceFromSun: "227.9 million km",
      orbitalPeriod: "687 Earth days",
      surfaceTemp: "-60°C (Average)",
      moons: 2,
      description: "Mars is the fourth planet from the Sun – a dusty, cold, desert world with a very thin atmosphere. Mars is also a dynamic planet with seasons, polar ice caps, canyons, extinct volcanoes."
    }
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "Gas Giant",
    textureUrl: "/models/jupiter.glb",
    distance: 46,
    size: 3.5,
    orbitSpeed: 0.002,
    rotationSpeed: 0.04,
    facts: {
      distanceFromSun: "778.6 million km",
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
    distance: 60,
    size: 3.0,
    orbitSpeed: 0.0009,
    rotationSpeed: 0.038,
    facts: {
      distanceFromSun: "1.43 billion km",
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
    distance: 74,
    size: 2.2,
    orbitSpeed: 0.0004,
    rotationSpeed: -0.03, // Retrograde
    facts: {
      distanceFromSun: "2.87 billion km",
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
    distance: 88,
    size: 2.1,
    orbitSpeed: 0.0001,
    rotationSpeed: 0.032,
    facts: {
      distanceFromSun: "4.50 billion km",
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
  size: 5,
  rotationSpeed: 0.005,
  facts: {
    description: "The Sun is a yellow dwarf star, a hot ball of glowing gases at the heart of our solar system. Its gravity holds the solar system together, keeping everything built around it in its orbit.",
    surfaceTemp: "5,500°C",
    age: "4.6 Billion Years"
  }
};
