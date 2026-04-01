import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, useGLTF, Line, CameraControls, Clone, Html } from '@react-three/drei';
import * as THREE from 'three';
import { planetsData, sunData, PLANET_CONSTANTS } from '../data/planets';

// Helper to fix unknown user GLTF scales
function useNormalizedScene(textureUrl, desiredSize) {
  const { scene } = useGLTF(textureUrl);
  
  const normalizedScene = useMemo(() => {
    const cloned = scene.clone();
    
    // Explicitly scan the Blender/GLTF root strictly to identify physical polygons, entirely
    // ignoring invisible lights, phantom cameras, or empty anchor groups exported by mistake!
    const box = new THREE.Box3();
    let hasMesh = false;
    
    cloned.traverse((child) => {
      if (child.isMesh) {
        const meshBox = new THREE.Box3().setFromObject(child);
        if (!hasMesh) {
          box.copy(meshBox);
          hasMesh = true;
        } else {
          box.union(meshBox);
        }
      }
    });
    
    // Fatal fallback if model is somehow entirely broken
    if (!hasMesh) box.setFromObject(cloned);
    
    const size = new THREE.Vector3();
    box.getSize(size);
    
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Scale mesh to strictly match visual physics size constraints
    if (maxDim > 0) {
      const scaleFactor = desiredSize / maxDim;
      cloned.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
    
    // Extract the strict polygon-only center of mass, ignoring all Phantom data
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // Algebraically override vertex positions to snap correctly to Canvas [0,0,0] focal tracking
    cloned.position.set(
      -center.x * (maxDim > 0 ? desiredSize / maxDim : 1), 
      -center.y * (maxDim > 0 ? desiredSize / maxDim : 1), 
      -center.z * (maxDim > 0 ? desiredSize / maxDim : 1)
    );
    
    return cloned;
  }, [scene, desiredSize]);

  return normalizedScene;
}

function Sun({ planetRefs }) {
  const physicalSize = PLANET_CONSTANTS.SUN_RADIUS_EARTHS * PLANET_CONSTANTS.SCALE_SIZE;
  const normalizedScene = useNormalizedScene(sunData.textureUrl, physicalSize * 2);
  const meshRef = useRef();

  // Explicitly export its spatial pivot coordinate up to the global Camera loop tracking Array
  useEffect(() => {
    planetRefs.current["sun"] = meshRef;
  }, [planetRefs]);
  
  const SIM_SECONDS_PER_YEAR = 31557600; // 1:1 REAL TIME ACCURACY (365.25 days = 1 year)
  const SIM_HOURS_PER_YEAR = 8766;
  const REAL_SECONDS_PER_SIM_HOUR = SIM_SECONDS_PER_YEAR / SIM_HOURS_PER_YEAR;

  // The Sun rotates extremely slowly (25.38 Earth days = 609 hours)
  const axialSpeed = (2 * Math.PI) / (sunData.rotationPeriodHours * REAL_SECONDS_PER_SIM_HOUR);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += axialSpeed * delta;
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

function MoonCore({ data, selectedPlanet, parentSize, onClick, planetRefs, children }) {
  const isSelected = selectedPlanet?.id === data.id;
  const physicalSize = data.radiusEarths * PLANET_CONSTANTS.SCALE_SIZE;
  // Scaled strictly visually proportional to the host planet radius to prevent mesh clipping!
  const scaledDistance = parentSize * data.distanceBaseRadii;
  
  const SIM_SECONDS_PER_YEAR = 31557600; // 1:1 REAL TIME ACCURACY
  const SIM_HOURS_PER_YEAR = 8766; 
  const REAL_SECONDS_PER_SIM_HOUR = SIM_SECONDS_PER_YEAR / SIM_HOURS_PER_YEAR;

  const orbitPeriodYears = data.orbitalPeriodDays / 365.25;
  const orbitalSpeed = (2 * Math.PI) / (orbitPeriodYears * SIM_SECONDS_PER_YEAR);
  const axialSpeed = (2 * Math.PI) / (data.rotationPeriodHours * REAL_SECONDS_PER_SIM_HOUR);

  const pivotRef = useRef();
  const innerGroupRef = useRef();

  useEffect(() => {
    if (pivotRef.current) pivotRef.current.rotation.y = Math.random() * Math.PI * 2;
  }, []);

  useEffect(() => {
    planetRefs.current[data.id] = innerGroupRef;
  }, [data.id, planetRefs]);

  useFrame((_, delta) => {
    if (pivotRef.current) {
      if (innerGroupRef.current) innerGroupRef.current.rotation.y += axialSpeed * delta;
      
      // Re-engaged Orbital Brake: Without this, high-speed objects (Phobos orbits in 1 sec) wildly tear the 
      // camera`s interpolation tracking matrix to shreds.
      if (!isSelected) {
        pivotRef.current.rotation.y -= orbitalSpeed * delta;
      }
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * scaledDistance, 0, Math.sin(angle) * scaledDistance));
    }
    return pts;
  }, [scaledDistance]);

  return (
    <group ref={pivotRef}>
      <group ref={innerGroupRef} position={[scaledDistance, 0, 0]}>
        {/* Interaction hit box */}
        <mesh 
          onClick={(e) => { e.stopPropagation(); onClick(data); }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'default'; }}
          visible={false}
        >
          <sphereGeometry args={[physicalSize * 3, 16, 16]} />
          <meshBasicMaterial />
        </mesh>

        {children}

        {/* Moon Nameplate HUD */}
        <Html 
          center 
          position={[0, physicalSize * 1.5 + 0.3, 0]} 
          className="pointer-events-none opacity-80"
        >
          <div className="text-white/80 font-medium text-[10px] tracking-wider uppercase bg-slate-900/60 backdrop-blur-sm border border-white/5 px-1.5 py-0.5 rounded-sm whitespace-nowrap">
            {data.name}
          </div>
        </Html>
      </group>
      
      {/* Sub-Orbital Ring */}
      <Line points={points} color="white" opacity={isSelected ? 0.3 : 0.05} lineWidth={1} transparent />
      
      {/* Torus Hitbox */}
      <mesh 
        onClick={(e) => { e.stopPropagation(); onClick(data); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
        visible={false}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[scaledDistance, Math.max(0.5, physicalSize * 3), 8, 64]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

function MoonGLTF(props) {
  const physicalSize = props.data.radiusEarths * PLANET_CONSTANTS.SCALE_SIZE;
  const normalizedScene = useNormalizedScene(props.data.textureUrl, physicalSize * 2);
  return (
    <MoonCore {...props}>
      <primitive object={normalizedScene} />
    </MoonCore>
  );
}

function MoonProcedural(props) {
  const physicalSize = props.data.radiusEarths * PLANET_CONSTANTS.SCALE_SIZE;
  return (
    <MoonCore {...props}>
      <mesh>
        <sphereGeometry args={[physicalSize, 32, 32]} />
        <meshStandardMaterial color={props.data.color || "#cccccc"} roughness={0.8} />
      </mesh>
    </MoonCore>
  );
}

function Moon(props) {
  // Gracefully routes rendering flow based on GLB availability to prevent hook crashes
  if (props.data.textureUrl) {
     return <MoonGLTF {...props} />;
  }
  return <MoonProcedural {...props} />;
}

function Planet({ data, selectedPlanet, onClick, planetRefs }) {
  const isSelected = selectedPlanet?.id === data.id;
  // STRICT REAL-WORLD RATIOS
  const physicalSize = data.radiusEarths * PLANET_CONSTANTS.SCALE_SIZE;
  const scaledDistance = data.distanceAU * PLANET_CONSTANTS.SCALE_DISTANCE;
  
  // STABILIZED TARGET: 1:1 REAL TIME PHYSICS ENGINE
  const SIM_SECONDS_PER_YEAR = 31557600;
  
  // To retain strictly accurate day/night spin ratios under this accelerated annual clock:
  const SIM_HOURS_PER_YEAR = 8766; // 365.25 days * 24 
  const REAL_SECONDS_PER_SIM_HOUR = SIM_SECONDS_PER_YEAR / SIM_HOURS_PER_YEAR;

  // Exact Kepler-ratio orbital trajectory physics
  const orbitalSpeed = (2 * Math.PI) / (data.orbitalPeriod * SIM_SECONDS_PER_YEAR);
  
  // Exact day/night surface rotation physics
  const axialSpeed = (2 * Math.PI) / (data.rotationPeriodHours * REAL_SECONDS_PER_SIM_HOUR);

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
      // Rigorous axial day/night rotation
      if (innerGroupRef.current) {
        innerGroupRef.current.rotation.y += axialSpeed * delta;
      }
      
      // Re-engaged Orbital Brake: Halts the primary trajectory temporarily so the cinematic 
      // camera drone can physically catch up without wildly swinging.
      if (!isSelected) {
        pivotRef.current.rotation.y -= orbitalSpeed * delta;
      }
    }
  });

  // Calculate pure loop points for the visual trajectory ring (Orbit Line).
  // Dynamically injecting higher resolution for outer gas giants prevents polygonal chord-gaps
  // between the smooth matrix rotation of the planet and the straight vertex lines of the orbit ring.
  const points = useMemo(() => {
    const pts = [];
    const segments = Math.max(128, Math.floor(scaledDistance)); // Adaptive polygon resolution
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * scaledDistance, 0, Math.sin(angle) * scaledDistance));
    }
    return pts;
  }, [scaledDistance]);

  return (
    <group>
      {/* 5. PRD Structure: Pivot -> Translation -> Mesh */}
      <group ref={pivotRef}>
        <group position={[scaledDistance, 0, 0]}>
          
          <group ref={innerGroupRef}>
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

          {/* Sub-Planetary Generation Map */}
          {data.moons && data.moons.map((moonData) => (
            <Moon 
              key={moonData.id} 
              data={moonData} 
              parentSize={physicalSize}
              selectedPlanet={selectedPlanet}
              onClick={onClick}
              planetRefs={planetRefs}
            />
          ))}

          {/* Planet Nameplate HUD */}
          <Html 
            center 
            position={[0, physicalSize * 1.5 + 0.5, 0]} // Hover mathematically above the planet
            className="pointer-events-none opacity-80 transition-opacity duration-300"
          >
            <div className="text-white font-medium text-xs tracking-wider uppercase bg-slate-900/60 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded-sm whitespace-nowrap">
              {data.name}
            </div>
          </Html>
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
      
      // CRITICAL: Extract world-space matrix coordinates dynamically across the spinning universe
      pGroup.getWorldPosition(worldPos);
      
      // Radically reduce the minimum camera clamping distance to allow microscopic zooms for tiny moons
      const clampedDistanceSize = Math.max(0.1, selectedPlanet.radiusEarths * PLANET_CONSTANTS.SCALE_SIZE);
      const truePhysicalSize = selectedPlanet.radiusEarths * PLANET_CONSTANTS.SCALE_SIZE;
      
      // Calculate a dynamic zoom magnitude. Tiny moons get a relatively closer framing coefficient!
      const zoomFactor = selectedPlanet.radiusEarths < 1.0 ? 3 : 4;
      
      cameraOffset.set(clampedDistanceSize * zoomFactor, clampedDistanceSize * 1.5, clampedDistanceSize * zoomFactor);
      
      // Mathematically completely derive the Camera's explicit viewing plane natively to perfectly slide 
      // the focal target horizontally across the user's specific monitor, mathematically dodging the CSS UI panel regardless of 3D planetary rotation!
      const cameraGlobalPos = new THREE.Vector3(worldPos.x + cameraOffset.x, worldPos.y + cameraOffset.y, worldPos.z + cameraOffset.z);
      const forwardAxis = new THREE.Vector3().subVectors(worldPos, cameraGlobalPos).normalize();
      const upAxis = new THREE.Vector3(0, 1, 0);
      const rightAxis = new THREE.Vector3().crossVectors(forwardAxis, upAxis).normalize();
      
      // Shift focal target Rightwards (which pans the camera Right, seamlessly moving the object Left on screen natively).
      // Moons get a moderate shift (1.2) against their closer camera offset multiplier to perfectly match the 
      // identical 15-degree visual angular pixel shift as Planets (1.5)! 
      const shiftScale = selectedPlanet.radiusEarths < 1.0 ? 1.2 : 1.5;
      const targetOffsetVector = rightAxis.multiplyScalar(clampedDistanceSize * shiftScale);
      
      controlsRef.current.setLookAt(
        cameraGlobalPos.x, cameraGlobalPos.y, cameraGlobalPos.z,
        worldPos.x + targetOffsetVector.x, worldPos.y + targetOffsetVector.y, worldPos.z + targetOffsetVector.z,
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
        <Sun planetRefs={planetRefs} />
        {planetsData.map((data) => (
          <Planet 
            key={data.id} 
            data={data} 
            selectedPlanet={selectedPlanet}
            onClick={setSelectedPlanet}
            planetRefs={planetRefs}
          />
        ))}
      </Suspense>
      
      <SceneControls selectedPlanet={selectedPlanet} planetRefs={planetRefs} />
    </Canvas>
  );
}
