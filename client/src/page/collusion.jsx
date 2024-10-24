import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getBody, getMouseBall } from '../functions/glow'// Ensure these functions are implemented correctly
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.11.2';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const BigBangScene = () => {
    const mountRef = useRef(null);
    const mousePos = useRef(new THREE.Vector2());

    useEffect(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        // Initialize the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(w, h);
        mountRef.current.appendChild(renderer.domElement);

        // Initialize RAPIER
        RAPIER.init().then(() => {
            const gravity = { x: 0.0, y: 0, z: 0.0 };
            const world = new RAPIER.World(gravity);

            // Post-processing setup
            const composer = new EffectComposer(renderer);
            composer.addPass(new RenderPass(scene, camera));
            composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 2.0, 0.0, 0.005));

            const bodies = [];
            const mouseBall = getMouseBall(RAPIER, world);
            scene.add(mouseBall.mesh);

            const hemiLight = new THREE.HemisphereLight(0x00bbff, 0xaa00ff);
            hemiLight.intensity = 0.2;
            scene.add(hemiLight);


            const createBodies = async (numBodies, totalTime) => {
                const interval = totalTime / numBodies; // Time interval between creating each body
                for (let i = 0; i < numBodies; i++) {
                    const body = getBody(RAPIER, world); // Create body
                    if (!body || !body.mesh) {
                        console.error('Failed to create body:', body);
                        continue; // Skip invalid bodies
                    }
                    bodies.push(body);
                    scene.add(body.mesh);

                    // Wait for the interval before creating the next body
                    await new Promise(resolve => setTimeout(resolve, interval));
                }
            };

            // Start creating bodies with a 20-second total duration for all of them
            createBodies(4000, 25000); // Creates 200 bodies over 20 seconds

            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);
                world.step(); // Update physics
                mouseBall.update(mousePos.current); // Update mouse ball
                bodies.forEach(b => b.update()); // Update each body
                composer.render(scene, camera); // Render scene with post-processing
            };

            animate();

            // Handle window resize
            const handleWindowResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };

            window.addEventListener('resize', handleWindowResize);

            // Handle mouse move
            const handleMouseMove = (evt) => {
                mousePos.current.x = (evt.clientX / window.innerWidth) * 2 - 1;
                mousePos.current.y = -(evt.clientY / window.innerHeight) * 2 + 1;
            };

            window.addEventListener('mousemove', handleMouseMove);

            // Cleanup
            return () => {
                window.removeEventListener('resize', handleWindowResize);
                window.removeEventListener('mousemove', handleMouseMove);
                mountRef.current.removeChild(renderer.domElement);
            };
        }).catch(error => {
            console.error('Failed to initialize RAPIER:', error);
        });
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh', backgroundColor: 'black' }} />;
};

export default BigBangScene;
