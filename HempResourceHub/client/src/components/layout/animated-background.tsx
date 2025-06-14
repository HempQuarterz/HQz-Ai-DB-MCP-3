import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AnimatedBackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: false,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.3);

    // Create matrix texture
    const createMatrixTexture = (size = 128) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d')!;

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

    const matrixTexture = createMatrixTexture();

    // Create particles - reduced count for better performance
    const particleCount = 1500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = [];
    const particleColors = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 800;
      const y = (Math.random() - 0.5) * 800;
      const z = (Math.random() - 0.5) * 800;
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
      map: matrixTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      size: 15,
      vertexColors: true,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Create lines - reduced for better performance
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const lineColors = [];
    const maxConnections = 2000;

    for (let i = 0; i < maxConnections * 2 * 3; i++) linePositions.push(0);
    for (let i = 0; i < maxConnections * 2 * 3; i++) lineColors.push(0);

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse interaction variables
    let mouseX = 0, mouseY = 0;
    let isMouseDown = false;
    let targetRotationX = 0, targetRotationY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    const scrollSpeed = 0.005;

    // Mouse event handlers
    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      isMouseDown = true;
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

    const onMouseUp = (event: MouseEvent) => {
      event.preventDefault();
      isMouseDown = false;
    };

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (isMouseDown) {
        targetRotationX = (event.clientX - windowHalfX) * 0.0002;
        targetRotationY = (event.clientY - windowHalfY) * 0.0002;
      }
    };

    // Touch event handlers
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        event.preventDefault();
        isMouseDown = true;
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 1 && isMouseDown) {
        event.preventDefault();
        targetRotationX = (event.touches[0].pageX - windowHalfX) * 0.0002;
        targetRotationY = (event.touches[0].pageY - windowHalfY) * 0.0002;
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      event.preventDefault();
      isMouseDown = false;
    };

    // Add event listeners
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Rotate scene
      scene.rotation.y += 0.0005;
      scene.rotation.x += 0.0002;

      // Apply camera rotation
      if (isMouseDown) {
        camera.rotation.y += (targetRotationX - camera.rotation.y) * 0.05;
        camera.rotation.x += (targetRotationY - camera.rotation.x) * 0.05;
      }

      // Animate particles
      const particlePositions = particles.geometry.attributes.position.array as Float32Array;
      const particleColors = particles.geometry.attributes.color.array as Float32Array;
      const particleCount = particlePositions.length / 3;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const iColor = i * 3;

        particlePositions[i3] += Math.sin(Date.now() * 0.0005 + i) * 0.1;
        particlePositions[i3 + 1] += Math.cos(Date.now() * 0.0005 + i) * 0.1;
        particlePositions[i3 + 2] += Math.sin(Date.now() * 0.0005 + i * 2) * 0.1;

        const color = new THREE.Color(particleColors[iColor], particleColors[iColor + 1], particleColors[iColor + 2]);
        const hsl = { h: 0, s: 0, l: 0 };
        color.getHSL(hsl);
        hsl.h = (hsl.h + 0.0001) % 1;
        color.setHSL(hsl.h, hsl.s, hsl.l);
        particleColors[iColor] = color.r;
        particleColors[iColor + 1] = color.g;
        particleColors[iColor + 2] = color.b;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.color.needsUpdate = true;

      // Animate lines
      const linePositions = lines.geometry.attributes.position.array as Float32Array;
      const lineColors = lines.geometry.attributes.color.array as Float32Array;
      let currentLineIndex = 0;

      const particlePosArray = particles.geometry.attributes.position.array as Float32Array;
      const maxConnectionDistance = 150;
      const connectionChance = 0.003;

      for (let i = 0; i < particleCount; i++) {
        const p1_x = particlePosArray[i * 3];
        const p1_y = particlePosArray[i * 3 + 1];
        const p1_z = particlePosArray[i * 3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
          const p2_x = particlePosArray[j * 3];
          const p2_y = particlePosArray[j * 3 + 1];
          const p2_z = particlePosArray[j * 3 + 2];

          const dx = p1_x - p2_x;
          const dy = p1_y - p2_y;
          const dz = p1_z - p2_z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < maxConnectionDistance && Math.random() < connectionChance) {
            if (currentLineIndex < lines.geometry.attributes.position.count - 6) {
              linePositions[currentLineIndex++] = p1_x;
              linePositions[currentLineIndex++] = p1_y;
              linePositions[currentLineIndex++] = p1_z;
              linePositions[currentLineIndex++] = p2_x;
              linePositions[currentLineIndex++] = p2_y;
              linePositions[currentLineIndex++] = p2_z;

              const lineColor = new THREE.Color(0x00FF00);
              lineColors[currentLineIndex - 6] = lineColor.r;
              lineColors[currentLineIndex - 5] = lineColor.g;
              lineColors[currentLineIndex - 4] = lineColor.b;
              lineColors[currentLineIndex - 3] = lineColor.r;
              lineColors[currentLineIndex - 2] = lineColor.g;
              lineColors[currentLineIndex - 1] = lineColor.b;
            }
          }
        }
      }

      for (let i = currentLineIndex; i < lines.geometry.attributes.position.count; i++) {
        linePositions[i] = 0;
        lineColors[i] = 0;
      }

      lines.geometry.attributes.position.needsUpdate = true;
      lines.geometry.attributes.color.needsUpdate = true;
      lines.geometry.setDrawRange(0, currentLineIndex / 3);

      // Animate texture
      matrixTexture.offset.y -= scrollSpeed;
      matrixTexture.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
}