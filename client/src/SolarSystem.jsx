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
import jupiterTextureUrl from './assets/2k_jupiter.jpg';
import saturnTextureUrl from './assets/saturnmap.jpg';
import uranusTextureUrl from './assets/uranusmap.jpg';
import neptuneTextureUrl from './assets/2k_neptune.jpg';
import jupiterRingTextureUrl from './assets/JupiterRings.png';
import saturnRingTextureUrl from './assets/saturnringcolor.jpg';
import uranusRingTextureUrl from './assets/uranusringcolour.jpg';
// import neptuneRingTextureUrl from './assets/neptune_ring.png';

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
    const far = 100000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 20, 300);

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
    controls.maxDistance = 50000;





    // Load textures for Sun, Earth, and others
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(earthTextureUrl);
    const sunTexture = textureLoader.load(sunTextureUrl);
    const moonTexture = textureLoader.load(moonTextureUrl);
    const marsTexture = textureLoader.load(marsTextureUrl);
    const venusTexture = textureLoader.load(venusTextureUrl);
    const mercuryTexture = textureLoader.load(mercuryTextureUrl);
    const jupiterTexture = textureLoader.load(jupiterTextureUrl);
    const saturnTexture = textureLoader.load(saturnTextureUrl);
    const uranusTexture = textureLoader.load(uranusTextureUrl);
    const neptuneTexture = textureLoader.load(neptuneTextureUrl);
    const jupiterRingTexture = textureLoader.load(jupiterRingTextureUrl);
    const saturnRingTexture = textureLoader.load(saturnRingTextureUrl);
    const uranusRingTexture = textureLoader.load(uranusRingTextureUrl);
    // const neptuneRingTexture = textureLoader.load(neptuneRingTextureUrl);

    // Create the sun
    const sunGeo = new THREE.SphereGeometry(20, 64, 64);
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
    const sunLight = new THREE.PointLight(0xffffff, 2, 10000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;  // Enable shadow casting for Sun
    scene.add(sunLight);

    // Add Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    // Function to create a planet
    const createPlanet = (radius, texture, position, speed) => {
      const geo = new THREE.SphereGeometry(radius, 64, 64);
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

    const mercury = createPlanet(1.0, mercuryTexture, 40, 0.01);
    const venus = createPlanet(1.7, venusTexture, 70, 0.008);
    const earth = createPlanet(2, earthTexture, 100, 0.005);
    const mars = createPlanet(1.2, marsTexture, 150, 0.003);
    const jupiter = createPlanet(4, jupiterTexture, 250, 0.002);
    const saturn = createPlanet(3.5, saturnTexture, 400, 0.0018);
    const uranus = createPlanet(3, uranusTexture, 600, 0.0012);
    const neptune = createPlanet(3, neptuneTexture, 800, 0.001);


    // // Add planets to scene
    // scene.add(mercury.mesh);
    // scene.add(venus.mesh);
    // scene.add(earth.mesh);
    // scene.add(mars.mesh);

        // Add planets to scene
        [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune].forEach(planet => {
          scene.add(planet.mesh);
        });





// Function to create a ring with tilt
const createRingWithTilt = (innerRadius, outerRadius, texture, planetMesh, tiltX, tiltZ) => {
  const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,  // Ensure the texture is correctly transparent
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);

  // Set ring rotation to tilt the ring on X and Z axes
  ringMesh.rotation.x = Math.PI / 2 + THREE.MathUtils.degToRad(tiltX);
  ringMesh.rotation.z = THREE.MathUtils.degToRad(tiltZ);

  planetMesh.add(ringMesh);  // Attach the ring to the planet mesh
};
      // Adding rings to the planets

// Adding realistic rings with tilts

// Add rings to Jupiter (tilt of 3.1 degrees)
createRingWithTilt(9, 15, jupiterRingTexture, jupiter.mesh, 3.1, 0);

// Add rings to Saturn (tilt of 26.7 degrees)
createRingWithTilt(9, 18, saturnRingTexture, saturn.mesh, 26.7, 0);

// Add rings to Uranus (tilt of 97.8 degrees, extreme tilt)
createRingWithTilt(8, 16, uranusRingTexture, uranus.mesh, 97.8, 0);

// Add rings to Neptune (tilt of 28.3 degrees)
// createRingWithTilt(7, 14, neptuneRingTexture, neptune.mesh, 28.3, 0);



    // // Earth orbit visualization
    // const earthOrbitGeo = new THREE.RingGeometry(39.99, 40., 64);
    // const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    // const earthOrbit = new THREE.Mesh(earthOrbitGeo, orbitMaterial);
    // earthOrbit.rotation.x = Math.PI / 2;  // Rotate to make it flat
    // scene.add(earthOrbit);


        // // Orbit visualization for planets
        // const createOrbit = (radius) => {
        //   const orbitGeo = new THREE.RingGeometry(radius - 0.01, radius, 64);
        //   const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        //   const orbit = new THREE.Mesh(orbitGeo, orbitMat);
        //   orbit.rotation.x = Math.PI / 2;
        //   return orbit;
        // };

        // scene.add(createOrbit(20)); // Mercury orbit
        // scene.add(createOrbit(30)); // Venus orbit
        // scene.add(createOrbit(40)); // Earth orbit
        // scene.add(createOrbit(70)); // Mars orbit


            // Orbits
    const createOrbit = (distance) => {
      const orbitGeo = new THREE.RingGeometry(distance - 0.1, distance + 0.1, 64);
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
    };

    [40, 70, 100, 150, 250, 400, 600, 800].forEach(createOrbit);







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



    const animate = (t = 0) => {
      requestAnimationFrame(animate);

      // Earth as base (speed: 0.005), other planets proportional
      const earthBaseSpeed = 0.005;

      // Rotate planets around the Sun (speed adjusted proportionally)
      mercury.angle += earthBaseSpeed * (365 / 88);  // Mercury takes 88 days to orbit the sun
      mercury.mesh.position.set(Math.cos(mercury.angle) * 40, 0, Math.sin(mercury.angle) * 40);
      mercury.mesh.rotation.y += 0.01;

      venus.angle += earthBaseSpeed * (365 / 225);  // Venus takes 225 days
      venus.mesh.position.set(Math.cos(venus.angle) * 70, 0, Math.sin(venus.angle) * 70);
      venus.mesh.rotation.y += 0.01;

      earth.angle += earthBaseSpeed;  // Earth's speed as base
      earth.mesh.position.set(Math.cos(earth.angle) * 100, 0, Math.sin(earth.angle) * 100);
      earth.mesh.rotation.y += 0.01;
      moonOrbit.rotation.y = t * 0.0015;

      mars.angle += earthBaseSpeed * (365 / 687);  // Mars takes 687 days
      mars.mesh.position.set(Math.cos(mars.angle) * 150, 0, Math.sin(mars.angle) * 150);
      mars.mesh.rotation.y += 0.01;

      jupiter.angle += earthBaseSpeed * (365 / 4333);  // Jupiter takes 4333 days
      jupiter.mesh.position.set(Math.cos(jupiter.angle) * 250, 0, Math.sin(jupiter.angle) * 250);
      jupiter.mesh.rotation.y += 0.01;

      saturn.angle += earthBaseSpeed * (365 / 10759);  // Saturn takes 10759 days
      saturn.mesh.position.set(Math.cos(saturn.angle) * 400, 0, Math.sin(saturn.angle) * 400);
      saturn.mesh.rotation.y += 0.01;

      uranus.angle += earthBaseSpeed * (365 / 30687);  // Uranus takes 30687 days
      uranus.mesh.position.set(Math.cos(uranus.angle) * 600, 0, Math.sin(uranus.angle) * 600);
      uranus.mesh.rotation.y += 0.01;

      neptune.angle += earthBaseSpeed * (365 / 60190);  // Neptune takes 60190 days
      neptune.mesh.position.set(Math.cos(neptune.angle) * 800, 0, Math.sin(neptune.angle) * 800);
      neptune.mesh.rotation.y += 0.01;

      // Update controls and render scene
      controls.update();
      renderer.render(scene, camera);
    };


    // // Create far starfield
    // const createFarStarfield = () => {
    //   const starGeometry = new THREE.BufferGeometry();
    //   const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    //   const starVertices = [];
    //   const minDistance = 300;
    //   const maxDistance = 1000;

    //   for (let i = 0; i < 10000; i++) {
    //     const x = THREE.MathUtils.randFloatSpread(maxDistance);
    //     const y = THREE.MathUtils.randFloatSpread(maxDistance);
    //     const z = THREE.MathUtils.randFloatSpread(maxDistance);
    //     const distance = Math.sqrt(x * x + y * y + z * z);
    //     if (distance > minDistance) {
    //       starVertices.push(x, y, z);
    //     }
    //   }

    //   starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    //   const stars = new THREE.Points(starGeometry, starMaterial);
    //   scene.add(stars);
    // };
    // createFarStarfield();

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
