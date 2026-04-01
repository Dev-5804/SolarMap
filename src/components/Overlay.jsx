import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, Thermometer, Orbit, Moon, Clock } from 'lucide-react';
import { planetsData, sunData } from '../data/planets';

// Recursively inject all Moons chronologically exactly where they physically belong 
// in the Solar System Tour Sequence!
const allBodies = [
  ...[sunData], 
  ...planetsData.flatMap(p => [p, ...(p.moons || [])])
];

export default function Overlay({ selectedPlanet, setSelectedPlanet }) {
  const handleNav = (direction) => {
    if (!selectedPlanet) return;
    const currentIndex = allBodies.findIndex(b => b.id === selectedPlanet.id);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = allBodies.length - 1;
    if (nextIndex >= allBodies.length) nextIndex = 0;
    setSelectedPlanet(allBodies[nextIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPlanet) return;
      if (e.key === 'ArrowRight') handleNav(1);
      if (e.key === 'ArrowLeft') handleNav(-1);
      if (e.key === 'Escape') setSelectedPlanet(null);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPlanet]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex text-white font-sans">
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="pointer-events-auto absolute right-0 top-0 bottom-0 w-full md:w-[450px] bg-black/40 backdrop-blur-xl border-l border-white/10 p-8 flex flex-col items-start justify-start overflow-y-auto"
          >
            <div className="flex items-center justify-between w-full mb-8">
              <button 
                onClick={() => setSelectedPlanet(null)}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group bg-white/5 rounded-full px-4 py-2 hover:bg-white/10"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleNav(-1)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
                  title="Previous Planet (Left Arrow)"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => handleNav(1)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
                  title="Next Planet (Right Arrow)"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-2 tracking-tight">{selectedPlanet.name}</h1>
            <p className="text-xl text-blue-300 font-medium mb-8 pb-4 border-b border-white/10 w-full uppercase tracking-wider">
              {selectedPlanet.type}
            </p>

            <div className="space-y-6 w-full mb-8">
              <p className="text-lg text-white/80 leading-relaxed font-light">
                {selectedPlanet.facts.description}
              </p>
            </div>

            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Quick Facts</h3>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              {selectedPlanet.facts.distanceFromSun && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-white/50 mb-2">
                    <Orbit size={16} />
                    <span className="text-xs font-semibold uppercase">Distance</span>
                  </div>
                  <div className="font-medium">{selectedPlanet.facts.distanceFromSun}</div>
                </div>
              )}
              
              {selectedPlanet.facts.orbitalPeriod && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-white/50 mb-2">
                    <Info size={16} />
                    <span className="text-xs font-semibold uppercase">Orbit</span>
                  </div>
                  <div className="font-medium">{selectedPlanet.facts.orbitalPeriod}</div>
                </div>
              )}

              {selectedPlanet.facts.surfaceTemp && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-white/50 mb-2">
                    <Thermometer size={16} />
                    <span className="text-xs font-semibold uppercase">Temp</span>
                  </div>
                  <div className="font-medium">{selectedPlanet.facts.surfaceTemp}</div>
                </div>
              )}

              {selectedPlanet.facts.moons !== undefined && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-white/50 mb-2">
                    <Moon size={16} />
                    <span className="text-xs font-semibold uppercase">Moons</span>
                  </div>
                  <div className="font-medium">{selectedPlanet.facts.moons}</div>
                </div>
              )}

              {selectedPlanet.facts.age && (
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-white/50 mb-2">
                    <Clock size={16} />
                    <span className="text-xs font-semibold uppercase">Age</span>
                  </div>
                  <div className="font-medium">{selectedPlanet.facts.age}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!selectedPlanet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="pointer-events-auto absolute top-8 left-8"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white mb-1">SolarMap</h1>
            <p className="text-white/50 font-medium">Explore the neighborhood</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
