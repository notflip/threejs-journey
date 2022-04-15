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
 * Rendered
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


// Helpers
scene.add(new THREE.AxesHelper(10))
const controls = new OrbitControls(camera, renderer.domElement)

// Canvas
const textureCanvasWidth = 512;
const textureCanvasHeight = 512;

const textureCanvas = document.createElement('canvas');
textureCanvas.width = textureCanvasWidth
textureCanvas.height = textureCanvasHeight

const context = textureCanvas.getContext('2d') as CanvasRenderingContext2D;
context.font = '48px Helvetica';
context.fillStyle = 'red';
context.fillRect(0, 0, textureCanvasWidth, textureCanvasHeight)
context.fillStyle = 'white';
context.fillText('Hello World', textureCanvasWidth / 2, textureCanvasHeight / 2);

const texture = new THREE.CanvasTexture(textureCanvas)

const rightMaterial = new THREE.MeshBasicMaterial({ color: 'red' })

const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(4, 24, 18, 1),
    [
        rightMaterial,
        new THREE.MeshBasicMaterial({ map: texture }), // left side
        new THREE.MeshBasicMaterial({ color: 'blue' }),
        new THREE.MeshBasicMaterial({ color: 'green' }),
        new THREE.MeshBasicMaterial({ color: 'purple' }),
        new THREE.MeshBasicMaterial({ color: 'yellow' }),
    ]);

mesh.rotation.y = 0.5;

const books = new THREE.Group()
books.add(mesh)

scene.add(books);

// Debug
const gui = new dat.GUI();

gui.add(mesh.position, 'x', -3, 3, .01).name('X Position')
gui.addColor({param: 0xff0000}, 'param').onChange(value => {
    rightMaterial.color.set(value)
})

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);

}

animate()