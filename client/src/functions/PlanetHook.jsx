import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getFresnelMat } from '../functions/matGlow';

const WorldMap = ({
    earthSize = 2, // Default Earth size
    moonCount = 1, // Default number of moons
    rotationalSpeed = 0.001, // Default rotational speed
    earthTexturePath, // Earth texture path
    nightTexturePath, // Night texture path
    cloudsTexturePath, // Clouds texture path
    moonTexturePath, // Moon texture path
    glowcolor,
    saturnring // New prop for Saturn ring
}) => {
    const mountRef = useRef(null);
    const cameraRef = useRef();
    const [isZooming, setIsZooming] = useState(false); // State to track zooming

    useEffect(() => {
        // Create the scene
        const scene = new THREE.Scene();

        // Create a camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 20); // Start far away
        cameraRef.current = camera; // Reference the camera

        // Create a renderer with shadow map enabled
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true; // Enable shadow mapping
        mountRef.current.appendChild(renderer.domElement);

        // Load textures
        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load(earthTexturePath);
        const nightTexture = textureLoader.load(nightTexturePath);
        const cloudsTexture = textureLoader.load(cloudsTexturePath);
        const moonTexture = textureLoader.load(moonTexturePath); // Load moon texture

        // Create the Earth sphere
        const earthGeometry = new THREE.SphereGeometry(earthSize, 40, 40);
        const earthMaterial = new THREE.ShaderMaterial({
            uniforms: {
                dayTexture: { value: earthTexture },
                nightTexture: { value: nightTexture },
                lightPosition: { value: new THREE.Vector3(5, 5, 5) }, // Light source position
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D dayTexture;
                uniform sampler2D nightTexture;
                uniform vec3 lightPosition;
                varying vec2 vUv;
                varying vec3 vNormal;

                void main() {
                    vec3 lightDir = normalize(lightPosition);
                    float intensity = dot(vNormal, lightDir);
                    vec4 dayColor = texture2D(dayTexture, vUv);
                    vec4 nightColor = texture2D(nightTexture, vUv);
                    vec4 color = mix(nightColor, dayColor, intensity * 0.5 + 0.5);
                    gl_FragColor = color;
                }
            `,
        });

        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        earthMesh.castShadow = true; // Earth can cast shadows
        earthMesh.receiveShadow = true; // Earth can receive shadows
        scene.add(earthMesh);

        // Glow effect
        if (glowcolor) {
            const glowGeometry = new THREE.SphereGeometry(earthSize + 0.006, 40, 40); // Slightly larger sphere for glow
            const glowMaterial = getFresnelMat({ rimHex: glowcolor, facingHex: 0x000000 });
            const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
            scene.add(glowMesh);
        }

        // Cloud layer
        const cloudsGeometry = new THREE.SphereGeometry(earthSize + 0.016, 40, 40);
        const cloudsMaterial = new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.2,
        });
        const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        scene.add(cloudsMesh);

        // Create moons in a circular arrangement
        const moonRadius = 3; // Distance from the Earth to the moons
        const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Size of the moons
        const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });

        const moons = []; // Store moon meshes

        for (let i = 0; i < moonCount; i++) {
            const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
            moonMesh.castShadow = true; // Enable shadows for Moon

            // Calculate the position based on a circular arrangement
            const angle = (i / moonCount) * Math.PI * 2; // Calculate angle for each moon
            moonMesh.position.set(moonRadius * Math.cos(angle), 0.5, moonRadius * Math.sin(angle));
            scene.add(moonMesh);
            moons.push(moonMesh); // Add to moons array for later use
        }

        // Create Saturn ring if saturnring prop is true
        if (saturnring) {
            const ringTexture = textureLoader.load(saturnring, (texture) => {
                // Set texture repeat for tiling
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(4, 1); // Tiling the texture (4 times horizontally)

                // Define the ring dimensions based on earthSize
                const innerRadius = earthSize * 1.2; // Inner radius (1.5 times the size of the Earth)
                const outerRadius = earthSize * 1.6; // Outer radius (2.5 times the size of the Earth)

                // Create a ring geometry with dimensions based on earthSize
                const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 70); // More segments for smoothness
                const ringMaterial = new THREE.MeshPhongMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 1, // Set higher opacity for better visibility
                });

                const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
                ringMesh.rotation.x = Math.PI / 2; // Rotate to lie flat
                ringMesh.position.set(0, 0, 0); // Ensure the ring is at the same position as the Earth
                scene.add(ringMesh);

                // Raise the camera slightly for a better view of the ring
                camera.position.set(0, 1, 10);

                // Animation loop
                const animate = () => {
                    requestAnimationFrame(animate);

                    // Rotate the ring around the Y-axis for a realistic effect
                    ringMesh.rotation.z += 0.01; // Adjust this value for the speed of the rotation

                    // Render the scene
                    renderer.render(scene, camera);
                };
                animate();
            }, undefined, (error) => {
                console.error('Error loading texture:', error); // Log any error loading the texture
            });
        }

        // Stars
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 1000; // Adjusted count of stars for better effect
        const positions = new Float32Array(starsCount * 3);
        for (let i = 0; i < starsCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 }); // Adjusted size
        const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starsMesh);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Soft ambient light
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1); // Sunlight
        sunLight.position.set(5, 5, 5); // Position the sunlight
        sunLight.castShadow = true; // Enable shadows for sunlight
        sunLight.shadow.mapSize.width = 1024; // Shadow map size
        sunLight.shadow.mapSize.height = 1024;
        sunLight.shadow.camera.near = 0.5; // Adjust shadow camera
        sunLight.shadow.camera.far = 50;
        scene.add(sunLight);

        // Orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.target.set(0, 0, 0);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            earthMesh.rotation.y += rotationalSpeed; // Rotate Earth
            cloudsMesh.rotation.y += 0.0014; // Rotate clouds

            // Move moons in a circular path
            moons.forEach((moonMesh, index) => {
                const angle = (index / moonCount + performance.now() * 0.00001) * Math.PI * 2; // Update angle based on time
                const moonDistance = 3; // Distance from Earth to the moon
                moonMesh.position.x = moonDistance * Math.cos(angle); // Update moon position
                moonMesh.position.z = moonDistance * Math.sin(angle); // Update moon position
                moonMesh.position.y = 0.5; // Keep the moon at a fixed height
            });

            // Update light positions
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        // Zoom in function
        const zoomIn = () => {
            setIsZooming(true);
            const initialPosition = camera.position.z;
            const terget = () => {
                if (saturnring) {
                    return 3;
                } else {
                    return 2;
                }
            }
            const targetPosition = terget()

            // Target position for zoom
            const zoomDuration = 2000; // Duration of the zoom animation in milliseconds
            const startTime = performance.now();

            const animateZoom = () => {
                const elapsedTime = performance.now() - startTime;
                const t = Math.min(elapsedTime / zoomDuration, 1); // Normalize time to [0, 1]
                camera.position.z = initialPosition + (targetPosition - initialPosition) * t; // Interpolate position

                if (t < 1) {
                    requestAnimationFrame(animateZoom);
                } else {
                    setIsZooming(false); // Set zooming to false once done
                }
            };

            animateZoom();
        };

        // Call zoomIn function when component mounts
        zoomIn();

        window.addEventListener('resize', handleResize);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', handleResize);

            // Ensure mountRef.current is not null before removing the child
            if (mountRef.current && renderer) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };

    }, [earthSize, moonCount, rotationalSpeed, earthTexturePath, nightTexturePath, cloudsTexturePath, moonTexturePath, glowcolor, saturnring]);

    return <div ref={mountRef} />;
};

export default WorldMap;