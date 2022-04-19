import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import * as dat from 'dat.gui';

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 12
camera.position.y = 2

/**
 * Renderer
 * Limit pixel ratio to 2, more can cause performance issues on high pixel-ratio devices
 */
const canvas = document.querySelector('canvas.webgl') as HTMLElement
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Renderer shadowMap
renderer.shadowMap.enabled = true

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const scene = new THREE.Scene()
const controls = new OrbitControls(camera, renderer.domElement)

/**
 * Meshes
 */
const sphereMesh = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
)

sphereMesh.castShadow = true

/**
 * Directional Light
 */
const directionalLight = new THREE.DirectionalLight(0xff4444, 1)
directionalLight.position.set(3, 2, 3)

// Shadow
directionalLight.castShadow = true
directionalLight.shadow.mapSize = new THREE.Vector2(512, 512)
directionalLight.shadow.camera.near = 2
directionalLight.shadow.camera.far = 12

// The shadow crispness will increase if we match the size to the shadow, because our 512x512 resolution now has less pictures it needs to work with
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2

// blur
// directionalLight.shadow.radius = 10

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false

// scene.add(directionalLight, directionalLightCameraHelper)

/**
 * Spotlight
 * 
 * there is an issue with the shadow.near, shadow.fov not working
 */
const spotlight = new THREE.SpotLight(0xffffff, 0.5, 10, Math.PI * .3)
spotlight.position.set(1, 5, 2)

spotlight.castShadow = true
spotlight.shadow.mapSize = new THREE.Vector2(512, 512)
spotlight.shadow.camera.near = 2

const spotlightCameraHelper = new THREE.CameraHelper(spotlight.shadow.camera)
// scene.add(spotlight, spotlightCameraHelper)

/**
 * Pointlight
 * 
 * the spotlight uses 6 shadow maps (in each direction) so is heavy for performance
 */
const pointlight = new THREE.PointLight(0xffffff, .8)
pointlight.position.set(2, 4, 0)
pointlight.castShadow = true

pointlight.shadow.mapSize.width = 512
pointlight.shadow.mapSize.height = 512
pointlight.shadow.camera.near = 1
pointlight.shadow.camera.far = 10


const pointlightCameraHelper = new THREE.CameraHelper(pointlight.shadow.camera)
pointlightCameraHelper.visible = false

// scene.add(pointlight, pointlightCameraHelper)

/**
 * Baking
 */

renderer.shadowMap.enabled = false

const textureLoader = new THREE.TextureLoader()
const simpleShadowTexture = textureLoader.load('./simpleShadow.jpg')
const material = new THREE.MeshStandardMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadowTexture
})

const planeMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10, 1, 1), new THREE.MeshBasicMaterial())
planeMesh.receiveShadow = true
planeMesh.position.y = -1
planeMesh.rotation.x = -Math.PI * 0.5

const planeShadowMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(3, 3, 1, 1), material)
planeShadowMesh.position.y = planeMesh.position.y + 0.001
planeShadowMesh.rotation.x = -Math.PI * 0.5

scene.add(planeMesh, planeShadowMesh, sphereMesh)
scene.add(new THREE.AmbientLight(0xffffff, .8))

/**
 * Others
 */
const clock = new THREE.Clock()

const tick = () => {
    
    const elapsedTime = clock.getElapsedTime()

    sphereMesh.position.x = Math.cos(elapsedTime) * 1.5
    sphereMesh.position.z = Math.sin(elapsedTime) * 1.5
    sphereMesh.position.y = Math.abs(Math.sin(elapsedTime)) * 3

    planeShadowMesh.position.x = sphereMesh.position.x
    planeShadowMesh.position.z = sphereMesh.position.z
    planeShadowMesh.material.opacity = (3 - sphereMesh.position.y) * .2

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick()