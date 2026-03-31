import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, useGLTF, Line, CameraControls, Clone } from '@react-three/drei';
import * as THREE from 'three';
import { planetsData, sunData } from '../data/planets';

// Removed preloads to stop memory spikes crashing WebGL context on load

// Helper to fix unknown user GLTF scales
function useNormalizedScene(textureUrl, desiredSize) {
  const { scene } = useGLTF(textureUrl);
  
  const normalizedScene = useMemo(() => {
    const cloned = scene.clone();
    
    // Calculate bounding box of the raw GLTF
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    // Find the largest dimension the object occupies natively
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Create a scale factor rendering it exactly `desiredSize` units large mathematically
    if (maxDim > 0) {
      const scaleFactor = desiredSize / maxDim;
      cloned.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
    
    // Recenter the model inside its own group to fix broken origins from Blender
    const center = new THREE.Vector3();
    box.getCenter(center);
    cloned.position.set(-center.x * (desiredSize / maxDim), -center.y * (desiredSize / maxDim), -center.z * (desiredSize / maxDim));
    
    return cloned;
  }, [scene, desiredSize]);

  return normalizedScene;
}

function Sun() {
  const normalizedScene = useNormalizedScene(sunData.textureUrl, sunData.size * 2);
  const meshRef = useRef();
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += sunData.rotationSpeed * delta * 60;
    }
  });
  
  return (
    <group ref={meshRef} position={[0,0,0]}>
      <primitive object={normalizedScene} />
    </group>
  );
}

function Planet({ data, isSelected, onClick, planetRefs }) {
  const normalizedScene = useNormalizedScene(data.textureUrl, data.size * 2);
  const groupRef = useRef();
  const innerPlanetRef = useRef();
  const angleRef = useRef(Math.random() * Math.PI * 2);

  // Expose position to the parent for camera tracking
  useEffect(() => {
    planetRefs.current[data.id] = groupRef;
  }, [data.id, planetRefs]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      if (innerPlanetRef.current) {
        innerPlanetRef.current.rotation.y += data.rotationSpeed * delta * 60;
      }
      
      // Stop orbit while selected to let camera focus easily
      if (!isSelected) {
        angleRef.current -= data.orbitSpeed * delta * 10;
      }
      
      groupRef.current.position.set(
        Math.cos(angleRef.current) * data.distance,
        0,
        Math.sin(angleRef.current) * data.distance
      );
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * data.distance, 0, Math.sin(angle) * data.distance));
    }
    return pts;
  }, [data.distance]);

  return (
    <group>
      <group ref={groupRef}>
        {/* Interaction hit box tracking identical group */}
        <mesh 
          onClick={(e) => { e.stopPropagation(); onClick(data); }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
          visible={false}
        >
          <sphereGeometry args={[data.size * 2.5, 16, 16]} />
          <meshBasicMaterial />
        </mesh>

        <group ref={innerPlanetRef}>
          <primitive object={normalizedScene} />
        </group>
      </group>
      
      <Line 
        points={points}
        color="white"
        opacity={isSelected ? 0.5 : 0.15}
        lineWidth={1.5}
        transparent
      />
    </group>
  );
}

function SceneControls({ selectedPlanet, planetRefs }) {
  const controlsRef = useRef();

  const cameraOffset = useMemo(() => new THREE.Vector3(), []);
  const targetOffset = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (controlsRef.current && selectedPlanet && planetRefs.current[selectedPlanet.id]?.current) {
      const p = planetRefs.current[selectedPlanet.id].current;
      const size = selectedPlanet.size;
      
      // Position the camera slightly right to keep planet on the left of screen
      cameraOffset.set(size * 4, size * 1.5, size * 4);
      targetOffset.set(size * 2, 0, 0);
      
      controlsRef.current.setLookAt(
        p.x + cameraOffset.x, p.y + cameraOffset.y, p.z + cameraOffset.z,
        p.x + targetOffset.x, p.y + targetOffset.y, p.z + targetOffset.z,
        true
      );
    }
  });

  useEffect(() => {
    if (!selectedPlanet && controlsRef.current) {
      // Zoom back out smoothly to the newly expanded solar system overview
      controlsRef.current.setLookAt(0, 80, 160, 0, 0, 0, true);
    }
  }, [selectedPlanet]);

  return (
    <CameraControls 
      ref={controlsRef}
      maxDistance={250}
      minDistance={2}
      smoothTime={0.8}
      azimuthRotateSpeed={selectedPlanet ? 0 : 1}
      polarRotateSpeed={selectedPlanet ? 0 : 1}
      dollySpeed={selectedPlanet ? 0 : 1}
    />
  );
}

export default function SolarSystem({ selectedPlanet, setSelectedPlanet }) {
  const planetRefs = useRef({});

  return (
    <Canvas camera={{ position: [0, 80, 160], fov: 45 }} className="w-full h-full">
      <color attach="background" args={['#03050a']} />
      <ambientLight intensity={2.0} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={1000} color="#fffdf5" distance={500} decay={1} />
      
      <Stars radius={150} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
      
      <Suspense fallback={null}>
        <Sun />
        
        {planetsData.map((data) => (
          <Planet 
            key={data.id} 
            data={data} 
            isSelected={selectedPlanet?.id === data.id}
            onClick={setSelectedPlanet}
            planetRefs={planetRefs}
          />
        ))}
      </Suspense>
      
      <SceneControls selectedPlanet={selectedPlanet} planetRefs={planetRefs} />
    </Canvas>
  );
}
