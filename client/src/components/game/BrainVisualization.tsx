import { useRef, useState, useEffect, Component, ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Text } from "@react-three/drei";
import * as THREE from "three";

interface BrainVisualizationProps {
  stage: number;
}

class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('3D visualization error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function AnimatedBrain({ stage }: { stage: number }) {
  const brainRef = useRef<THREE.Mesh>(null);
  const neuronsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.01;
      brainRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    
    if (neuronsRef.current) {
      neuronsRef.current.rotation.y += 0.02;
    }
  });

  // Calculate brain properties based on stage
  const brainSize = 0.8 + (stage * 0.2);
  const neuronCount = Math.min(20, 3 + stage * 2);
  const brainColor = new THREE.Color().setHSL(0.8 - (stage * 0.1), 0.7, 0.6);

  // Generate neuron positions
  const neuronPositions = Array.from({ length: neuronCount }, (_, i) => {
    const phi = Math.acos(-1 + (2 * i) / neuronCount);
    const theta = Math.sqrt(neuronCount * Math.PI) * phi;
    const radius = brainSize + 0.3;
    
    return [
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    ];
  });

  return (
    <group>
      {/* Main Brain */}
      <Sphere ref={brainRef} args={[brainSize, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={brainColor}
          transparent
          opacity={0.8}
          emissive={brainColor}
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Neural Network */}
      <group ref={neuronsRef}>
        {neuronPositions.map((position, index) => (
          <group key={index}>
            {/* Neuron */}
            <Sphere args={[0.05, 8, 8]} position={position as [number, number, number]}>
              <meshStandardMaterial
                color="#ffff00"
                emissive="#ffff00"
                emissiveIntensity={0.5}
              />
            </Sphere>
            
            {/* Connection to center */}
            <mesh position={[position[0] * 0.5, position[1] * 0.5, position[2] * 0.5]}>
              <cylinderGeometry args={[0.01, 0.01, Math.sqrt(position[0]**2 + position[1]**2 + position[2]**2), 4]} />
              <meshStandardMaterial
                color="#00ffff"
                transparent
                opacity={0.3}
                emissive="#00ffff"
                emissiveIntensity={0.1}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Stage indicator */}
      <Text
        position={[0, -brainSize - 0.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        IQ: {50 + stage * 25}
      </Text>
    </group>
  );
}

function Simple2DBrain({ stage }: { stage: number }) {
  const neuronCount = 3 + stage * 2;
  const iq = 50 + stage * 25;
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-500 rounded-full animate-pulse">
      <div className="text-center">
        <div className="text-4xl mb-2">🧠</div>
        <div className="text-white font-bold text-sm">IQ: {iq}</div>
        <div className="flex justify-center mt-2 gap-1">
          {Array.from({ length: Math.min(neuronCount, 10) }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

export default function BrainVisualization({ stage }: BrainVisualizationProps) {
  const [webGLSupported] = useState(() => checkWebGLSupport());
  
  if (!webGLSupported) {
    return <Simple2DBrain stage={stage} />;
  }
  
  return (
    <ErrorBoundary fallback={<Simple2DBrain stage={stage} />}>
      <div className="w-full h-full bg-transparent">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#0066ff" />
          <AnimatedBrain stage={stage} />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
}
