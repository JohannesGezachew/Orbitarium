import React, { useEffect, useRef,  } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Import textures
import earthTextureUrl from './assets/earthmap1k.jpg';
import sunTextureUrl from './assets/sunmap.jpg';
import moonTextureUrl from './assets/moonmap1k.jpg';
import marsTextureUrl from './assets/mar0kuu2.jpg';
import venusTextureUrl from './assets/ven0aaa2.jpg';
import mercuryTextureUrl from './assets/mercurymap.jpg';

const SolarSystem = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Set up renderer, scene, and camera
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    mountRef.current.appendChild(renderer.domElement);

    // Camera setup
    const fov = 75;
    const aspect = w / h;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 20, 100);

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





    // Load textures for Sun, Earth, and others
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(earthTextureUrl);
    const sunTexture = textureLoader.load(sunTextureUrl);
    const moonTexture = textureLoader.load(moonTextureUrl);
    const marsTexture = textureLoader.load(marsTextureUrl);
    const venusTexture = textureLoader.load(venusTextureUrl);
    const mercuryTexture = textureLoader.load(mercuryTextureUrl);

    // Create the sun
    const sunGeo = new THREE.SphereGeometry(10, 64, 64);
    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTexture,
      roughness: 1,
      metalness: 0.5,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 2,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(0, 0, 0);
    sunMesh.castShadow = false;  // Add this line
    sunMesh.receiveShadow = true;  // Add this line
    scene.add(sunMesh);

    // Lighting to simulate the Sun's effect
    const sunLight = new THREE.PointLight(0xffffff, 1, 1000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;  // Enable shadow casting for Sun
    scene.add(sunLight);

    // Add Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    // Function to create a planet
    const createPlanet = (radius, texture, position, speed) => {
      const geo = new THREE.SphereGeometry(radius, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.7,
        metalness: 0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(position, 0, 0);
      mesh.castShadow = true;  // Add this line
      mesh.receiveShadow = true;  // Add this line
      return { mesh, speed, angle: 0 };
    };

    const mercury = createPlanet(1.0, mercuryTexture, 20, 0.01);
    const venus = createPlanet(1.7, venusTexture, 30, 0.008);
    const earth = createPlanet(2, earthTexture, 40, 0.005);
    const mars = createPlanet(1.2, marsTexture, 70, 0.003);

    // Add planets to scene
    scene.add(mercury.mesh);
    scene.add(venus.mesh);
    scene.add(earth.mesh);
    scene.add(mars.mesh);



    // Earth orbit visualization
    const earthOrbitGeo = new THREE.RingGeometry(39.99, 40., 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const earthOrbit = new THREE.Mesh(earthOrbitGeo, orbitMaterial);
    earthOrbit.rotation.x = Math.PI / 2;  // Rotate to make it flat
    scene.add(earthOrbit);





    // Create Moon's orbit pivot for Earth
    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.set(0, 0, 0);
    earth.mesh.add(moonOrbit);

    // Moon
    const moonGeo = new THREE.SphereGeometry(0.5, 64, 64);
    const moonMat = new THREE.MeshPhongMaterial({
      map: moonTexture,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(4, 0, 0);
    moonOrbit.add(moonMesh);

    // Animate the scene
    const animate = (t = 0) => {
      requestAnimationFrame(animate);

      // Rotate planets around the Sun
      mercury.angle += mercury.speed;
      mercury.mesh.position.set(
        Math.cos(mercury.angle) * 20,
        0,
        Math.sin(mercury.angle) * 20
      );

      venus.angle += venus.speed;
      venus.mesh.position.set(
        Math.cos(venus.angle) * 30,
        0,
        Math.sin(venus.angle) * 30
      );

      earth.angle += earth.speed;
      earth.mesh.position.set(
        Math.cos(earth.angle) * 40,
        0,
        Math.sin(earth.angle) * 40
      );
      earth.mesh.rotation.y += 0.01;  // Earth's self-rotation
      moonOrbit.rotation.y = t * 0.0015;

      mars.angle += mars.speed;
      mars.mesh.position.set(
        Math.cos(mars.angle) * 70,
        0,
        Math.sin(mars.angle) * 70
      );

      controls.update();
      renderer.render(scene, camera);
    };

    // Create far starfield
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

  return (
    <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}>
    </div>
  );
};

export default SolarSystem;
