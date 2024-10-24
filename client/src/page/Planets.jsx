import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import planets from '../assets/data'; // Assuming this contains your planet data

const PlanetSelection = () => {
    const navigate = useNavigate();
    const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);

    const handleNext = () => {
        setCurrentPlanetIndex((prevIndex) => (prevIndex + 1) % planets.length);
    };

    const handlePrev = () => {
        setCurrentPlanetIndex((prevIndex) => (prevIndex - 1 + planets.length) % planets.length);
    };

    const currentPlanet = planets[currentPlanetIndex];
    const prevPlanet = planets[(currentPlanetIndex - 1 + planets.length) % planets.length];
    const nextPlanet = planets[(currentPlanetIndex + 1) % planets.length];

    return (
        <div
            className="relative w-full h-screen bg-cover bg-center transition-all duration-700 ease-in-out overflow-hidden"
            style={{ backgroundImage: `url(${currentPlanet.background})` }}
        >
            {/* Add blur effect to the background */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[0]"></div>

            <header className="relative pt-10 mb-12 text-center">
                <h1 className="text-8xl text-white font-bold mb-4 drop-shadow-lg">{currentPlanet.name}</h1>
                <p className="text-xl text-gray-400">{currentPlanet.description}</p>
            </header>

            {/* Carousel Wrapper */}
            <div className="flex items-center justify-center h-full relative z-10">
                {/* Cards Slider */}
                <div
                    className="relative w-full flex items-center justify-center overflow-hidden"
                    style={{ maxWidth: '1000px' }}
                >
                    {/* Carousel Track */}
                    <div
                        className="flex transition-transform mb-8 ease-in-out duration-500"
                        style={{
                            transform: `translateX(-${currentPlanetIndex * 100}%)`, // Moves the card by 100% of its width
                        }}
                    >
                        {planets.map((planet) => (
                            <div
                                key={planet.name}
                                className="min-w-full flex-shrink-0 p-4"
                                style={{ maxWidth: '400px' }} // Keeps each card's width fixed
                            >
                                {/* Card for Each Planet */}
                                <div className="max-w-sm mx-auto border border-gray-600 backdrop-blur-lg rounded-lg shadow-md relative">
                                    <div className="p-4 flex gap-3 text-center relative">
                                        <img
                                            src={planet.planetPic}
                                            alt={planet.name}
                                            onClick={() => navigate(`/planet/${planet.name}`)}
                                            className="w-52 h-52 object-cover rounded-full mx-auto z-10"
                                        />
                                        <div className="mt-10">
                                            <h2 className="text-3xl text-white font-bold mt-4">{planet.name}</h2>
                                            <button
                                                onClick={() => navigate(`/planet/${planet.name}`)}
                                                className="mt-4 border border-gray-400 text-white px-4 py-2 rounded transition duration-300 hover:bg-gray-700"
                                            >
                                                View Planet
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-between absolute top-1/2 transform -translate-y-1/2 w-full px-10 z-20">
                {/* Previous Planet */}
                <button
                    onClick={handlePrev}
                    className="text-white bg-transparent px-4 py-2 rounded transition duration-300"
                >
                    <div className="min-w-full flex-shrink-0 p-4" style={{ maxWidth: '400px' }}>
                        <div className="max-w-sm mx-auto backdrop-blur-lg rounded-lg shadow-md relative">
                            <div className="p-4 flex flex-col gap-1 text-center relative">
                                <img
                                    src={prevPlanet.planetPic}
                                    alt={prevPlanet.name}
                                    className="w-32 h-32 object-cover rounded-full mx-auto z-10"
                                />
                                <h2 className="text-2xl text-white">{prevPlanet.name}</h2>
                            </div>
                        </div>
                    </div>
                </button>

                {/* Next Planet */}
                <button
                    onClick={handleNext}
                    className="text-white px-4 py-2 rounded transition duration-300"
                >
                    <div className="min-w-full flex-shrink-0 p-4" style={{ maxWidth: '400px' }}>
                        <div className="max-w-sm mx-auto backdrop-blur-lg rounded-lg shadow-md relative">
                            <div className="p-4 flex flex-col gap-1 text-center relative">
                                <img
                                    src={nextPlanet.planetPic}
                                    alt={nextPlanet.name}
                                    className="w-32 h-32 object-cover rounded-full mx-auto z-10"
                                />
                                <h2 className="text-2xl text-white">{nextPlanet.name}</h2>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

        </div>
    );
};

export default PlanetSelection;
