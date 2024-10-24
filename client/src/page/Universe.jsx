import React from 'react'
import SolarSystem from '../functions/solarSystem'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'

export default function Universe() {
  return (
    <div className='bg-black'>
      <div className='absolute top-8 right-10 '>
        < div className='text-xl font-semibold flex text-white  items-center gap-4 ' >
          <div className="flex justify-center  w-[150px] mt-1">
            <div className="relative">
              <input
                type="text"
                placeholder={'Search...'}

                className="w-full h-12 pl-10  rounded-lg text-lg placeholder-gray-300 bg-transparent border-none outline-none focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaSearch />
              </div>
            </div>
          </div>
          <Link className='bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 bg-clip-text hover:text-gray-400  text-transparent'>Home</Link>
          <Link className='bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 bg-clip-text  hover:text-gray-400 text-transparent'>Planets</Link>
          <Link className='bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 bg-clip-text  hover:text-gray-400 text-transparent'>Space</Link>
          <Link className='bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 bg-clip-text  hover:text-gray-400 text-transparent'>About</Link>
        </div >
      </div >

      <SolarSystem />
    </div >
  )
}
