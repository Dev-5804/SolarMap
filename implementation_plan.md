# SolarMap 3D Website implementation

This plan outlines the approach to building the interactive 3D SolarMap website using your React and Tailwind CSS scaffolding, along with `@react-three/fiber` and `@react-three/drei`.

## User Review Required

- **Scale Considerations:** True realistic scaling of planet sizes vs. their distances is impossible to visualize pleasantly on screen (the sun would be huge, and planets microscopic specs thousands of pixels away). To make this an interactive "map", I will use a **scaled-down semi-realistic approach**. Distance will be spread out enough to distinguish orbits, and sizes will be adjusted so all planets are visible, while maintaining relative concepts (Jupiter > Earth > Mercury).
- **Orbit Speeds:** Speeds will be relative to their actual orbital periods (e.g., Mercury orbits much faster than Neptune). Real orbital speeds will be scaled up so that users can actually see movement.
- **Dependencies:** I will need to install `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion` (for smooth UI transitions), and `lucide-react` (for icons like the back button). I assume adding these is fine.

## Proposed Changes

### Setup and Dependencies
- Run `npm install three @react-three/fiber @react-three/drei framer-motion lucide-react` to get everything necessary for 3D and smooth UI animations.

### 1. Global State & App Structure
- Modify `App.jsx` to maintain a state for the `selectedPlanet` (`null` by default).
- The root structure will consist of a 3D Canvas layer (`<Canvas>`) stretching across the full screen, and an HTML Overlay layer above it holding the UI panels.

#### [MODIFY] src/App.jsx
#### [NEW] src/components/Overlay.jsx
#### [NEW] src/components/SolarSystem.jsx
#### [NEW] src/data/planets.js

### 2. 3D Scene (SolarSystem)
- Incorporate a dark starry background (possibly using `<Stars>` from `drei` or a dark background color).
- Set up a central `<pointLight>` originating from the Sun to illuminate the planets appropriately, and a faint `<ambientLight>` so the dark sides aren't entirely pitch black.

### 3. Celestial Bodies
- **Sun Component**: Loads `sun.glb`. Centered at `[0, 0, 0]`. It will slowly rotate on its axis.
- **Planet Component**: Uses `useGLTF` to load planets dynamically.
  - Position calculated using basic trigonometry (`Math.sin`, `Math.cos`) factoring in elapsed time and orbit speed.
  - Generates visible orbit rings using `<line>` or `drei`'s `<Line>` or `<Torus>` to show paths.
  - Adding `onClick` handlers: Notifies the app state when a planet is clicked.

### 4. Camera Transitions (CameraRig)
- Implement a custom `CameraRig` component inside the Canvas.
- **Zoomed Out (Default)**: Overviews the solar system with `OrbitControls`.
- **Zoomed In (Selected Planet)**: Utilizing `drei`'s `CameraControls` or a custom `useFrame` lerp, perfectly position the camera so the planet occupies the **left half** of the screen. We will do this by positioning the camera relatively close to the planet and shifting its look-at target slightly to the right of the planet.

### 5. UI Overlay
- HTML Overlay overlaying the screen (`pointer-events-none` for the container, `pointer-events-auto` for interactive elements).
- When a planet is clicked:
  - An informational panel slides in from the right edge with `framer-motion`, showing: Name, Type, Distance from Sun, Orbital Period, and Fun Facts.
  - A prominent "Back to Map" button appears to unselect the planet and trigger the camera to zoom back out.

## Open Questions
- Do you want a starry sky background included (via `@react-three/drei`), or just a pitch-black void? I assume a starry sky is preferred for aesthetics.
- Is there any specific aesthetic or font preference for the UI overlay? I will use Tailwind utilities and a premium glassmorphic dark-theme look by default.

## Verification Plan

### Automated/Manual Verification
- Once built, I will run the dev server (`npm run dev`) and test using the browser tool to:
  1. Ensure the models load correctly without 404s.
  2. Verify that clicking a planet smoothly zooms in.
  3. Ensure the right-side informational UI displays accurate planet data.
  4. Ensure orbiting and rotating mechanisms function properly using `useFrame`.
