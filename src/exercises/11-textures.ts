import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import './style.css'

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color().setHex(0xeeeeee)

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 10

/**
 * Renderer
 * 
 * Limit pixel ratio to 2, more can cause performance issues on high pixel-ratio devices
 */
const canvas = document.querySelector('canvas.webgl') as HTMLElement
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Loading Manager
const loader = new THREE.LoadingManager()
loader.onProgress = () => {
    console.log('progressing..')
}

// Texture Loader
const textureLoader = new THREE.TextureLoader(loader)
const colorTexture = textureLoader.load('./color.jpg')

// We don't need mipmaps when we use the minFilter
// colorTexture.generateMipmaps = false
// colorTexture.minFilter = THREE.NearestFilter
// colorTexture.magFiter = THREE.NearestFilter

// colorTexture.repeat.x = 2
// colorTexture.offset.x = .5
// colorTexture.wrapS = THREE.RepeatWrapping

// Change pivot point to center, to rotate around the center
// colorTexture.center.set(0.5, 0.5)
// colorTexture.rotation = Math.PI / 4

const alphaTexture = textureLoader.load('./alpha.jpg')
const ambientOcclusionTexture = textureLoader.load('./ambientOcclusion.jpg')
const heightTexture = textureLoader.load('./height.jpg')
const metalnessTexture = textureLoader.load('./metalness.jpg')
const normalTexture = textureLoader.load('./normal.jpg')
const roughnessTexture = textureLoader.load('./roughness.jpg')

// Material
const material = new THREE.MeshBasicMaterial({ map: colorTexture })

// Geometry Mesh
const geometry = new THREE.BoxBufferGeometry(4, 4, 4, 4)
const mesh = new THREE.Mesh(geometry, material)
mesh.rotation.set(0, 1, 0)

// Helpers
scene.add(new THREE.AxesHelper(10))
const controls = new OrbitControls(camera, renderer.domElement)

scene.add(mesh)

// Render
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate()