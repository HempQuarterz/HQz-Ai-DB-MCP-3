import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface ModelViewerProps {
  objPath: string;
  className?: string;
}

function Model({ objPath }: { objPath: string }) {
  const meshRef = useRef<THREE.Group>();
  const { scene } = useThree();

  useEffect(() => {
    const loader = new OBJLoader();
    
    // Load the OBJ file
    loader.load(
      objPath,
      (object) => {
        // Set default material if none provided
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: '#2EBD59', // Green color to match our theme
              roughness: 0.5,
              metalness: 0.2,
            });
          }
        });

        // Position and scale the model
        object.scale.set(0.01, 0.01, 0.01); // Adjust scale as needed
        object.position.set(0, 0, 0);
        object.rotation.x = -Math.PI / 4; // Rotate to face camera

        if (meshRef.current) {
          // Clear previous model if any
          while (meshRef.current.children.length > 0) {
            meshRef.current.remove(meshRef.current.children[0]);
          }
          // Add new model
          meshRef.current.add(object);
        }
      },
      (xhr) => {
        // Loading progress
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        // Error handling
        console.error('An error happened while loading the model:', error);
      }
    );

    // Add lights to scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    return () => {
      scene.remove(ambientLight);
      scene.remove(directionalLight);
    };
  }, [objPath, scene]);

  // Rotate the model slowly for a nice effect
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return <group ref={meshRef as any} />;
}

const HempModelViewer: React.FC<ModelViewerProps> = ({ objPath, className = '' }) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Model objPath={objPath} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default HempModelViewer;