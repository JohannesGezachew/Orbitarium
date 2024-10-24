

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlanetSelection from './page/Planets.jsx';
import Planet from './page/ViewPlanet.jsx';

import Collusion from './page/Start.jsx';
import AsteroidCarousel from './page/astroidPage.jsx';
import ViewAstroid from './page/ViewAstroid.jsx';
import Universe from './page/Universe.jsx';


export default function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/planet/:name' element={<Planet />}></Route>

        <Route path='/home' element={<Universe />}></Route>
        <Route path='/planet' element={<PlanetSelection />}></Route>
        <Route path='/' element={<Collusion />}></Route>
        <Route path='/astroids' element={<AsteroidCarousel />}></Route>
        <Route path='/asteroid/:id' element={<ViewAstroid />}></Route>





      </Routes>
    </BrowserRouter >

  )
}
