import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as THREE from 'three'

// Textures
const tl = new THREE.TextureLoader()
const brickColorTexture = tl.load('./bricks/color.jpg')
const brickAOTexture = tl.load('./bricks/ambientOcclusion.jpg')
const brickNormalTexture = tl.load('./bricks/normal.jpg')
const brickRoughnessTexture = tl.load('./bricks/roughness.jpg')

const grassColorTexture = tl.load('./grass/color.jpg')
const grassNormalTexture = tl.load('./grass/normal.jpg')
const grassRoughnessTexture = tl.load('./grass/roughness.jpg')
const grassAmbientOcclusionTexture = tl.load('./grass/ambientOcclusion.jpg')

grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.repeat.set(8, 8)

brickColorTexture.wrapS = THREE.RepeatWrapping
brickColorTexture.wrapT = THREE.RepeatWrapping

brickAOTexture.wrapS = THREE.RepeatWrapping
brickAOTexture.wrapT = THREE.RepeatWrapping

brickNormalTexture.wrapS = THREE.RepeatWrapping
brickNormalTexture.wrapT = THREE.RepeatWrapping

brickRoughnessTexture.wrapS = THREE.RepeatWrapping
brickRoughnessTexture.wrapT = THREE.RepeatWrapping

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('#262837', 1, 11)
scene.fog = fog

// Cubes
const cubeMaterial = new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    aoMapIntensity: 2,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture
})

const cubes = new THREE.Group()
scene.add(cubes)

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
        cube.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(cube.geometry.attributes.uv.array, 2))
        cube.position.y = y
        cube.position.x = i < 3 ? distance : -distance
        cube.position.z = i > 1 && i < 4 ? -distance : distance
        cubes.add(cube)
        
        prevHeight += height + margin
    }
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: brickAOTexture,
        aoMap: brickAOTexture,
        roughnessMap: brickRoughnessTexture,
        normalMap: brickNormalTexture,
    })
)
floor.rotation.x = -Math.PI * .5
scene.add(floor)

// Lights
const dirLight = new THREE.DirectionalLight(0xffffff, .2)
const dirLightHelper = new THREE.DirectionalLightHelper(dirLight)
dirLight.position.set(3, 10, 2)
scene.add(dirLight, dirLightHelper)

const ghost1 = new THREE.PointLight(0xffff00, 3, 3)
ghost1.position.y = 3
scene.add(ghost1)

const ghost2 = new THREE.PointLight(0xff00ff, 3, 3)
ghost2.position.y = 3
scene.add(ghost2)

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

// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

dirLight.castShadow = true
dirLight.shadow.mapSize = new THREE.Vector2(128,128)

ghost1.castShadow = true
ghost1.shadow.mapSize = new THREE.Vector2(128,128)

ghost2.castShadow = true
ghost2.shadow.mapSize = new THREE.Vector2(128,128)

for(const cube of cubes.children) {
    cube.castShadow = true
    // cube.receiveShadow = true
}

floor.receiveShadow = true

// Controls
const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)
// const controls = new OrbitControls(camera, renderer.domElement)

const clock = new THREE.Clock()
const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    const ghost1Radius = 3
    ghost1.position.x = Math.sin(elapsedTime * .5) * ghost1Radius
    ghost1.position.z = Math.cos(elapsedTime * .5) * ghost1Radius
    ghost1.position.y = 4 + Math.sin(elapsedTime * .5) * 1.5

    const ghost2Radius = 2.5
    ghost2.position.x = Math.sin(elapsedTime * .8) * ghost2Radius
    ghost2.position.z = Math.cos(elapsedTime * .8) * ghost2Radius
    ghost2.position.y = 4 + Math.sin(elapsedTime * .8) * 1.5


    // controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick()