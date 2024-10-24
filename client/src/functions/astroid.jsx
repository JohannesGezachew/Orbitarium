import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import asteroidTexture from '../assets/ast.jpg'; // Adjust the path as necessary

const AsteroidField = ({ number = 20 }) => {
    const mountRef = useRef(null);
    const cameraRef = useRef();
    const asteroids = useRef([]);
    const fixedAsteroidMesh = useRef(null); // Reference for the asteroid that stays in front

    useEffect(() => {
        // Create the scene
        const scene = new THREE.Scene();

        // Create a camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 10); // Start farther back
        cameraRef.current = camera;

        // Create a renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Load textures
        const textureLoader = new THREE.TextureLoader();
        const asteroidTextureLoaded = textureLoader.load(asteroidTexture);

        // Function to create irregular asteroid geometry
        const createIrregularAsteroidGeometry = () => {
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const positionAttribute = geometry.attributes.position;

            for (let i = 0; i < positionAttribute.count; i++) {
                const x = positionAttribute.getX(i);
                const y = positionAttribute.getY(i);
                const z = positionAttribute.getZ(i);
                const displacement = (Math.random() - 0.5) * 0.5; // Increased displacement for irregularity
                positionAttribute.setXYZ(i, x + displacement, y + displacement, z + displacement);
            }

            geometry.attributes.position.needsUpdate = true;
            return geometry;
        };

        // Create asteroids
        for (let i = 0; i < number; i++) {
            const asteroidGeometry = createIrregularAsteroidGeometry();
            const asteroidMaterial = new THREE.MeshStandardMaterial({
                map: asteroidTextureLoaded,
                roughness: 0.5, // Adjusted roughness for a brighter appearance
                metalness: 0.7, // Adjusted metalness
            });

            const asteroidMesh = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            asteroidMesh.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                Math.random() * -50
            );

            // Set a constant forward velocity
            asteroidMesh.velocity = new THREE.Vector3(0, 0, 0.1); // Move straight forward
            asteroids.current.push(asteroidMesh);
            scene.add(asteroidMesh);
        }

        // Create the fixed asteroid that comes from far away
        fixedAsteroidMesh.current = createIrregularAsteroidGeometry();
        const fixedAsteroidMaterial = new THREE.MeshStandardMaterial({
            map: asteroidTextureLoaded,
            roughness: 0.5, // Adjusted roughness
            metalness: 0.7, // Adjusted metalness
        });

        const fixedAsteroid = new THREE.Mesh(fixedAsteroidMesh.current, fixedAsteroidMaterial);
        fixedAsteroid.position.set(1.6, 0, -20); // Move to the left side of the screen
        scene.add(fixedAsteroid);

        // Create stars
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 2000;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100; // X
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // Y
            positions[i * 3 + 2] = -Math.random() * 100; // Z
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Increased light intensity
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(1, 5, 5);
        sunLight.castShadow = true;
        scene.add(sunLight);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Move the fixed asteroid towards the camera
            if (fixedAsteroid.position.z < 7) {
                fixedAsteroid.position.z += 0.1; // Move towards the camera
            }

            // Rotate the fixed asteroid
            fixedAsteroid.rotation.x += 0.012;
            fixedAsteroid.rotation.y += 0.012;

            // Move asteroids and check for collisions
            asteroids.current.forEach((asteroid, index) => {
                // Move asteroid straight ahead
                asteroid.position.add(asteroid.velocity);

                // Check for collision with other asteroids
                asteroids.current.forEach((otherAsteroid, otherIndex) => {
                    if (asteroid !== otherAsteroid) {
                        const distance = asteroid.position.distanceTo(otherAsteroid.position);
                        if (distance < 2) { // Assuming each asteroid has a radius of 1
                            // Instead of reflecting, slightly nudge the velocity
                            const normal = asteroid.position.clone().sub(otherAsteroid.position).normalize();
                            asteroid.velocity.add(normal.clone().multiplyScalar(0.05)); // Slight nudge
                            otherAsteroid.velocity.add(normal.clone().multiplyScalar(-0.05)); // Slight nudge in opposite direction
                        }
                    }
                });

                // Remove asteroid if it goes past the camera
                if (asteroid.position.z > 20) {
                    scene.remove(asteroid);
                    asteroids.current.splice(index, 1);
                }
            });

            renderer.render(scene, camera);
        };

        animate();

        // Handle mouse drag to rotate the fixed asteroid
        const onMouseDown = (event) => {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

            const intersects = raycaster.intersectObjects([fixedAsteroid]);

            if (intersects.length > 0) {
                const intersectedAsteroid = intersects[0].object;

                const onMouseMove = (moveEvent) => {
                    const deltaX = (moveEvent.clientX - event.clientX) * 0.01;
                    const deltaY = (moveEvent.clientY - event.clientY) * 0.01;

                    intersectedAsteroid.rotation.y += deltaX;
                    intersectedAsteroid.rotation.x += deltaY;
                };

                const onMouseUp = () => {
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                };

                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
            }
        };

        window.addEventListener('mousedown', onMouseDown);

        // Handle window resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousedown', onMouseDown);
            renderer.dispose();
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [number]);

    return <div ref={mountRef} />;
};

export default AsteroidField;