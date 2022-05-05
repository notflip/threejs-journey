import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import * as dat from 'dat.gui';

const gui = new dat.GUI();

/**
 * Textures
 */
const tl = new THREE.TextureLoader()
const particleTexture = tl.load('./particles/circle_02.png')

/**
 * Scene
 */
const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(10))

/**
 * Particle Geometry
 */
const particleGeometry = new THREE.BufferGeometry()

const count = 5000
const vertices = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

// Fill the array with random x, y and z values in one dimension (x,y,z,x,y,z,x,y,z)
for (let i = 0; i < count; i++) {
    // Value between -5 and 5
    vertices[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particleGeometry.setAttribute('position',new THREE.BufferAttribute(vertices, 3))
particleGeometry.setAttribute('color',new THREE.BufferAttribute(colors, 3))

const particleMaterial = new THREE.PointsMaterial({
    size: .2,
    sizeAttenuation: true,
    transparent: true,
    
    alphaMap: particleTexture,
    // alphaTest: .001, // don't render the black part, fixes z issue's with particles, the gpu doesnt know what is in front or back
    // depthTest: true // this causes issue's when there's other object or particles with another color
    depthWrite: false, // this is a good solution, but be on the lookout for bugs, try all of the above (1 of the 3)

    // blending: THREE.AdditiveBlending, !! this will impact performance, it adds the color to the particle behind it.
    vertexColors: true
})

const particle = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particle)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 4

/**
* Renderer
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

const controls = new OrbitControls(camera, renderer.domElement)

/**
 * Tick
 */
const clock = new THREE.Clock()
const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    /**
     * Updated each particle in the array attribute is VERY BAD FOR PERFORMANCE
     */

    // affect each particle's Z axis to create a wave (so each 3th value in the 1-d array)
    for(let i = 0; i < count; i++) {
        const i3 = i * 3
        
        const x = particleGeometry.attributes.position.getX(i * 3)
        const sin = Math.sin(elapsedTime + x)
        
        particleGeometry.attributes.position.setY(i3, sin)
    }

    particleGeometry.attributes.position.needsUpdate = true

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick()