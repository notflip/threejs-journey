import * as THREE from 'three'
import * as dat from 'dat.gui';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import './style.css'

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(3, 2, 5)

/**
 * Rendered
 * 
 * Limit pixel ratio to 2, more can cause performance issues on high pixel-ratio devices
 */
const canvas = document.querySelector('canvas.webgl') as HTMLElement
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

const controls = new OrbitControls(camera, renderer.domElement)
const gui = new dat.GUI();

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('./matcaps/01.png')

/**
 * Font Loader
 * 
 * We have to use the callback from the load method, can't assign to a var
 */
const fontLoader = new FontLoader();
fontLoader.load(
    './fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry('Sarah + Miguel', {
            font,
            size: .5,
            height: .1,
            curveSegments: 6,
            bevelEnabled: true,
            bevelSize: .02,
            bevelThickness: .03,
            bevelSegments: 4
        })

        // Use the bounding box to center the object, the manual way
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     -textGeometry.boundingBox!.max.x * .5,
        //     -textGeometry.boundingBox!.max.y * .5,
        //     -textGeometry.boundingBox!.max.z * .5,
        // )

        // the easier way to achieve the above
        textGeometry.center()

        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
        const textMesh = new THREE.Mesh(textGeometry, material)
        scene.add(textMesh)


        const donutGeometry = new THREE.TorusBufferGeometry(.3, .1, 12, 32)

        for(let i = 0; i < 200; i++) {
            const donut = new THREE.Mesh(donutGeometry, material)

            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }
    }
)

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, .5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = -1 // to the left
pointLight.position.y = 5 // up
pointLight.position.z = 5 // closer to the camera
scene.add(pointLight)


const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick()