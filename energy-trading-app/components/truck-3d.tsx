'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

function TruckModel() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} scale={1.2}>
        {/* Truck Body - Main Cabin */}
        <mesh position={[0, 0.3, 0.8]}>
          <boxGeometry args={[1.4, 1, 1.2]} />
          <meshStandardMaterial color="#3B82F6" metalness={0.6} roughness={0.3} />
        </mesh>
        
        {/* Truck Container/Cargo */}
        <mesh position={[0, 0.4, -0.8]}>
          <boxGeometry args={[1.5, 1.2, 2.2]} />
          <meshStandardMaterial color="#1F2937" metalness={0.4} roughness={0.5} />
        </mesh>
        
        {/* Container Accent Stripe */}
        <mesh position={[0, 0.4, -0.8]}>
          <boxGeometry args={[1.52, 0.2, 2.22]} />
          <meshStandardMaterial color="#10B981" metalness={0.5} roughness={0.3} />
        </mesh>
        
        {/* Windshield */}
        <mesh position={[0, 0.55, 1.15]}>
          <boxGeometry args={[1.2, 0.6, 0.1]} />
          <meshStandardMaterial color="#E5E7EB" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
        </mesh>
        
        {/* Front Bumper */}
        <mesh position={[0, -0.15, 1.35]}>
          <boxGeometry args={[1.5, 0.2, 0.15]} />
          <meshStandardMaterial color="#374151" metalness={0.3} roughness={0.6} />
        </mesh>
        
        {/* Headlights */}
        <mesh position={[-0.5, 0.1, 1.4]}>
          <boxGeometry args={[0.25, 0.2, 0.05]} />
          <meshStandardMaterial color="#FCD34D" emissive="#FCD34D" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.5, 0.1, 1.4]}>
          <boxGeometry args={[0.25, 0.2, 0.05]} />
          <meshStandardMaterial color="#FCD34D" emissive="#FCD34D" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Wheels */}
        {/* Front wheels */}
        <mesh position={[-0.7, -0.35, 0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1F2937" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0.7, -0.35, 0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1F2937" metalness={0.2} roughness={0.8} />
        </mesh>
        {/* Rear wheels */}
        <mesh position={[-0.7, -0.35, -0.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1F2937" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0.7, -0.35, -0.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1F2937" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[-0.7, -0.35, -1.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1F2937" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0.7, -0.35, -1.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1F2937" metalness={0.2} roughness={0.8} />
        </mesh>
        
        {/* Energy Symbol on Container */}
        <mesh position={[0.76, 0.4, -0.8]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

export function Truck3D() {
  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <Canvas
        camera={{ position: [3, 2, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <TruckModel />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
