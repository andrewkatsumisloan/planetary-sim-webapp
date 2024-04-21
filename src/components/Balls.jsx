import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

const Balls = () => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.1;
    meshRef.current.rotation.y = time * 0.2;
  });

  return (
    <group ref={meshRef}>
      {[...Array(100)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 20 - 10,
            Math.random() * 20 - 10,
            Math.random() * 20 - 10,
          ]}
        >
          <sphereBufferGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color={`hsl(${Math.random() * 360}, 100%, 50%)`}
          />
        </mesh>
      ))}
    </group>
  );
};
