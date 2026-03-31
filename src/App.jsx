import React, { useState, Suspense } from 'react';
import SolarSystem from './components/SolarSystem';
import Overlay from './components/Overlay';

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden font-sans">
        <SolarSystem 
          selectedPlanet={selectedPlanet} 
          setSelectedPlanet={setSelectedPlanet} 
        />
        <Overlay 
          selectedPlanet={selectedPlanet} 
          setSelectedPlanet={setSelectedPlanet} 
        />
    </div>
  );
}

export default App;
