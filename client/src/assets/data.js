import mercury from './mercury.jpg';
import venus from './venus.jpg';
import earthTexture from './map.jpg';
import mars from './mars.jpg';
import saturn from './saturn.jpg';
import jupiter from './jupiter.jpg';
import saturnRing from './saturnRing.png';
import uranus from './uranus.jpg';
import neptune from './naptun.jpg';
import nightTexturePath from './night.jpg'; // Night texture
import cloudsTexturePath from './clouds.jpg'; // Cloud texture
import moonTexturePath from './moon.jpg'; // Moon texture
import earth from './earth.jpeg';
import mercurry from './marcc.jpeg';
import jupback from './jupback.jpeg';
import venback from './vanusback.jpeg';
import marsback from './marsback.png';
import urnback from './urnaus.jpeg';
import nepback from './neptunn.jpeg';
import earthPic from './earth.png';
import venusPic from './venus.png';
import mercuryPic from './mecury.png';
import marsPic from './mars.png';
import jupiterPic from './jupiter.png';
import netunPic from './neptun.png';
import UrnusPic from './uran.png';
import sun from './sun.jpg'

const planets = [
    {
        name: "Mercury",
        diameter: 4879, // in kilometers
        texture: sun,
        background: mercurry,
        description: "Mercury is the closest planet to the Sun and the smallest in the Solar System.",
        uniqueFeatures: [
            "Extreme temperature fluctuations.",
            "No atmosphere to speak of.",
            "Has a very thin atmosphere."
        ],
        planetPic: mercuryPic,
        earthSize: 1, // Relative size to Earth
        moonCount: 0,
        rotationalSpeed: 0.004, // Speed in Earth days for a full rotation
        glowcolor: 0xAAAAAA,
        nightTexturePath: '',
        cloudsTexturePath: '',
        saturnring: null,
        moonTexturePath: moonTexturePath,
        surfaceArea: "74.8 million km²",
        waterCoverage: "None",
        ecosystems: "No known ecosystems due to extreme conditions.",
        speciesCount: "0",
        asteroids: [] // No known asteroids associated
    },
    {
        name: "Venus",
        diameter: 12104, // in kilometers
        texture: venus,
        background: venback,
        description: "Venus is the second planet from the Sun and is similar in structure to Earth.",
        uniqueFeatures: [
            "Hottest planet in the Solar System.",
            "Thick, toxic atmosphere.",
            "Rotates backward compared to other planets."
        ],
        planetPic: venusPic,
        earthSize: 1,
        moonCount: 0,
        rotationalSpeed: 0.004,
        glowcolor: '',
        nightTexturePath: '',
        cloudsTexturePath: '',
        saturnring: null,
        moonTexturePath: moonTexturePath,
        surfaceArea: "460.2 million km²",
        waterCoverage: "None",
        ecosystems: "No known ecosystems due to harsh conditions.",
        speciesCount: "0",
        asteroids: [] // No known asteroids associated
    },
    {
        name: "Earth",
        diameter: 12742, // in kilometers
        texture: earthTexture,
        background: earth,
        description: `Earth, our vibrant home, is the third planet from the Sun and the only astronomical object known to harbor life.
                Covering a vast expanse of 510 million square kilometers, it is a marvel of nature.`,
        uniqueFeatures: [
            "71% of the surface covered by water.",
            "Diverse ecosystems and climates.",
            "One natural satellite: the Moon."
        ],
        planetPic: earthPic,
        earthSize: 1.0,
        moonCount: 1,
        rotationalSpeed: 0.001,
        glowcolor: 0x87CEEB,
        nightTexturePath: nightTexturePath,
        cloudsTexturePath: cloudsTexturePath,
        saturnring: null,
        moonTexturePath: moonTexturePath,
        surfaceArea: "510 million km²",
        waterCoverage: "71%",
        ecosystems: "Home to diverse ecosystems including forests, deserts, and oceans.",
        speciesCount: "Over 8.7 million species",
        moon: [{
            name: "Moon",
            diameter: 3474.8, // in kilometers
            surfaceArea: "38 million km²",
            uniqueFeatures: [
                "Only natural satellite of Earth.",
                "Has a synchronous rotation with Earth."
            ],
            ecosystems: "No known ecosystems.",
            speciesCount: "0"
        }],
        asteroids: [] // No known asteroids associated
    },
    {
        name: "Mars",
        diameter: 6779, // in kilometers
        texture: mars,
        background: marsback,
        description: "Mars is the fourth planet from the Sun, known for its red color due to iron oxide.",
        uniqueFeatures: [
            "Home to the largest volcano in the Solar System (Olympus Mons).",
            "Has two small moons: Phobos and Deimos."
        ],
        planetPic: marsPic,
        earthSize: 1,
        moonCount: 2,
        rotationalSpeed: 0.002,
        glowcolor: '',
        nightTexturePath: '',
        cloudsTexturePath: '',
        saturnring: null,
        moonTexturePath: moonTexturePath,
        surfaceArea: "144.8 million km²",
        waterCoverage: "Evidence of water in polar ice caps.",
        ecosystems: "Potential for microbial life; past evidence of liquid water.",
        speciesCount: "0 (no known life forms)",
        moon: [
            {
                name: "Phobos",
                diameter: 22.4, // in kilometers
                surfaceArea: "0.003 million km²",
                uniqueFeatures: [
                    "Larger and closer of Mars' two moons.",
                    "Has a very irregular shape."
                ],
                ecosystems: "No known ecosystems.",
                speciesCount: "0"
            },
            {
                name: "Deimos",
                diameter: 12.4, // in kilometers
                surfaceArea: "0.001 million km²",
                uniqueFeatures: [
                    "Smaller and more distant moon of Mars.",
                    "Also has an irregular shape."
                ],
                ecosystems: "No known ecosystems.",
                speciesCount: "0"
            }
        ],
        asteroids: [] // No known asteroids associated
    },
    {
        name: "Jupiter",
        diameter: 139820, // in kilometers
        texture: jupiter,
        background: jupback,
        description: "Jupiter is the largest planet in the Solar System, known for its Great Red Spot.",
        uniqueFeatures: [
            "Has a massive storm system.",
            "More than 79 moons, including Ganymede, the largest moon in the Solar System."
        ],
        planetPic: jupiterPic,
        earthSize: 1,
        moonCount: 1,
        rotationalSpeed: 0.001,
        glowcolor: '',
        nightTexturePath: '',
        cloudsTexturePath: '',
        saturnring: null,
        moonTexturePath: moonTexturePath,
        surfaceArea: "61.4 million km²",
        waterCoverage: "Trace amounts of water vapor in the atmosphere.",
        ecosystems: "No known ecosystems; primarily gaseous.",
        speciesCount: "0",
        asteroid: [
            {
                name: "Asteroid Belt",
                diameter: "Varies",
                uniqueFeatures: [
                    "Contains numerous small bodies.",
                    "Believed to be remnants from the early solar system."
                ],
                ecosystems: "No known ecosystems.",
                speciesCount: "0"
            }
        ]
    },
    {
        name: "Saturn",
        diameter: 116460, // in kilometers
        texture: saturn,
        background: earth,
        description: "Saturn is known for its extensive ring system and is the second-largest planet in the Solar System.",
        uniqueFeatures: [
            "More than 80 moons, including Titan, which has a thick atmosphere.",
            "Its rings are made of ice and rock particles."
        ],
        planetPic: earthPic,
        earthSize: 1,
        moonCount: 3,
        rotationalSpeed: 0.004,
        glowcolor: null,
        nightTexturePath: '',
        cloudsTexturePath: '',
        saturnring: saturnRing,
        moonTexturePath: moonTexturePath,
        surfaceArea: "42.7 million km²",
        waterCoverage: "Trace amounts in atmosphere.",
        ecosystems: "No known ecosystems; primarily gaseous.",
        speciesCount: "0",
        asteroids: [] // No known asteroids associated
    },
    {
        name: "Uranus",
        diameter: 50724, // in kilometers
        texture: uranus,
        background: urnback,
        description: "Uranus is the seventh planet from the Sun and has a unique sideways rotation.",
        uniqueFeatures: [
            "Has a faint ring system.",
            "Rotates on its side, making its axial tilt about 98 degrees."
        ],
        planetPic: UrnusPic,
        earthSize: 1,
        moonCount: 2,
        rotationalSpeed: 0.002,
        glowcolor: '',
        nightTexturePath: '',
        cloudsTexturePath: '',
        saturnring: null,
        moonTexturePath: moonTexturePath,
        surfaceArea: "8.1 million km²",
        waterCoverage: "Trace amounts in atmosphere.",
        ecosystems: "No known ecosystems; primarily gaseous.",
        speciesCount: "0",
        asteroids: [] // No known asteroids associated
    },
    {
        name: "Neptune",
        diameter: 49244, // in kilometers
        texture: neptune,
        background: nepback,
        description: "Neptune is the eighth and farthest planet from the Sun, known for its deep blue color.",
        uniqueFeatures: [
            "Has the strongest winds in the Solar System.",
            "More than 14 moons, with Triton being the largest."
        ],
        planetPic: netunPic,
        earthSize: 1,
        moonCount: 1,
        rotationalSpeed: 0.001,
        glowcolor: '',
        nightTexturePath: '',
        cloudsTexturePath: '',
        saturnring: null,
        moonTexturePath: moonTexturePath,
        surfaceArea: "7.6 million km²",
        waterCoverage: "Trace amounts in atmosphere.",
        ecosystems: "No known ecosystems; primarily gaseous.",
        speciesCount: "0",
        asteroids: [] // No known asteroids associated
    }
];

export default planets;
