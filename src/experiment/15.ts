import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import './style.css'

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(3, 3.5, 3)

/**
 * Rendered
 * Limit pixel ratio to 2, more can cause performance issues on high pixel-ratio devices
 */
const canvas = document.querySelector('canvas.webgl') as HTMLElement
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const scene = new THREE.Scene()

const controls = new OrbitControls(camera, renderer.domElement)

// const textureLoader = new THREE.TextureLoader()
// const matcapTexture = textureLoader.load('./matcaps/01.png')

/**
 * Font Loader
 * 
 * We have to use the callback from the load method, can't assign to a var
 */
const textGroup = new THREE.Group()
scene.add(textGroup)

const fontLoader = new FontLoader();
fontLoader.load(
    './fonts/helvetiker_regular.typeface.json',
    (font) => {
        const text1geometry = new TextGeometry('1', {
            font,
            size: .5,
            height: .35,
            curveSegments: 6,
            bevelEnabled: false,
            bevelSize: .02,
            bevelThickness: .03,
            bevelSegments: 4
        })
        text1geometry.center()
        const text1 = new THREE.Mesh(
            text1geometry,
            new THREE.MeshStandardMaterial({ color: '#ff4400' })
        )

        const text2geometry = new TextGeometry('5', {
            font,
            size: .7,
            height: .45,
            curveSegments: 6,
            bevelEnabled: false,
            bevelSize: .02,
            bevelThickness: .03,
            bevelSegments: 4
        })
        text2geometry.center()
        const text2 = new THREE.Mesh(
            text2geometry,
            new THREE.MeshStandardMaterial({ color: '#ff4400' })
        )
        text2.rotateX(-Math.PI * .5)
        text2.rotateZ(Math.PI * .5)
        text2.position.set(.5, 0, 0)

        text1.castShadow = true
        text2.castShadow = true

        textGroup.add(text1, text2)
    }
)

/**
 * Meshes
 */
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1.25, 10, 1, 1),
    new THREE.MeshStandardMaterial({ color: 'blue' })
)
plane.rotation.x = -Math.PI * .5
plane.rotation.z = Math.PI * .5
// plane.receiveShadow = true
// scene.add(plane)

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, .3)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight(0xffffff, .9)
dirLight.position.x = textGroup.position.x - 1
dirLight.position.z = textGroup.position.z + .5
dirLight.position.y = 2
dirLight.castShadow = true

const dirLightHelper = new THREE.DirectionalLightHelper(dirLight)
scene.add(dirLight, dirLightHelper)

const frontDirLight = new THREE.DirectionalLight(0xffffff, .4)
frontDirLight.position.x = textGroup.position.x
frontDirLight.position.z = -4
frontDirLight.position.y = 2
frontDirLight.castShadow = true
frontDirLight.shadow.camera.far = 10

scene.add(frontDirLight, new THREE.DirectionalLightHelper(frontDirLight), new THREE.CameraHelper(frontDirLight.shadow.camera))

const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick()