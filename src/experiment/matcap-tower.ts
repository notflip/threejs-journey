import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as THREE from 'three'

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('./matcaps/01.png')

// Cubes
const cubeMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture
})

const cubes = new THREE.Group()
scene.add(cubes)

const scale = .4
const distance = .6

for (let i = 1; i < 5; i++) {
    let prevHeight = 0

    for (let j = 0; j < 4; j++) {
        // between 1 and 3, divided by 2 for scaling
        const height = (Math.round(1 + Math.random() * 2)) * scale
        const margin = j === 0 ? 0 : .2
        const y = prevHeight + (height / 2) + margin

        const cubeGeometry = new THREE.BoxBufferGeometry(1, height)
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cube.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(cube.geometry.attributes.uv.array, 2))
        cube.position.y = y
        cube.position.x = i < 3 ? distance : -distance
        cube.position.z = i > 1 && i < 4 ? -distance : distance
        cubes.add(cube)
        
        prevHeight += height + margin
    }
}

// Lights
const aLight = new THREE.AmbientLight('#fff',  .12)
scene.add(aLight)

const dirLight = new THREE.DirectionalLight(0xffffff, .5)
const dirLightHelper = new THREE.DirectionalLightHelper(dirLight)
dirLight.position.set(0, 6, 4)
scene.add(dirLight, dirLightHelper)

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.rotation.y = -Math.PI * .25
camera.position.x = -3.5
camera.position.y = 2.5
camera.position.z = 4

// Render
const canvas = document.querySelector('canvas.webgl') as HTMLElement
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#eee')

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

dirLight.castShadow = true
dirLight.shadow.mapSize = new THREE.Vector2(128,128)

for(const cube of cubes.children) {
    cube.castShadow = true
    cube.receiveShadow = true
}

// Controls
// const controls = new OrbitControls(camera, renderer.domElement)

const clock = new THREE.Clock()
const tick = () => {
    // controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick()