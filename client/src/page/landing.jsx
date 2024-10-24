// src/LandingPage.js

import React from 'react';

const LandingPage = () => {
    return (
        <div className="flex flex-col h-screen text-white bg-black">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center h-full bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?galaxy')" }}>
                <h1 className="text-5xl font-bold mb-4">Explore the Wonders of the Universe</h1>
                <p className="mb-8">Join us on a journey through space and time.</p>
                <a href="#explore" className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition">Start Your Journey</a>
            </section>

            {/* About Section */}
            <section id="about" className="flex items-center justify-center h-screen bg-gray-800">
                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">About Us</h2>
                    <p className="mb-8">We are passionate about exploring the cosmos and sharing our knowledge with fellow space enthusiasts.</p>
                </div>
            </section>

            {/* Explore Section */}
            <section id="explore" className="flex items-center justify-center h-screen bg-gray-700">
                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">What We Offer</h2>
                    <ul className="list-disc list-inside mb-4">
                        <li>Astrophysics Articles</li>
                        <li>Stargazing Guides</li>
                        <li>Interactive Maps</li>
                    </ul>
                    <a href="#gallery" className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition">Discover More</a>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="flex items-center justify-center h-screen bg-gray-800">
                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">Gallery</h2>
                    <img src="https://source.unsplash.com/1600x900/?space" alt="Galaxy" className="mb-4 rounded" />
                    <p>Caption: The majestic spiral galaxy.</p>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="flex items-center justify-center h-screen bg-gray-700">
                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
                    <blockquote className="italic mb-4">"This website opened my eyes to the beauty of the universe!" - Alex R.</blockquote>
                </div>
            </section>

            {/* Newsletter Subscription */}
            <section className="flex items-center justify-center h-screen bg-gray-800">
                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
                    <input type="email" placeholder="Your Email" className="px-4 py-2 rounded mr-2" />
                    <button className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition">Subscribe</button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-center py-4">
                <p>© 2024 Universe Website</p>
            </footer>
        </div>
    );
};

export default LandingPage;