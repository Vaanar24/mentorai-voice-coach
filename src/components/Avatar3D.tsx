import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface Avatar3DProps {
  isSpeaking: boolean;
  isListening: boolean;
  onAvatarClick?: () => void;
}

// 3D Avatar Model Component
function AvatarModel({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const [blinkTimer, setBlinkTimer] = useState(0);
  const [expressionIntensity, setExpressionIntensity] = useState(0);

  useFrame((state) => {
    if (!meshRef.current || !headRef.current || !eyesRef.current) return;

    const time = state.clock.elapsedTime;

    // Natural breathing animation
    meshRef.current.position.y = Math.sin(time * 0.8) * 0.02 - 0.5;
    meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.02;

    // Head movements based on state
    if (isSpeaking) {
      // More animated speaking
      headRef.current.rotation.x = Math.sin(time * 1.5) * 0.03;
      headRef.current.rotation.y = Math.sin(time * 0.8) * 0.04;
      headRef.current.position.y = 1.8 + Math.sin(time * 3) * 0.01;
      setExpressionIntensity(Math.sin(time * 4) * 0.5 + 0.5);
    } else if (isListening) {
      // Attentive listening pose
      headRef.current.rotation.x = Math.sin(time * 0.5) * 0.01 + 0.02;
      headRef.current.rotation.y = Math.sin(time * 0.3) * 0.02;
      headRef.current.position.y = 1.8 + Math.sin(time * 1.2) * 0.005;
      setExpressionIntensity(0.3);
    } else {
      // Calm idle state
      headRef.current.rotation.x = Math.sin(time * 0.4) * 0.008;
      headRef.current.rotation.y = Math.sin(time * 0.6) * 0.01;
      headRef.current.position.y = 1.8 + Math.sin(time * 0.7) * 0.008;
      setExpressionIntensity(0.1);
    }

    // Natural blinking
    const blinkCycle = Math.sin(time * 0.3) * 0.5 + 0.5;
    if (blinkCycle > 0.95) {
      setBlinkTimer(1);
    } else {
      setBlinkTimer(Math.max(0, blinkTimer - 0.1));
    }

    // Eye tracking effect
    const mouseInfluence = 0.02;
    eyesRef.current.rotation.x = Math.sin(time * 0.1) * mouseInfluence;
    eyesRef.current.rotation.y = Math.cos(time * 0.15) * mouseInfluence;

    // Arm animations
    if (leftArmRef.current) {
      const baseRotation = 0.2;
      const speakingAnimation = isSpeaking ? Math.sin(time * 2) * 0.1 : 0;
      leftArmRef.current.rotation.z = baseRotation + speakingAnimation;
    }

    if (rightArmRef.current) {
      const baseRotation = -0.2;
      const speakingAnimation = isSpeaking ? Math.sin(time * 2.3) * 0.1 : 0;
      rightArmRef.current.rotation.z = baseRotation - speakingAnimation;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.5, 0]} scale={[1, 1, 1]}>
      {/* Head group for coordinated movement */}
      <group ref={headRef} position={[0, 1.8, 0]}>
        {/* Main head shape - more realistic proportions */}
        <mesh>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial 
            color="#F5E6D3" 
            roughness={0.15}
            metalness={0.02}
          />
        </mesh>

        {/* Facial structure enhancement */}
        <mesh position={[0, -0.1, 0.25]}>
          <sphereGeometry args={[0.32, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial 
            color="#F5E6D3" 
            roughness={0.15}
            metalness={0.02}
          />
        </mesh>

        {/* Cheekbones */}
        <mesh position={[-0.18, 0, 0.28]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#F2E0CE" roughness={0.2} metalness={0.02} />
        </mesh>
        <mesh position={[0.18, 0, 0.28]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#F2E0CE" roughness={0.2} metalness={0.02} />
        </mesh>

        {/* Eye area enhancement */}
        <mesh position={[0, 0.08, 0.3]}>
          <sphereGeometry args={[0.25, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <meshStandardMaterial color="#F7EAD7" roughness={0.1} metalness={0.01} />
        </mesh>

        {/* Eyes group for coordinated movement */}
        <group ref={eyesRef}>
          {/* Eye sockets */}
          <mesh position={[-0.13, 0.07, 0.32]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.05} metalness={0.1} />
          </mesh>
          <mesh position={[0.13, 0.07, 0.32]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.05} metalness={0.1} />
          </mesh>

          {/* Iris - blue eyes */}
          <mesh position={[-0.13, 0.07, 0.38]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial 
              color="#4A90E2" 
              roughness={0.1}
              metalness={0.2}
              emissive={isSpeaking ? "#1a5490" : "#0a2545"}
              emissiveIntensity={isSpeaking ? 0.3 : 0.1}
            />
          </mesh>
          <mesh position={[0.13, 0.07, 0.38]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial 
              color="#4A90E2" 
              roughness={0.1}
              metalness={0.2}
              emissive={isSpeaking ? "#1a5490" : "#0a2545"}
              emissiveIntensity={isSpeaking ? 0.3 : 0.1}
            />
          </mesh>

          {/* Pupils */}
          <mesh position={[-0.13, 0.07, 0.39]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[0.13, 0.07, 0.39]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color="#000000" />
          </mesh>

          {/* Eye highlights */}
          <mesh position={[-0.125, 0.08, 0.39]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.135, 0.08, 0.39]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>

        {/* Eyelids for blinking */}
        <mesh position={[-0.13, 0.07 + (blinkTimer * 0.06), 0.37]} scale={[1, blinkTimer > 0.5 ? 0.3 : 1, 1]}>
          <sphereGeometry args={[0.09, 16, 8]} />
          <meshStandardMaterial color="#F5E6D3" roughness={0.15} metalness={0.02} />
        </mesh>
        <mesh position={[0.13, 0.07 + (blinkTimer * 0.06), 0.37]} scale={[1, blinkTimer > 0.5 ? 0.3 : 1, 1]}>
          <sphereGeometry args={[0.09, 16, 8]} />
          <meshStandardMaterial color="#F5E6D3" roughness={0.15} metalness={0.02} />
        </mesh>

        {/* Eyebrows */}
        <mesh position={[-0.13, 0.15, 0.35]} rotation={[0, 0, expressionIntensity * 0.1]}>
          <boxGeometry args={[0.12, 0.02, 0.02]} />
          <meshStandardMaterial color="#D4B896" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[0.13, 0.15, 0.35]} rotation={[0, 0, -expressionIntensity * 0.1]}>
          <boxGeometry args={[0.12, 0.02, 0.02]} />
          <meshStandardMaterial color="#D4B896" roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Nose - more detailed */}
        <mesh position={[0, -0.05, 0.35]}>
          <coneGeometry args={[0.025, 0.08, 8]} />
          <meshStandardMaterial color="#F2E0CE" roughness={0.15} metalness={0.02} />
        </mesh>
        <mesh position={[0, -0.08, 0.34]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#F2E0CE" roughness={0.15} metalness={0.02} />
        </mesh>

        {/* Nostrils */}
        <mesh position={[-0.01, -0.08, 0.36]}>
          <sphereGeometry args={[0.005, 8, 8]} />
          <meshStandardMaterial color="#E8D5C4" roughness={0.3} metalness={0.02} />
        </mesh>
        <mesh position={[0.01, -0.08, 0.36]}>
          <sphereGeometry args={[0.005, 8, 8]} />
          <meshStandardMaterial color="#E8D5C4" roughness={0.3} metalness={0.02} />
        </mesh>

        {/* Mouth - with expression */}
        <mesh position={[0, -0.2, 0.34]} scale={[1 + expressionIntensity * 0.3, 1 + expressionIntensity * 0.2, 1]}>
          <sphereGeometry args={[isSpeaking ? 0.04 : 0.025, 16, 8]} />
          <meshStandardMaterial 
            color={isSpeaking ? "#E67B7B" : "#D97B7B"}
            roughness={0.1}
            metalness={0.05}
            emissive={isSpeaking ? "#6B1B1B" : "#4B1B1B"}
            emissiveIntensity={isSpeaking ? 0.2 : 0.1}
          />
        </mesh>

        {/* Lips definition */}
        <mesh position={[0, -0.18, 0.35]}>
          <sphereGeometry args={[0.035, 16, 4]} />
          <meshStandardMaterial color="#E67B7B" roughness={0.1} metalness={0.05} />
        </mesh>

        {/* Chin */}
        <mesh position={[0, -0.3, 0.25]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#F5E6D3" roughness={0.15} metalness={0.02} />
        </mesh>
      </group>

      {/* Hair - more detailed blonde hair */}
      <mesh position={[0, 2.1, -0.05]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial 
          color="#E6D0A3" 
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>
      
      {/* Hair layers for volume */}
      <mesh position={[0, 2.15, -0.1]}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial 
          color="#E8D3A8" 
          roughness={0.8}
          metalness={0.03}
        />
      </mesh>

      {/* Hair strands */}
      <mesh position={[-0.2, 2.0, 0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#E6D0A3" roughness={0.9} metalness={0.02} />
      </mesh>
      <mesh position={[0.2, 2.0, 0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#E6D0A3" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* Neck with more definition */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#F5E6D3" roughness={0.15} metalness={0.02} />
      </mesh>

      {/* Shoulders and torso - more realistic proportions */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.8, 1.0, 0.3]} />
        <meshStandardMaterial 
          color={isSpeaking ? "#E8EAF6" : "#F3E5F5"} 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Arms with realistic movement */}
      <mesh 
        ref={leftArmRef}
        position={[-0.5, 1.1, 0]} 
        rotation={[0, 0, 0.2]}
      >
        <cylinderGeometry args={[0.08, 0.1, 0.9, 16]} />
        <meshStandardMaterial color="#F5E6D3" roughness={0.15} metalness={0.02} />
      </mesh>
      <mesh 
        ref={rightArmRef}
        position={[0.5, 1.1, 0]} 
        rotation={[0, 0, -0.2]}
      >
        <cylinderGeometry args={[0.08, 0.1, 0.9, 16]} />
        <meshStandardMaterial color="#F5E6D3" roughness={0.15} metalness={0.02} />
      </mesh>

      {/* Hands with finger details */}
      <mesh position={[-0.65, 0.5, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#F5E6D3" roughness={0.15} metalness={0.02} />
      </mesh>
      <mesh position={[0.65, 0.5, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#F5E6D3" roughness={0.15} metalness={0.02} />
      </mesh>

      {/* Professional attire details */}
      <mesh position={[0, 0.9, 0.35]}>
        <boxGeometry args={[0.08, 0.6, 0.02]} />
        <meshStandardMaterial color="#8B0000" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 1.2, 0.3]}>
        <boxGeometry args={[0.3, 0.05, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.1} />
      </mesh>
    </group>
  );
}

export const Avatar3D = ({ isSpeaking, isListening, onAvatarClick }: Avatar3DProps) => {
  return (
    <div 
      className="w-full h-96 bg-gradient-card rounded-lg overflow-hidden border border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
      onClick={onAvatarClick}
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
        
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2}
          color={isSpeaking ? "#87CEEB" : "#ffffff"}
          castShadow
        />
        <pointLight 
          position={[-10, -10, -5]} 
          intensity={0.6}
          color="#F7E8A4"
        />
        <spotLight
          position={[0, 5, 3]}
          angle={0.3}
          penumbra={0.5}
          intensity={0.8}
          color="#ffffff"
          target-position={[0, 1, 0]}
        />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Avatar */}
        <AvatarModel isSpeaking={isSpeaking} isListening={isListening} />
        
        {/* Controls */}
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.2}
          target={[0, 1, 0]}
          autoRotate={!isSpeaking && !isListening}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Enhanced status overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-background/90 backdrop-blur-md rounded-full border border-primary/40 shadow-lg">
        <p className="text-sm text-foreground font-medium flex items-center gap-2">
          {isSpeaking ? (
            <>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Speaking...
            </>
          ) : isListening ? (
            <>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Listening...
            </>
          ) : onAvatarClick ? (
            <>
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Click to start conversation
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Ready
            </>
          )}
        </p>
      </div>
    </div>
  );
};