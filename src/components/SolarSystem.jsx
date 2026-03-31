import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, useGLTF, Line, CameraControls, Clone } from '@react-three/drei';
import * as THREE from 'three';
import { planetsData, sunData, PLANET_CONSTANTS } from '../data/planets';

// Helper to fix unknown user GLTF scales
function useNormalizedScene(textureUrl, desiredSize) {
  const { scene } = useGLTF(textureUrl);
  
  const normalizedScene = useMemo(() => {
    const cloned = scene.clone();
    
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    const maxDim = Math.max(size.x, size.y, size.z);
    
    if (maxDim > 0) {
      const scaleFactor = desiredSize / maxDim;
      cloned.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
    
    const center = new THREE.Vector3();
    box.getCenter(center);
    cloned.position.set(-center.x * (desiredSize / maxDim), -center.y * (desiredSize / maxDim), -center.z * (desiredSize / maxDim));
    
    return cloned;
  }, [scene, desiredSize]);

  return normalizedScene;
}

function Sun() {
  const physicalSize = PLANET_CONSTANTS.SUN_RADIUS_EARTHS * PLANET_CONSTANTS.SCALE_SIZE;
  const normalizedScene = useNormalizedScene(sunData.textureUrl, physicalSize * 2);
  const meshRef = useRef();
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      // Arbitrary smooth rotation for sun
      meshRef.current.rotation.y += delta * 0.1;
    }
  });
  
  return (
    <group ref={meshRef} position={[0,0,0]}>
      {/* 
        A glowing fallback sphere is strictly necessary. 
        Because our core PointLight originates at [0,0,0] INSIDE the Sun, 
        standard GLTF physical materials render their outside crust as pitch black. 
      */}
      <mesh>
        <sphereGeometry args={[physicalSize, 64, 64]} />
        <meshBasicMaterial color="#ffdd55" />
      </mesh>
      <primitive object={normalizedScene} />
    </group>
  );
}

function Planet({ data, isSelected, onClick, planetRefs }) {
  // STRICT REAL-WORLD RATIOS
  const physicalSize = data.radiusEarths * PLANET_CONSTANTS.SCALE_SIZE;
  const scaledDistance = data.distanceAU * PLANET_CONSTANTS.SCALE_DISTANCE;
  
  // 1 Year = 10 simulation seconds
  const SIM_SECONDS_PER_YEAR = 10; 
  const angularSpeed = (2 * Math.PI) / (data.orbitalPeriod * SIM_SECONDS_PER_YEAR);

  const normalizedScene = useNormalizedScene(data.textureUrl, physicalSize * 2);
  
  const pivotRef = useRef();
  const innerGroupRef = useRef();

  // Start at a random angle in the orbit
  useEffect(() => {
    if (pivotRef.current) {
      pivotRef.current.rotation.y = Math.random() * Math.PI * 2;
    }
  }, []);

  // Expose the inner group for Camera lookAt (requires getWorldPosition later)
  useEffect(() => {
    planetRefs.current[data.id] = innerGroupRef;
  }, [data.id, planetRefs]);

  useFrame((_, delta) => {
    if (pivotRef.current) {
      // Axial rotation
      if (innerGroupRef.current) {
        innerGroupRef.current.rotation.y += delta * 0.5;
      }
      
      // Stop revolution if selected
      if (!isSelected) {
        pivotRef.current.rotation.y -= angularSpeed * delta;
      }
    }
  });

  // Calculate loop points for the orbit visibility
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * scaledDistance, 0, Math.sin(angle) * scaledDistance));
    }
    return pts;
  }, [scaledDistance]);

  return (
    <group>
      {/* 5. PRD Structure: Pivot -> Translation -> Mesh */}
      <group ref={pivotRef}>
        <group ref={innerGroupRef} position={[scaledDistance, 0, 0]}>
          {/* Interaction hit box */}
          <mesh 
            onClick={(e) => { e.stopPropagation(); onClick(data); }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'default'; }}
            visible={false}
          >
            <sphereGeometry args={[physicalSize * 2.5, 16, 16]} />
            <meshBasicMaterial />
          </mesh>

          <primitive object={normalizedScene} />
        </group>
      </group>
      
      {/* Visual Orbit Line */}
      <Line 
        points={points}
        color="white"
        opacity={isSelected ? 0.5 : 0.15}
        lineWidth={1.5}
        transparent
      />

      {/* Invisible thick Torus for easy click-anywhere-on-orbit interaction */}
      <mesh 
        onClick={(e) => { e.stopPropagation(); onClick(data); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
        visible={false}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[scaledDistance, Math.max(1.5, physicalSize * 3), 8, 128]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

function SceneControls({ selectedPlanet, planetRefs }) {
  const controlsRef = useRef();

  const cameraOffset = useMemo(() => new THREE.Vector3(), []);
  const targetOffset = useMemo(() => new THREE.Vector3(), []);
  const worldPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (controlsRef.current && selectedPlanet && planetRefs.current[selectedPlanet.id]?.current) {
      const pGroup = planetRefs.current[selectedPlanet.id].current;
      
      // Because it's now nested in a pivot, its local position is constant [distance, 0, 0].
      // We MUST extract its world-space matrix coordinates to follow it!
      pGroup.getWorldPosition(worldPos);
      
      const size = Math.max(0.5, selectedPlanet.radiusEarths * PLANET_CONSTANTS.SCALE_SIZE);
      
      cameraOffset.set(size * 4, size * 1.5, size * 4);
      targetOffset.set(size * 2, 0, 0);
      
      controlsRef.current.setLookAt(
        worldPos.x + cameraOffset.x, worldPos.y + cameraOffset.y, worldPos.z + cameraOffset.z,
        worldPos.x + targetOffset.x, worldPos.y + targetOffset.y, worldPos.z + targetOffset.z,
        true
      );
    }
  });

  useEffect(() => {
    if (!selectedPlanet && controlsRef.current) {
      // Zoom way back out to fit Neptune which is 2404 units away!
      controlsRef.current.setLookAt(0, 1500, 3000, 0, 0, 0, true);
    }
  }, [selectedPlanet]);

  return (
    <CameraControls 
      ref={controlsRef}
      maxDistance={6000} // Increase massively to allow seeing out to Neptune
      minDistance={0.5} // Allow zooming into tiny 0.076 radius Mercury
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
    <Canvas camera={{ position: [0, 1500, 3000], fov: 45, far: 10000 }} className="w-full h-full">
      <color attach="background" args={['#03050a']} />
      <ambientLight intensity={2.0} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={2500} color="#fffdf5" distance={5000} decay={1} />
      
      <Stars radius={4000} depth={1000} count={10000} factor={4} saturation={0} fade speed={1} />
      
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
