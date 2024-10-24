import React from 'react';
import { FaMoon, FaWater, FaTree, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DescriptionCard = () => {
    return (
        <motion.div
            className="absolute top-20 left-10 bg-slate-800 shadow-lg rounded-lg p-6 m-4 w-[500px] transition-transform transform hover:scale-105"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-3xl text-white font-bold mb-4 flex items-center">
                <FaGlobe className="mr-2 text-green-400 animate-bounce" /> Explore Our World
            </h2>
            <p className="text-white mb-4">
                Earth, our vibrant home, is the third planet from the Sun and the only astronomical object known to harbor life.
                Covering a vast expanse of 510 million square kilometers, it is a marvel of nature.
            </p>
            <p className="text-white mb-4">
                About 71% of Earth's surface is covered with water, while approximately 29% is land, which teems with diverse life forms and ecosystems.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <motion.div
                    className="flex items-center hover:text-blue-300 transition duration-300"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                >
                    <FaWater className="text-blue-400 text-2xl mr-2" />
                    <span className="text-white">71% Water</span>
                </motion.div>
                <motion.div
                    className="flex items-center hover:text-green-300 transition duration-300"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                >
                    <FaTree className="text-green-400 text-2xl mr-2" />
                    <span className="text-white">Diverse Ecosystems</span>
                </motion.div>
                <motion.div
                    className="flex items-center hover:text-gray-300 transition duration-300"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                >
                    <FaMoon className="text-gray-400 text-2xl mr-2" />
                    <span className="text-white">1 Moon</span>
                </motion.div>
                <motion.div
                    className="flex items-center hover:text-yellow-300 transition duration-300"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                >
                    <span className="text-white">Over 8.7 million species</span>
                </motion.div>
            </div>

            <p className="text-white mb-2">
                Discover the wonders of our planet! Rotate the globe to unveil different continents and regions.
            </p>
            <p className="text-white mb-4">
                Each area boasts unique features, from majestic mountains and sprawling forests to vast oceans filled with life.
            </p>

        </motion.div>
    );
};

export default DescriptionCard;
