import * as THREE from "three";

const sceneMiddle = new THREE.Vector3(0, 0, 0);

function getBody(RAPIER, world) {
    const size = 0.1 + Math.random() * 0.25;
    const range = 6;
    const density = size * 1.0;
    let x = Math.random() * range - range * 0.5;
    let y = Math.random() * range - range * 0.5 + 3;
    let z = Math.random() * range - range * 0.5;

    // physics
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(x, y, z);
    let rigid = world.createRigidBody(rigidBodyDesc);
    let colliderDesc = RAPIER.ColliderDesc.ball(size).setDensity(density);
    world.createCollider(colliderDesc, rigid);

    const geometry = new THREE.IcosahedronGeometry(size, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        flatShading: true
    });
    const mesh = new THREE.Mesh(geometry, material);

    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x990000,
        wireframe: true
    });
    const wireMesh = new THREE.Mesh(geometry, wireMat);
    wireMesh.scale.setScalar(1.01);
    mesh.add(wireMesh);

    function update() {
        rigid.resetForces(true);
        let { x, y, z } = rigid.translation();
        let pos = new THREE.Vector3(x, y, z);
        let dir = pos.clone().sub(sceneMiddle).normalize();
        rigid.addForce(dir.multiplyScalar(-0.5), true);
        mesh.position.set(x, y, z);
    }
    return { mesh, rigid, update };
}

function getMouseBall(RAPIER, world) {
    const mouseSize = 0.60; // Starting size
    const maxSize = 15; // Max size to fill the page
    const initialDuration = 23; // Duration for the initial growth phase
    const finalDuration = 6; // Duration for the faster growth phase
    const totalDuration = initialDuration + finalDuration; // Total duration for both phases
    const geometry = new THREE.IcosahedronGeometry(mouseSize, 8);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
    });
    const mouseLight = new THREE.PointLight(0xffffff, 1);
    const mouseMesh = new THREE.Mesh(geometry, material);
    mouseMesh.add(mouseLight);

    // RIGID BODY
    let bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 0);
    let mouseRigid = world.createRigidBody(bodyDesc);
    let dynamicCollider = RAPIER.ColliderDesc.ball(mouseSize * 3.0);
    world.createCollider(dynamicCollider, mouseRigid);

    // Animation properties
    let startTime = performance.now();

    function update(mousePos) {
        // Update mouse position
        mouseRigid.setTranslation({ x: mousePos.x * 5, y: mousePos.y * 5, z: 0.2 });
        let { x, y, z } = mouseRigid.translation();
        mouseMesh.position.set(x, y, z);

        // Increase size over time
        let elapsedTime = (performance.now() - startTime) / 1000; // Convert to seconds

        let size;
        if (elapsedTime < initialDuration) {
            // Slow growth phase
            size = THREE.MathUtils.lerp(maxSize, mouseSize, elapsedTime / initialDuration); // Linear interpolation
        } else if (elapsedTime < totalDuration) {
            // Fast growth phase
            let fastElapsedTime = elapsedTime - initialDuration; // Time in the fast growth phase
            size = THREE.MathUtils.lerp(mouseSize, maxSize, fastElapsedTime / finalDuration); // Linear interpolation for faster growth
        } else {
            // Reset the start time if the total duration is complete
            startTime = performance.now(); // Reset for continuous growth
        }

        mouseMesh.scale.set(size, size, size); // Set the new size
    }

    return { mesh: mouseMesh, update };
}


export { getBody, getMouseBall };



