import * as THREE from 'three';

const Moons = ({ dwarfPlanet }) => {
  const moonOrbit = new THREE.Object3D();
  moonOrbit.position.set(0, 0, 0);
  dwarfPlanet.add(moonOrbit);

  // Create a moon
  const moonGeo = new THREE.SphereGeometry(0.2, 32, 32);
  const moonMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.position.set(2, 0, 0);
  moonOrbit.add(moonMesh);
};

export default Moons;
