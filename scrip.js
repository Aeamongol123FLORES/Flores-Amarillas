
import * as THREE from "three";

import {
    OrbitControls
} from "three/addons/controls/OrbitControls.js";

/* =====================================
   ESCENA PRINCIPAL
===================================== */

const container = document.getElementById(
    "scene-container"
);

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
);

camera.position.set(0, 140, 420);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

container.appendChild(
    renderer.domElement
);

/* =====================================
   CONTROLES DE CÁMARA
===================================== */

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.minDistance = 80;
controls.maxDistance = 800;

controls.target.set(0, 0, 0);

/* =====================================
   ILUMINACIÓN
===================================== */

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        3
    )
);

const luzPrincipal = new THREE.PointLight(
    0xffcc33,
    18,
    900
);

luzPrincipal.position.set(
    0,
    100,
    150
);

scene.add(luzPrincipal);

/* =====================================
   GRUPO DE LA GALAXIA
===================================== */

const galaxia = new THREE.Group();

scene.add(galaxia);

const objetosInteractivos = [];

/* =====================================
   ESTRELLAS DEL ESPACIO
===================================== */

function crearEstrellas() {

    const cantidad = 7000;

    const posiciones = new Float32Array(
        cantidad * 3
    );

    for (let i = 0; i < cantidad; i++) {

        const radio =
            350 + Math.random() * 900;

        const angulo =
            Math.random() * Math.PI * 2;

        posiciones[i * 3] =
            Math.cos(angulo) * radio;

        posiciones[i * 3 + 1] =
            (Math.random() - 0.5) * 650;

        posiciones[i * 3 + 2] =
            Math.sin(angulo) * radio;
    }

    const geometria =
        new THREE.BufferGeometry();

    geometria.setAttribute(
        "position",
        new THREE.BufferAttribute(
            posiciones,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2.3,
            transparent: true,
            opacity: 1,
            sizeAttenuation: true
        });

    const estrellas =
        new THREE.Points(
            geometria,
            material
        );

    scene.add(estrellas);

    return estrellas;
}

const estrellas = crearEstrellas();

/* =====================================
   ESTRELLAS DE LA GALAXIA
===================================== */

function crearEstrellasGalaxia() {

    const cantidad = 4000;

    const posiciones = new Float32Array(
        cantidad * 3
    );

    for (let i = 0; i < cantidad; i++) {

        const angulo =
            Math.random() * Math.PI * 2;

        const radio =
            40 + Math.random() * 260;

        posiciones[i * 3] =
            Math.cos(angulo) * radio;

        posiciones[i * 3 + 1] =
            (Math.random() - 0.5) * 35;

        posiciones[i * 3 + 2] =
            Math.sin(angulo) * radio;
    }

    const geometria =
        new THREE.BufferGeometry();

    geometria.setAttribute(
        "position",
        new THREE.BufferAttribute(
            posiciones,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({
            color: 0xffd52f,
            size: 2.5,
            transparent: true,
            opacity: 1
        });

    const puntos =
        new THREE.Points(
            geometria,
            material
        );

    galaxia.add(puntos);

    return puntos;
}

const estrellasGalaxia =
    crearEstrellasGalaxia();

/* =====================================
   CENTRO DE LA GALAXIA
===================================== */

const centro =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            45,
            32,
            32
        ),
        new THREE.MeshBasicMaterial({
            color: 0x050201
        })
    );

centro.position.y = 8;

galaxia.add(centro);

const luzCentro =
    new THREE.PointLight(
        0xffb900,
        25,
        250
    );

luzCentro.position.set(
    0,
    10,
    0
);

galaxia.add(luzCentro);

/* =====================================
   ANILLOS LUMINOSOS
===================================== */

const anillos = [];

function crearAnillo(
    radio,
    grosor,
    opacidad
) {

    const geometria =
        new THREE.TorusGeometry(
            radio,
            grosor,
            12,
            160
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0xffdf25,
            transparent: true,
            opacity: opacidad
        });

    const anillo =
        new THREE.Mesh(
            geometria,
            material
        );

    anillo.rotation.x =
        Math.PI / 2.15;

    anillo.position.y = 3;

    galaxia.add(anillo);

    anillos.push(anillo);

    return anillo;
}

crearAnillo(65, 2.5, 1);
crearAnillo(90, 2, 0.85);
crearAnillo(120, 1.5, 0.7);
crearAnillo(155, 1, 0.55);
crearAnillo(195, 0.7, 0.4);
crearAnillo(235, 0.45, 0.25);

/* =====================================
   MATERIALES DE LAS FLORES
===================================== */

const materialPetalo =
    new THREE.MeshBasicMaterial({
        color: 0xffd21f,
        side: THREE.DoubleSide
    });

