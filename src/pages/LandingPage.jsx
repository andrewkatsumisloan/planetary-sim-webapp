import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Sphere() {
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    sphereRef.current.position.x = Math.sin(time) * 2;
    sphereRef.current.position.y = Math.cos(time) * 2;
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#8c8c8c" roughness={0.1} metalness={0.9} />
    </mesh>
  );
}

function LandingPage() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Sphere />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

export default LandingPage;
