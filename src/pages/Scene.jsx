import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { BufferGeometry, Vector3, LineBasicMaterial, Color } from "three";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";

const sunPosition = [0, 0, 0];
const spawnRadius = 10;

function MovingSphere({ position, args, speed, minDistance, G, showTrails }) {
  const mesh = useRef();
  const [trail, setTrail] = useState([]);
  const maxTrailLength = 2000; // Maximum number of positions to keep in the trail

  const [velocity, setVelocity] = useState({
    x: (Math.random() - 0.5) * speed,
    y: (Math.random() - 0.5) * speed,
    z: (Math.random() - 0.5) * speed,
  });

  useFrame(() => {
    // Update the position based on velocity
    mesh.current.position.x += velocity.x;
    mesh.current.position.y += velocity.y;
    mesh.current.position.z += velocity.z;

    // Update the trail regardless of the showTrails state
    const newPosition = new Vector3(
      mesh.current.position.x,
      mesh.current.position.y,
      mesh.current.position.z
    );
    setTrail((oldTrail) => {
      const newTrail = [...oldTrail, newPosition];
      if (newTrail.length > maxTrailLength) {
        newTrail.shift(); // Remove the oldest point to maintain trail length
      }
      return newTrail;
    });

    // Gravitational pull logic remains the same
    const dx = sunPosition[0] - newPosition.x;
    const dy = sunPosition[1] - newPosition.y;
    const dz = sunPosition[2] - newPosition.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (distance > minDistance) {
      const force = G / (distance * distance);
      setVelocity((v) => ({
        x: v.x + (force * dx) / distance,
        y: v.y + (force * dy) / distance,
        z: v.z + (force * dz) / distance,
      }));
    }
  });

  return (
    <>
      <mesh ref={mesh} position={position}>
        <sphereGeometry args={args} />
        <meshStandardMaterial color="blue" />
      </mesh>
      {showTrails && trail.length >= 2 && (
        <Line
          points={trail}
          color="red"
          lineWidth={0.8}
          transparent
          opacity={0.2}
        />
      )}
    </>
  );
}

function Sun() {
  return (
    <mesh position={sunPosition}>
      <sphereGeometry args={[5, 64, 64]} />
      <meshStandardMaterial
        color="orange"
        emissive="orange"
        emissiveIntensity={1}
      />
      <pointLight
        position={sunPosition}
        color="orange"
        intensity={10}
        distance={50}
      />
    </mesh>
  );
}

function Scene() {
  const { size, speed, G, showTrails } = useControls({
    size: { value: 0.5, min: 0.1, max: 3, step: 0.1 },
    speed: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
    G: { value: 5e-1, min: 1e-4, max: 6, step: 1e-4 },
    showTrails: { label: "Show Trails", value: true }, // Toggle for showing trails
  });

  const [spheres, setSpheres] = useState([]);

  useEffect(() => {
    const handleInteraction = () => {
      const angle = Math.random() * 2 * Math.PI;
      const radius = 5 + Math.random() * (spawnRadius - 5);
      const x = sunPosition[0] + radius * Math.cos(angle);
      const y = sunPosition[1] + radius * Math.sin(angle);
      const z = sunPosition[2];

      const newSphere = {
        position: [x, y, z],
        args: [size, 32, 32],
        speed: speed,
        minDistance: 6, // Adjust based on sun size
        G: G,
        showTrails: showTrails,
      };
      setSpheres((spheres) => [...spheres, newSphere]);
    };

    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        handleInteraction();
      }
    };

    const handleTouchStart = () => {
      handleInteraction();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [size, speed, G, showTrails]);

  return (
    <Canvas camera={{ position: [15, 15, 15], fov: 75 }}>
      <ambientLight intensity={0.3} />
      <Sun />
      <OrbitControls />
      {spheres.map((sphere, idx) => (
        <MovingSphere
          key={idx}
          position={sphere.position}
          args={sphere.args}
          speed={sphere.speed}
          minDistance={sphere.minDistance}
          G={sphere.G}
          showTrails={sphere.showTrails}
        />
      ))}
    </Canvas>
  );
}

export default Scene;
