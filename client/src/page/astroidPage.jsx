import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import astroids from '../assets/astroids';
import img from '../assets/astroid.png' // Ensure this points to your asteroids data

const AsteroidCarousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '60px',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                },
            },
        ],
    };

    return (
        <div className="bg-gray-900 min-h-screen p-8">
            <h1 className="text-white text-4xl font-bold mb-6 text-center">Asteroid Carousel</h1>
            <Slider {...settings}>
                {astroids.map((neo) => (
                    <div key={neo._id} className="p-4">
                        <div className="bg-gray-800 bg-opacity-90 rounded-lg shadow-lg flex flex-col items-center p-6 transition-transform transform hover:scale-105">
                            <img src={img} alt={neo.name} className="w-64 h-64 object-cover rounded-lg mb-4 shadow-md" />
                            <h2 className="text-xl font-semibold text-white mb-2">{neo.name}</h2>
                            <Link to={`/asteroid/${neo._id}`} className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default AsteroidCarousel;