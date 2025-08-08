import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface Avatar3DProps {
  isSpeaking: boolean;
  isListening: boolean;
}

// 3D Avatar Model Component
function AvatarModel({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const [headBone, setHeadBone] = useState<THREE.Bone | null>(null);
  const [jawBone, setJawBone] = useState<THREE.Bone | null>(null);

  // For now, we'll create a simple 3D avatar since we can't load external .glb files
  // In production, replace this with: const { scene } = useGLTF('/path/to/avatar.glb');

  useFrame((state) => {
    if (!meshRef.current) return;

    // Idle animation - slight floating
    if (!isSpeaking && !isListening) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }

    // Speaking animation - more active movement
    if (isSpeaking) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      
      // Simulate jaw movement for speaking
      if (jawBone) {
        jawBone.rotation.x = Math.sin(state.clock.elapsedTime * 8) * 0.1;
      }
    }

    // Listening animation - attentive pose
    if (isListening) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1) * 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
    }
  });

  return (
    <group ref={meshRef} position={[0, -1.2, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Human-like head */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial 
          color="#E8C5A0" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 2.05, -0.05]}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial 
          color="#4A3B2A" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#E8C5A0" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Body - Professional shirt */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 1.2, 16]} />
        <meshStandardMaterial 
          color={isSpeaking ? "#2563EB" : "#1E40AF"} 
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.5, 1.1, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.08, 0.1, 0.9, 16]} />
        <meshStandardMaterial color="#E8C5A0" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.5, 1.1, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.08, 0.1, 0.9, 16]} />
        <meshStandardMaterial color="#E8C5A0" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Hands */}
      <mesh position={[-0.65, 0.5, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#E8C5A0" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.65, 0.5, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#E8C5A0" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Legs - Professional pants */}
      <mesh position={[-0.15, -0.1, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 1.0, 16]} />
        <meshStandardMaterial color="#1F2937" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0.15, -0.1, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 1.0, 16]} />
        <meshStandardMaterial color="#1F2937" roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Shoes */}
      <mesh position={[-0.15, -0.75, 0.1]}>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[0.15, -0.75, 0.1]}>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.12, 1.85, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial 
          color={isSpeaking ? "#00FF00" : isListening ? "#FF6B00" : "#0088FF"} 
        />
      </mesh>
      <mesh position={[0.12, 1.85, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial 
          color={isSpeaking ? "#00FF00" : isListening ? "#FF6B00" : "#0088FF"} 
        />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.75, 0.32]}>
        <coneGeometry args={[0.03, 0.08, 8]} />
        <meshStandardMaterial color="#E8C5A0" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Mouth indicator */}
      <mesh position={[0, 1.65, 0.32]}>
        <sphereGeometry args={[isSpeaking ? 0.06 : 0.03, 16, 8]} />
        <meshBasicMaterial 
          color={isSpeaking ? "#FF4444" : "#CC6666"}
          transparent={true}
          opacity={isSpeaking ? 1.0 : 0.7}
        />
      </mesh>

      {/* Professional tie */}
      <mesh position={[0, 0.9, 0.35]}>
        <boxGeometry args={[0.08, 0.6, 0.02]} />
        <meshStandardMaterial color="#8B0000" roughness={0.2} metalness={0.3} />
      </mesh>
    </group>
  );
}

export const Avatar3D = ({ isSpeaking, isListening }: Avatar3DProps) => {
  return (
    <div className="w-full h-96 bg-gradient-card rounded-lg overflow-hidden border border-primary/20">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          color={isSpeaking ? "#4F8FF7" : "#ffffff"}
        />
        <pointLight 
          position={[-10, -10, -5]} 
          intensity={0.5}
          color="#F7B94F"
        />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Avatar */}
        <AvatarModel isSpeaking={isSpeaking} isListening={isListening} />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={!isSpeaking && !isListening}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Status overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border border-primary/30">
        <p className="text-sm text-foreground font-medium">
          {isSpeaking ? "🎤 Speaking..." : isListening ? "👂 Listening..." : "💭 Ready"}
        </p>
      </div>
    </div>
  );
};