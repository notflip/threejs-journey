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

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

const planeMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10, 4, 4), material)
planeMesh.rotation.x = -Math.PI * .5
planeMesh.position.y = -1

const cubeMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1, 4, 4, 4), material)

const sphereMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(.5, 16, 16), material)
sphereMesh.position.x = -1.5

const torusMesh = new THREE.Mesh(new THREE.TorusBufferGeometry(.4, .2, 16, 16), material)
torusMesh.position.x = 1.5

scene.add(planeMesh, cubeMesh, sphereMesh, torusMesh)

/**
 * Lights
 * 
 * !! the cheapest lights are the ambientLight and hemisphereLight
 */
const ambientLight = new THREE.AmbientLight(0xffffff, .4)
scene.add(ambientLight)

/**
 * Directional Light + Helper
 * 
 * has infinite parallel rays, like the sun
 * can only be moved by using position since it's targetted at the center of the scene
 * the distance of the light doesn't matter for now (without shadows)
 */
const directionalLight = new THREE.DirectionalLight(0xff4444, .6)
directionalLight.position.set(3, 1, 3)
const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 1)
scene.add(directionalLight, lightHelper)

/**
 * Hemisphere Light
 * 
 * different color from the sky and the ground, with a gradient in between
 */
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, .5)
// scene.add(hemisphereLight, hemisphereLightHelper)

/**
 * Point Light
 * 
 * color, intensity, distance, decay
 */
const pointLight = new THREE.PointLight(0xff09cc, .7, 4, 10)
pointLight.position.set(1, 0, 1)
// scene.add(pointLight)

/**
 * Rect Area Light
 * 
 * only works with MeshStandardMaterial or MeshPhysicalMaterial
 */
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 2, 1)
rectAreaLight.position.set(0,0,2)
rectAreaLight.lookAt(new THREE.Vector3())
// scene.add(rectAreaLight)

/**
 * Spot Light
 * 
 * if we want to re-position the target, we also have to add it to the scene
 */
const spotLight = new THREE.SpotLight(0x00ff00, 1, 5, Math.PI * 0.2, 0.2)
spotLight.position.set(0, 2, 3)
spotLight.target.position.set(-2, 0, 0)
// scene.add(spotLight, spotLight.target)


const clock = new THREE.Clock()
const tick = () => {

    // Update objects
    sphereMesh.rotation.y = 0.1 * clock.getElapsedTime()
    cubeMesh.rotation.y = 0.1 * clock.getElapsedTime()
    torusMesh.rotation.y = 0.1 * clock.getElapsedTime()

    sphereMesh.rotation.x = 0.15 * clock.getElapsedTime()
    cubeMesh.rotation.x = 0.15 * clock.getElapsedTime()
    torusMesh.rotation.x = 0.15 * clock.getElapsedTime()

    // Rest
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick()