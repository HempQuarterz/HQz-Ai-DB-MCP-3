import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface SimpleHempModelProps {
  className?: string;
}

const SimpleHempModel: React.FC<SimpleHempModelProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a3622); // Brighter green background
    
    // Set up the camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // Set up the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create a simple 3D plant model (simplified representation)
    const geometry = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 32);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x4ade80, // Bright green 
      emissive: 0x22c55e,
      emissiveIntensity: 0.3,
      specular: 0xffffff,
      shininess: 50
    });
    const stem = new THREE.Mesh(geometry, material);
    stem.position.y = -0.2;
    scene.add(stem);
    
    // Create leaves
    const leafGeometry = new THREE.ConeGeometry(0.7, 1.2, 32);
    const leafMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x22c55e, // Bright green
      emissive: 0x15803d,
      emissiveIntensity: 0.3,
      specular: 0xffffff,
      shininess: 30
    });
    
    // Create more leaves and make them bigger for better visibility
    for (let i = 0; i < 8; i++) {
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.y = i * 0.25;
      leaf.rotation.x = Math.PI / 2;
      leaf.rotation.z = i * Math.PI / 4;
      leaf.scale.set(0.4, 0.4, 0.4);
      stem.add(leaf);
    }
    
    // Add lighting - brighter lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Increased intensity
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1.5); // Increased intensity
    pointLight.position.set(3, 3, 3); // Closer to the model
    scene.add(pointLight);
    
    // Add a second light from a different angle
    const pointLight2 = new THREE.PointLight(0xffffff, 1);
    pointLight2.position.set(-3, 3, 2);
    scene.add(pointLight2);
    
    // Add a spotlight from the front
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 0, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 0;
    spotLight.distance = 200;
    scene.add(spotLight);
    
    // Animation loop
    let frameId: number;
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Rotate faster and add some movement to make it more dynamic
      stem.rotation.y += 0.03; // 3x faster rotation
      stem.position.y = -0.2 + Math.sin(Date.now() * 0.001) * 0.1; // Slight up and down movement
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      
      // Remove lights from scene to prevent memory leaks
      scene.remove(ambientLight);
      scene.remove(pointLight);
      scene.remove(pointLight2);
      scene.remove(spotLight);
      
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      geometry.dispose();
      material.dispose();
      leafGeometry.dispose();
      leafMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  return <div ref={containerRef} className={`w-full h-full ${className}`}></div>;
};

export default SimpleHempModel;