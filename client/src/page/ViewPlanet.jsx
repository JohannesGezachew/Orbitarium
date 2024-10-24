import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WorldMap from '../functions/PlanetHook';
import astroid from '../assets/astroid.png';
import moon from '../assets/moon.png';
import planets from '../assets/data';
import { FaBars } from 'react-icons/fa';

export default function Planet() {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const { name } = useParams();


    useEffect(() => {
        const context = canvasRef.current?.getContext('webgl');

        // Set up your WebGL context here if needed

        return () => {
            // Cleanup logic
            if (context) {
                context.clearColor(0, 0, 0, 1);
                context.clear(context.COLOR_BUFFER_BIT);
            }
        };
    }, []);

    // Filter to find the planet data
    const data1 = planets.filter((pl) => pl.name === name);
    const data = data1[0];

    // Error handling if data is not present
    if (!data) {
        return <div className="text-white">No planet data available. Please select a planet.</div>;
    }

    return (
        <div className='bg-black overflow-hidden'>
            <div className='absolute top-6 right-6'>
                <FaBars onClick={() => navigate('/')} className='text-white text-4xl' />
            </div>

            {/* Planet name heading */}
            <div className='absolute text-white top-5 left-10 text-6xl font-bold'>
                {data.name}
            </div>

            {/* WorldMap Component */}
            <div className='ml-60'>
                <WorldMap
                    earthSize={data.earthSize}
                    moonCount={data.moonCount}
                    rotationalSpeed={data.rotationalSpeed}
                    earthTexturePath={data.texture}
                    glowcolor={data.glowcolor}
                    nightTexturePath={data.nightTexturePath}
                    cloudsTexturePath={data.cloudsTexturePath}
                    saturnring={data.saturnring}
                    moonTexturePath={data.moonTexturePath}
                />
            </div>

            {/* About Planet section */}
            <div className="absolute border border-gray-500 rounded-xl flex flex-col items-center justify-center gap-3 w-[400px] top-[130px] left-6 bg-transparent p-4">
                <h3 className="text-white w-full pb-5 text-xl font-bold">About {data.name}</h3>
                <div className="flex flex-col text-gray-300">
                    <p><strong>Diameter:</strong> {data.diameter} km - A substantial size that contributes to its gravitational influence.</p>
                    <p><strong>Surface Area:</strong> {data.surfaceArea} km² - Reflects the planet's overall size.</p>
                    <p><strong>Water Coverage:</strong> {data.waterCoverage} - Highlights the presence or absence of water.</p>
                    <p><strong>Unique Features:</strong> {data.uniqueFeatures.join(', ')}.</p>
                    <p><strong>Species Count:</strong> {data.speciesCount} - Indicates the estimated number of species, if any.</p>
                </div>
            </div>

            {/* Information about Moons and Asteroid Belt side by side */}
            <div className='absolute flex items-center justify-center gap-6 w-fit bottom-5 left-6'>
                <div className='flex items-center justify-center gap-2'>
                    <img className='w-[100px]' src={moon} alt="Moon" />
                    <div>
                        <div className='text-gray-400 font-semibold text-xl'>Moons</div>
                        {data.moon ? (
                            <div className='text-gray-500 w-[220px]'>
                                Home to {data.moonCount} moon(s), including notable ones like {data.moon.map(m => m.name).join(', ')}.
                            </div>
                        ) : (
                            <div className='text-gray-500'>No moons orbiting this planet.</div>
                        )}
                    </div>
                </div>

                <div className='flex items-center justify-center gap-2'>
                    <img src={astroid} className='w-[120px]' alt="Asteroids" />
                    <div>
                        <div className='text-gray-400 font-semibold text-xl'>Asteroid Belt</div>
                        {data.asteroids && data.asteroids.length > 0 ? (
                            <div className='text-gray-500'>
                                Contains notable asteroids, including {data.asteroids.map(a => a.name).join(', ')}.
                            </div>
                        ) : (
                            <div className='text-gray-500'>No asteroids found in this region.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}