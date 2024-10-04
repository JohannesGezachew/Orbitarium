import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import earthTextureUrl from './assets/earthmap1k.jpg';
import sunTextureUrl from './assets/sunmap.jpg';
import moonTextureUrl from './assets/moonmap1k.jpg';

const SolarSystem = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up renderer, scene, and camera
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Camera setup
    const fov = 75;
    const aspect = w / h;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 30, 80);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0e0e);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.target.set(0, 0, 0);

    // Load textures for Sun, Earth, and Moon
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(earthTextureUrl);
    const sunTexture = textureLoader.load(sunTextureUrl);
    const moonTexture = textureLoader.load(moonTextureUrl);

    // const earthTexture = textureLoader.load(
    //   '/assets/earthmap1k.jpg',
    //   () => console.log('Earth texture loaded!'),
    //   undefined,
    //   (error) => console.error('Error loading Earth texture:', error)
    // );

    // const sunTexture = textureLoader.load(
    //   '/assets/sunmap.jpg',
    //   () => console.log('Sun texture loaded!'),
    //   undefined,
    //   (error) => console.error('Error loading Sun texture:', error)
    // );

    // const moonTexture = textureLoader.load(
    //   '/assets/moonmap1k.jpg',
    //   () => console.log('Moon texture loaded!'),
    //   undefined,
    //   (error) => console.error('Error loading Moon texture:', error)
    // );

    // Sun
    const sunGeo = new THREE.SphereGeometry(10, 64, 64);
    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTexture,
      roughness: 1,
      metalness: 0.5,
      emissiveIntensity: 2,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(0, 0, 0);
    scene.add(sunMesh);

    // Lighting to simulate the Sun's effect
    const sunLight = new THREE.PointLight(0xffffff, 1, 1000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;  // Enable shadow casting for Sun
    scene.add(sunLight);

    // Add Ambient light for softer global lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    // Create Earth's orbit pivot
    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.set(0, 0, 0);
    scene.add(earthOrbit);

    // Earth
    const earthGeo = new THREE.SphereGeometry(2, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      specular: 0x333333,
      shininess: 10,
      emissive: 0x000000,
      emissiveIntensity: 0.1,
      roughness: 0.7, // Control surface roughness for realistic shading
      metalness: 0,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.set(40, 0, 0);
    earthMesh.castShadow = true;  // Cast shadows from Earth
    earthMesh.receiveShadow = true;
    earthOrbit.add(earthMesh);

    // Create Moon's orbit pivot
    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.set(0, 0, 0);
    earthMesh.add(moonOrbit);

    // Moon
    const moonGeo = new THREE.SphereGeometry(0.5, 64, 64);
    const moonMat = new THREE.MeshPhongMaterial({
      map: moonTexture,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(4, 0, 0);
    moonOrbit.add(moonMesh);

    // Create Earth's orbit path (circular)
    const orbitRadius = 40;
    const orbitSegments = 100;
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitVertices = [];

    for (let i = 0; i <= orbitSegments; i++) {
      const angle = (i / orbitSegments) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      orbitVertices.push(x, 0, z);
    }
// Convert the vertices into a Float32Array for BufferGeometry
    orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitVertices, 3));
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);

    // Create a far starfield
    const createFarStarfield = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
      const starVertices = [];
      const minDistance = 300;
      const maxDistance = 1000;

      for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(maxDistance);
        const y = THREE.MathUtils.randFloatSpread(maxDistance);
        const z = THREE.MathUtils.randFloatSpread(maxDistance);
        const distance = Math.sqrt(x * x + y * y + z * z);
        if (distance > minDistance) {
          starVertices.push(x, y, z);
        }
      }

      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
    };
    createFarStarfield();



    // Animation loop
    const animate = (t = 0) => {
      requestAnimationFrame(animate);
      earthMesh.rotation.y = t * 0.001;
      earthOrbit.rotation.y = t * 0.0001;
      moonOrbit.rotation.y = t * 0.0015;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resizing
    const handleResize = () => {
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default SolarSystem;
