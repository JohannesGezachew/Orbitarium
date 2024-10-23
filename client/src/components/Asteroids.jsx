import * as THREE from 'three';

const AsteroidElements = ({ scene }) => {
  const asteroids = new THREE.Group();
  const numAsteroids = 1000;

  // Loop to create asteroids
  for (let i = 0; i < numAsteroids; i++) {
    // Increase the asteroid size a bit for visibility
    const asteroidGeo = new THREE.SphereGeometry(Math.random() * 0.4 + 0.1, 16, 16);

    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x777777,
      roughness: 1,
      metalness: 0.3,
    });

    const asteroidMesh = new THREE.Mesh(asteroidGeo, asteroidMat);

    // Adjust the distance range to bring asteroids closer
    const distance = THREE.MathUtils.randFloat(160, 190);  // Reduce min/max distance for visibility
    const angle = THREE.MathUtils.randFloat(0, Math.PI * 2);
    asteroidMesh.position.set(
      Math.cos(angle) * distance,
      THREE.MathUtils.randFloat(-5, 5),  // Vertical position
      Math.sin(angle) * distance
    );
    asteroidMesh.rotation.set(
      THREE.MathUtils.randFloat(0, Math.PI * 2),
      THREE.MathUtils.randFloat(0, Math.PI * 2),
      THREE.MathUtils.randFloat(0, Math.PI * 2)
    );

    asteroidMesh.castShadow = true;
    asteroidMesh.receiveShadow = true;

    asteroids.add(asteroidMesh);
  }

  scene.add(asteroids);
};

export default AsteroidElements;
