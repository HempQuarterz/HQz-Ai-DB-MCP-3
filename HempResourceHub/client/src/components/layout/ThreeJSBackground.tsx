import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeJSBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    containerRef.current.appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 200;

    // Create matrix texture
    const createMatrixTexture = (size = 128) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      if (!context) return null;

      context.fillStyle = 'black';
      context.fillRect(0, 0, size, size);

      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()_+{}[]|:;<>,.?/';
      const charSize = 10;
      context.font = `Bold ${charSize}px monospace`;

      for (let x = 0; x < size; x += charSize) {
        for (let y = 0; y < size; y += charSize) {
          context.fillStyle = `rgba(0, ${Math.floor(255 * (0.2 + Math.random() * 0.8))}, 0, 1)`;
          const char = chars[Math.floor(Math.random() * chars.length)];
          context.fillText(char, x, y);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const matrixCanvasTexture = createMatrixTexture();
    const scrollSpeed = 0.005;

    // Create particles
    const particleCount = 5000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = [];
    const particleColors = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 1000;
      const y = (Math.random() - 0.5) * 1000;
      const z = (Math.random() - 0.5) * 1000;
      particlePositions.push(x, y, z);

      const color = new THREE.Color();
      if (Math.random() > 0.3) {
        color.setHSL(0.3 + Math.random() * 0.1, 1, 0.5 + Math.random() * 0.2);
      } else {
        color.setHSL(0.6 + Math.random() * 0.1, 0.5, 0.7 + Math.random() * 0.2);
      }
      particleColors.push(color.r, color.g, color.b);
    }

    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      map: matrixCanvasTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      size: 20,
      vertexColors: true,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Create lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const lineColors = [];
    const maxConnections = 10000;

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      linewidth: 1
    });

    for (let i = 0; i < maxConnections * 2 * 3; i++) {
      linePositions.push(0);
      lineColors.push(0);
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse interaction
    let isMouseDown = false;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const onDocumentMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      isMouseDown = true;
    };

    const onDocumentMouseUp = (event: MouseEvent) => {
      event.preventDefault();
      isMouseDown = false;
    };

    const onDocumentMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (isMouseDown) {
        targetRotationX = (event.clientX - windowHalfX) * 0.0002;
        targetRotationY = (event.clientY - windowHalfY) * 0.0002;
      }
    };

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      scene.rotation.y += 0.0005;
      scene.rotation.x += 0.0002;

      if (isMouseDown) {
        camera.rotation.y += (targetRotationX - camera.rotation.y) * 0.05;
        camera.rotation.x += (targetRotationY - camera.rotation.x) * 0.05;
      }

      const posArray = particles.geometry.attributes.position.array as Float32Array;
      const colArray = particles.geometry.attributes.color.array as Float32Array;
      const count = posArray.length / 3;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        posArray[i3] += Math.sin(Date.now() * 0.0005 + i) * 0.1;
        posArray[i3 + 1] += Math.cos(Date.now() * 0.0005 + i) * 0.1;
        posArray[i3 + 2] += Math.sin(Date.now() * 0.0005 + i * 2) * 0.1;

        const color = new THREE.Color(colArray[i3], colArray[i3 + 1], colArray[i3 + 2]);
        const hsl = { h: 0, s: 0, l: 0 };
        color.getHSL(hsl);
        hsl.h = (hsl.h + 0.0001) % 1;
        color.setHSL(hsl.h, hsl.s, hsl.l);
        colArray[i3] = color.r;
        colArray[i3 + 1] = color.g;
        colArray[i3 + 2] = color.b;
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.color.needsUpdate = true;

      const linePosArray = lines.geometry.attributes.position.array as Float32Array;
      const lineColArray = lines.geometry.attributes.color.array as Float32Array;
      let currentLineIndex = 0;

      const particlePosArray = particles.geometry.attributes.position.array as Float32Array;
      const maxConnectionDistance = 150;
      const connectionChance = 0.005;

      for (let i = 0; i < count; i++) {
        const p1_x = particlePosArray[i * 3];
        const p1_y = particlePosArray[i * 3 + 1];
        const p1_z = particlePosArray[i * 3 + 2];

        for (let j = i + 1; j < count; j++) {
          const p2_x = particlePosArray[j * 3];
          const p2_y = particlePosArray[j * 3 + 1];
          const p2_z = particlePosArray[j * 3 + 2];

          const dx = p1_x - p2_x;
          const dy = p1_y - p2_y;
          const dz = p1_z - p2_z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < maxConnectionDistance && Math.random() < connectionChance) {
            if (currentLineIndex < lines.geometry.attributes.position.count - 6) {
              linePosArray[currentLineIndex++] = p1_x;
              linePosArray[currentLineIndex++] = p1_y;
              linePosArray[currentLineIndex++] = p1_z;

              linePosArray[currentLineIndex++] = p2_x;
              linePosArray[currentLineIndex++] = p2_y;
              linePosArray[currentLineIndex++] = p2_z;

              const lineColor = new THREE.Color(0x00FF00);
              lineColArray[currentLineIndex - 6] = lineColor.r;
              lineColArray[currentLineIndex - 5] = lineColor.g;
              lineColArray[currentLineIndex - 4] = lineColor.b;

              lineColArray[currentLineIndex - 3] = lineColor.r;
              lineColArray[currentLineIndex - 2] = lineColor.g;
              lineColArray[currentLineIndex - 1] = lineColor.b;
            }
          }
        }
      }

      for (let i = currentLineIndex; i < lines.geometry.attributes.position.count; i++) {
        linePosArray[i] = 0;
        lineColArray[i] = 0;
      }

      lines.geometry.attributes.position.needsUpdate = true;
      lines.geometry.attributes.color.needsUpdate = true;
      lines.geometry.setDrawRange(0, currentLineIndex / 3);

      if (matrixCanvasTexture) {
        matrixCanvasTexture.offset.y -= scrollSpeed;
        matrixCanvasTexture.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    // Handle window resize
    const onWindowResize = () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize, false);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('mousedown', onDocumentMouseDown);
      document.removeEventListener('mouseup', onDocumentMouseUp);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0"
      style={{ 
        zIndex: -1,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    />
  );
}