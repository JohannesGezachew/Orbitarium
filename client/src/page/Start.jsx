import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BigBangScene from './collusion';
import backgroundAudio from '../assets/vo1.mp3'; // Ensure this path is correct
import gifFile from '../assets/vid2.mp4';
import { FaPlay } from 'react-icons/fa';

export default function Collusion() {
    const navigate = useNavigate();
    const audioRef = useRef(new Audio(backgroundAudio));
    const [play, setPlay] = useState(false);

    useEffect(() => {
        const handleAudioPlay = async () => {
            try {
                // Start muted to bypass autoplay restrictions
                audioRef.current.muted = true;
                await audioRef.current.play();

                // Unmute after a short delay
                setTimeout(() => {
                    audioRef.current.muted = false;
                }, 100); // Small delay before unmuting

                // Set timer for navigation
                const navigationTimer = setTimeout(() => {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                    navigate('/home'); // Navigate to home page after 25 seconds
                }, 26000);

                return () => clearTimeout(navigationTimer); // Cleanup on unmount
            } catch (error) {
                console.error('Audio play failed:', error); // Catch any errors with autoplay
            }
        };

        if (play) {
            handleAudioPlay();
        }

        return () => {
            audioRef.current.pause(); // Clean up audio on component unmount
        };
    }, [play, navigate]);

    return (
        <div className='overflow-hidden'>
            {!play ? (
                <div className='flex justify-center  items-center'>

                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute top-0 left-0 object-cover w-screen h-screen z-0"
                    >
                        <source src={gifFile} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                  

                    <div className='flex justify-center items-center font-extrabold text-white text-7xl'>
                        <div className='absolute top-5 left-5'>
                            <div className='text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent'>
                                Let's Discover
                            </div>
                            <div className={`text-7xl  font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-500 bg-clip-text text-transparent`}>
                                Our Universe
                            </div>
                        </div>

                        <button
                            onClick={() => setPlay(true)}
                            className='absolute border-2 items-center border-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent rounded-xl px-3 flex gap-4 py-6 bottom-8 left-[38%] text-6xl transition-transform duration-300 hover:scale-125 '
                        >
                            Lets Start <FaPlay className='text-red-500 mt-3 text-4xl' />
                        </button>

                    </div>
                </div>
            ) : (
                <BigBangScene />
            )}
        </div>
    );
}
