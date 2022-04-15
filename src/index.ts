import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import * as dat from 'dat.gui';

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 4

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
const controls = new OrbitControls(camera, renderer.domElement)

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader()
const colorTexture = textureLoader.load('./color.jpg')
const alphaTexture = textureLoader.load('./alpha.jpg')
const ambientOcclusionTexture = textureLoader.load('./ambientOcclusion.jpg')

const gradientTexture = textureLoader.load('./gradients/3.jpg')
const matcapTexture = textureLoader.load('./matcaps/8.png')
const displacementTexture = textureLoader.load('./height.jpg')

// const material = new THREE.MeshBasicMaterial()
// material.map = colorTexture
// material.transparent = true
// material.alphaMap = alphaTexture
// material.side = THREE.DoubleSide
// material.color = new THREE.Color(0x44ff00)
// material.wireframe = true
// material.opacity = 0.5

// Use to debug normals
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// Use to simulate light, shadow at a low cost, without having light in the seen (clay render)
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture

// Lambert is performant, but has artefacts
// const material = new THREE.MeshLambertMaterial()

// Phong is less performant then Lambert, but has better visuals
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 1000
// material.specular = new THREE.Color(0x00ff00)

// Better algoritm then Lambert or Phong
const material = new THREE.MeshStandardMaterial()
material.map = colorTexture
material.aoMap = ambientOcclusionTexture
material.aoMapIntensity = 1
material.metalness = .45
material.roughness = 0.1
material.displacementMap = displacementTexture
material.displacementScale = .05

const sphereMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(.5, 16, 16), material)

// Duplicate the UV coords to a new uv channel to use with the aoMap
sphereMesh.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphereMesh.geometry.attributes.uv.array, 2)
)

const planeMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1, 100, 100), material)

// Duplicate the UV coords to a new uv channel to use with the aoMap
planeMesh.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(planeMesh.geometry.attributes.uv.array, 2)
)
planeMesh.position.x = -1.5

const torusMesh = new THREE.Mesh(new THREE.TorusBufferGeometry(.4, .2, 16, 16), material)

// Duplicate the UV coords to a new uv channel to use with the aoMap
torusMesh.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torusMesh.geometry.attributes.uv.array, 2)
)

torusMesh.position.x = 1.5

scene.add(sphereMesh, planeMesh, torusMesh)

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, .5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Debug
 */
// Debug
const gui = new dat.GUI();
gui.add(material, 'metalness', 0, 1, .001)
gui.add(material, 'roughness', 0, 1, .001)
gui.add(material, 'aoMapIntensity', 0, 4, .001)

const clock = new THREE.Clock()
const tick = () => {

    // Update objects
    sphereMesh.rotation.y = 0.1 * clock.getElapsedTime()
    planeMesh.rotation.y = 0.1 * clock.getElapsedTime()
    torusMesh.rotation.y = 0.1 * clock.getElapsedTime()

    sphereMesh.rotation.x = 0.15 * clock.getElapsedTime()
    planeMesh.rotation.x = 0.15 * clock.getElapsedTime()
    torusMesh.rotation.x = 0.15 * clock.getElapsedTime()

    // Rest
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick()