import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui';

import './style.css'

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color().setHex(0xeeeeee)

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 40

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

// Texture
const image = new Image()
const texture = new THREE.Texture(image)

image.onload = () => {
    texture.needsUpdate = true
}

image.src = './door.jpg'

// Material
const material = new THREE.MeshBasicMaterial({map: texture})
const geometry = new THREE.PlaneBufferGeometry(4,4,1,1)
const mesh = new THREE.Mesh(geometry, material)

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