const materialCentro =
    new THREE.MeshBasicMaterial({
        color: 0x5b2c00
    });

const materialTallo =
    new THREE.MeshBasicMaterial({
        color: 0x2f8a27
    });

const materialHoja =
    new THREE.MeshBasicMaterial({
        color: 0x4f9b32,
        side: THREE.DoubleSide
    });

/* =====================================
   CREAR UNA FLOR
===================================== */

function crearFlor(tamano = 1) {

    const flor = new THREE.Group();

    flor.userData.tipo = "flor";

    for (let i = 0; i < 16; i++) {

        const angulo =
            (i / 16) * Math.PI * 2;

        const petalo =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    1,
                    12,
                    8
                ),
                materialPetalo
            );

        petalo.scale.set(
            0.65 * tamano,
            0.2 * tamano,
            1.5 * tamano
        );

        petalo.position.set(
            Math.cos(angulo) *
                1.35 *
                tamano,

            0,

            Math.sin(angulo) *
                1.35 *
                tamano
        );

        petalo.rotation.y =
            -angulo;

        flor.add(petalo);
    }

    const centroFlor =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.85 * tamano,
                20,
                20
            ),
            materialCentro
        );

    centroFlor.position.y = 0.2;

    flor.add(centroFlor);

    const tallo =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.09 * tamano,
                0.14 * tamano,
                3.8 * tamano,
                8
            ),
            materialTallo
        );

    tallo.position.y =
        -2.1 * tamano;

    flor.add(tallo);

    for (let i = 0; i < 2; i++) {

        const hoja =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.8 * tamano,
                    10,
                    8
                ),
                materialHoja
            );

        hoja.scale.set(
            1.6,
            0.18,
            0.6
        );

        hoja.position.set(
            i === 0
                ? 0.6 * tamano
                : -0.6 * tamano,

            -2.1 * tamano,

            0
        );

        hoja.rotation.z =
            i === 0
                ? -0.5
                : 0.5;

        flor.add(hoja);
    }

    return flor;
}

/* =====================================
   CREAR UN RAMO
===================================== */

function crearRamo(tamano = 1) {

    const ramo = new THREE.Group();

    ramo.userData.tipo = "ramo";

    const papel =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                3.5 * tamano,
                6 * tamano,
                4
            ),
            new THREE.MeshBasicMaterial({
                color: 0x302015
            })
        );

    papel.position.y =
        -3.2 * tamano;

    papel.rotation.y =
        Math.PI / 4;

    ramo.add(papel);

    const posiciones = [
        [-1.5, 0.5, 0],
        [1.5, 0.5, 0],
        [0, 1.8, 0],
        [-0.7, 0.8, 0.9],
        [0.7, 0.8, 0.9]
    ];

    posiciones.forEach((posicion) => {

        const flor =
            crearFlor(
                tamano * 0.85
            );

        flor.position.set(
            posicion[0] * tamano,
            posicion[1] * tamano,
            posicion[2] * tamano
        );

        ramo.add(flor);
    });

    const cinta =
        new THREE.Mesh(
            new THREE.TorusGeometry(
                1.4 * tamano,
                0.15 * tamano,
                8,
                30
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffd22b
            })
        );

    cinta.rotation.x =
        Math.PI / 2;

    cinta.position.y =
        -3.2 * tamano;

    ramo.add(cinta);

    return ramo;
}

/* =====================================
   MENSAJES
===================================== */

const mensajes = [
    "Eres pura alegría 💛",
    "Que nunca te falten motivos para sonreír",
    "Tu sonrisa ilumina mi universo",
    "La vida es más bonita con flores",
    "Mereces todo lo bonito del mundo",
    "Que tus sueños siempre florezcan",
    "Eres una persona muy especial",
    "Gracias por existir y ser tú",
    "Que tus días estén llenos de luz",
    "Siempre habrá motivos para sonreír"
];

/* =====================================
   FLORES Y RAMOS EN ESPIRAL
===================================== */

function crearFloresUniverso() {

    const cantidad = 85;

    for (let i = 0; i < cantidad; i++) {

        const angulo =
            i * 0.48;

        const radio =
            100 + (i % 10) * 19;

        const x =
            Math.cos(angulo) * radio;

        const z =
            Math.sin(angulo) * radio;

        const y =
            (Math.random() - 0.5) * 150;

        const esRamo =
            i % 8 === 0 ||
            i % 13 === 0;

        let objeto;

        if (esRamo) {

            objeto =
                crearRamo(
                    1 + Math.random() * 0.4
                );

            objeto.userData.tipo =
                "ramo";

            objeto.userData.mensaje =
                "Este ramo lleva un deseo especial: que tu vida esté llena de felicidad, luz y momentos hermosos. 💐💛";

        } else {

            objeto =
                crearFlor(
                    0.8 + Math.random() * 0.65
                );

            objeto.userData.tipo =
                "flor";

            objeto.userData.mensaje =
                mensajes[
                    Math.floor(
                        Math.random() *
                        mensajes.length
                    )
                ];
        }

        objeto.position.set(
            x,
            y,
            z
        );

        objeto.rotation.set(
            Math.random() * 0.7,
            Math.random() * Math.PI * 2,
            Math.random() * 0.7
        );

        objeto.userData.clickable =
            true;

        galaxia.add(objeto);

        objetosInteractivos.push(
            objeto
        );
    }
}

crearFloresUniverso();

/* =====================================
   PÉTALOS FLOTANTES
===================================== */

function crearPetalos() {

    const grupo =
        new THREE.Group();

    for (let i = 0; i < 250; i++) {

        const petalo =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    1.2,
                    8,
                    6
                ),
                new THREE.MeshBasicMaterial({
                    color: 0xffd21f
                })
            );

        petalo.scale.set(
            0.5,
            0.12,
            1.5
        );

        petalo.position.set(
            (Math.random() - 0.5) * 800,
            (Math.random() - 0.5) * 500,
            (Math.random() - 0.5) * 800
        );

        petalo.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        grupo.add(petalo);
    }

    scene.add(grupo);

    return grupo;
}

const petalos =
    crearPetalos();

/* =====================================
   SISTEMA DE CARTA
===================================== */

const raycaster =
    new THREE.Raycaster();

const mouse =
    new THREE.Vector2();

const carta =
    document.getElementById(
        "carta-contenedor"
    );

const tituloCarta =
    document.getElementById(
        "titulo-carta"
    );

const textoCarta =
    document.getElementById(
        "texto-carta"
    );

const cerrarCarta =
    document.getElementById(
        "cerrar-carta"
    );

const mensajeFlotante =
    document.getElementById(
        "mensaje-flotante"
    );

function abrirCarta(objeto) {

    const esRamo =
        objeto.userData.tipo === "ramo";

    tituloCarta.textContent =
        esRamo
            ? "Un ramo para ti 💐"
            : "Una flor para ti 🌻";

    textoCarta.textContent =
        objeto.userData.mensaje;

    carta.classList.add(
        "visible"
    );

    mensajeFlotante.textContent =
        "Mensaje especial para ti 💛";
}

function cerrarCartaFuncion() {

    carta.classList.remove(
        "visible"
    );
}

cerrarCarta.addEventListener(
    "click",
    cerrarCartaFuncion
);

carta.addEventListener(
    "click",
    (evento) => {

        if (
            evento.target === carta
        ) {
            cerrarCartaFuncion();
        }
    }
);

/* =====================================
   DETECTAR CLIC EN FLORES
===================================== */

renderer.domElement.addEventListener(
    "pointerdown",
    (evento) => {

        mouse.x =
            (evento.clientX /
                window.innerWidth) *
                2 - 1;

        mouse.y =
            -(evento.clientY /
                window.innerHeight) *
                2 + 1;

        raycaster.setFromCamera(
            mouse,
            camera
        );

        const intersecciones =
            raycaster.intersectObjects(
                objetosInteractivos,
                true
            );

        if (
            intersecciones.length === 0
        ) {
            return;
        }

        let objeto =
            intersecciones[0].object;

        while (
            objeto.parent &&
            !objetosInteractivos.includes(
                objeto
            )
        ) {
            objeto =
                objeto.parent;
        }

        if (
            objetosInteractivos.includes(
                objeto
            )
        ) {
            abrirCarta(objeto);
        }
    }
);

/* =====================================
   ANIMACIÓN
===================================== */

const reloj =
    new THREE.Clock();

function animar() {

    requestAnimationFrame(
        animar
    );

    const tiempo =
        reloj.getElapsedTime();

    galaxia.rotation.y =
        tiempo * 0.035;

    galaxia.rotation.z =
        Math.sin(
            tiempo * 0.15
        ) * 0.04;

    estrellas.rotation.y =
        tiempo * 0.004;

    estrellasGalaxia.rotation.y =
        -tiempo * 0.02;

    anillos.forEach(
        (anillo, indice) => {

            anillo.rotation.z +=
                0.0008 +
                indice * 0.0002;
        }
    );

    petalos.children.forEach(
        (petalo, indice) => {

            petalo.rotation.x +=
                0.003;

            petalo.rotation.y +=
                0.005;

            petalo.position.y +=
                Math.sin(
                    tiempo * 0.5 +
                    indice
                ) * 0.003;
        }
    );

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animar();

/* =====================================
   CAMBIO DE TAMAÑO
===================================== */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);