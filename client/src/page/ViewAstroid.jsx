import React from 'react'
import AsteroidField from '../functions/astroid'
import NEOCard from '../component/NeoCrd'
import { useParams } from 'react-router-dom';
import astroids from '../assets/astroids';

export default function ViewAstroid() {
    const { id } = useParams();
    const astroid = astroids.filter((astro) => id === astro._id)[0]

    return (
        <div className='overflow-hidden overflow-y-hidden'>
            <NEOCard neoData={astroid} />
            <AsteroidField number={90} />
        </div>
    )
}
