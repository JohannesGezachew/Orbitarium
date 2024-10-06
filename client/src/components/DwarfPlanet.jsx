import * as THREE from 'three';

const DwarfPlanets = ({ scene }) => {
  // const textureLoader = new THREE.TextureLoader();

  // Pluto
  const createDwarfPlanet = (radius, position, speed) => {
    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.9,
      metalness: 0,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(position, 0, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return { mesh, speed, angle: 0 };
  };

  const pluto = createDwarfPlanet(0.9, 100, 0.002);

  return { pluto };
};

export default DwarfPlanets;
