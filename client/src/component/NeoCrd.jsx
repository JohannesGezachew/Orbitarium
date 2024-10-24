import React from 'react';
import { FaStar, FaRuler, FaCalendarAlt, FaTachometerAlt, FaMapSigns } from 'react-icons/fa';
import earth from '../assets/earth.png'

const NEOCard = ({ neoData }) => {
    return (
        <div className="flex absolute left-8 top-5  bg-transparent items-center justify-center h-screen">
            <div className="w-full bg-transparent  rounded-lg shadow-lg p-6 transition-transform transform hover:scale-100">
                <h2 className="text-4xl absolute top-[-100px] whitespace-nowrap font-bold text-white text-center"><span className='text-gray-400'>Name:</span>{neoData.name}</h2>
                <h2 className="text-3xl whitespace-nowrap font-semibold text-white">Astroid Detail</h2>

                <div className="mt-4 text-white text-lg">
                    <p className="flex items-center mt-4">
                        <FaStar className="text-yellow-500 mr-2" />
                        <strong className='pr-4'>Absolute Magnitude:</strong> {neoData.absolute_magnitude_h}
                    </p>
                    <p className="flex items-center  mt-2">
                        <FaRuler className="text-green-500 mr-2" />
                        <strong className='pr-4'>Estimated Diameter:</strong> {neoData.estimated_diameter.meters.estimated_diameter_min.toFixed(2)} - {neoData.estimated_diameter.meters.estimated_diameter_max.toFixed(2)} m
                    </p>
                    <p className="flex items-center mt-2">
                        <FaCalendarAlt className="text-purple-500 mr-2" />
                        <strong className='pr-4'>Close Approach Date:</strong> {neoData.close_approach_date}
                    </p>
                    <p className="flex items-center mt-2">
                        <FaTachometerAlt className="text-red-500 mr-2" />
                        <strong className='pr-4'>Relative Velocity:</strong> {parseFloat(neoData.relative_velocity.kilometers_per_hour).toFixed(2)} km/h
                    </p>
                    <p className="flex gap-5 absolute top-72 left-5 items-center mt-2">
                        <img className='w-32' src={earth} alt="" />
                        <div>
                            <strong className='pr-4'>Miss Earth with</strong>
                            <div className='whitespace-nowrap'> Distance: {parseFloat(neoData.miss_distance.kilometers).toFixed(2)} km</div>
                        </div>

                    </p>
                </div>
                <a
                    href={neoData.nasa_jpl_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block text-white font-semibold py-2 px-4 rounded hover:border hover:border-blue-700 transition-colors"
                >
                    More Info
                </a>
            </div>
        </div>
    );
};

export default NEOCard;