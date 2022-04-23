import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as THREE from 'three'

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

// Cubes
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })

for (let i = 1; i < 5; i++) {
    let prevHeight = 0
    const distance = .6

    for (let j = 0; j < 4; j++) {
        // between 1 and 3, divided by 2 for scaling
        const height = (Math.round(1 + Math.random() * 2)) / 2
        const margin = j === 0 ? 0 : .2
        const y = prevHeight + (height / 2) + margin

        const cubeGeometry = new THREE.BoxBufferGeometry(1, height)
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cube.position.y = y
        cube.position.x = i < 3 ? distance : -distance
        cube.position.z = i > 1 && i < 4 ? -distance : distance
        scene.add(cube)
        
        prevHeight += height + margin
    }
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({color: 0xffffff})
)
floor.rotation.x = -Math.PI * .5
scene.add(floor)

// Lights
const dirLight = new THREE.DirectionalLight(0xffffff, 1)
const dirLightHelper = new THREE.DirectionalLightHelper(dirLight)
dirLight.position.set(-2, 10, 1)
scene.add(dirLight, dirLightHelper)

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.rotation.y = -Math.PI * .25
camera.position.x = -6
camera.position.y = 2.5
camera.position.z = 7

// Render
const canvas = document.querySelector('canvas.webgl') as HTMLElement
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Controls
const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)
// const controls = new OrbitControls(camera, renderer.domElement)

const tick = () => {
    // controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick()