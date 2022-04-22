import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import * as dat from 'dat.gui';

const gui = new dat.GUI();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.y = 4
camera.position.x = -8
camera.position.z = 10

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(10))

// Fog
const fog = new THREE.Fog('#262837', 1, 20)
scene.fog = fog

// Textures
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorAOTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')

const wallColorTexture = textureLoader.load('./bricks/color.jpg')
const wallNormalTexture = textureLoader.load('./bricks/normal.jpg')
const wallRoughnessTexture = textureLoader.load('./bricks/roughness.jpg')
const wallAmbientOcclusionTexture = textureLoader.load('./bricks/ambientOcclusion.jpg')

const grassColorTexture = textureLoader.load('./grass/color.jpg')
const grassNormalTexture = textureLoader.load('./grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('./grass/roughness.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('./grass/ambientOcclusion.jpg')

grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassColorTexture.repeat.set(8, 8)

grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.repeat.set(8, 8)

grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.repeat.set(8, 8)

grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.repeat.set(8, 8)

// House
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallAmbientOcclusionTexture,
        roughnessMap: wallRoughnessTexture,
        normalMap: wallNormalTexture,
    })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 2.5 / 2
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)

// add half the height of the cone, the pivot is in the centre
roof.position.y = 2.5 + (1 / 2)
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2.2, 64, 64),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAOTexture,
        displacementMap: doorHeightTexture,
        displacementScale: .1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.y = 1
door.position.z = 2
house.add(door)

// Bushes
const bushGeo = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMat = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeo, bushMat)
bush1.scale.set(.5, .5, .5)
bush1.position.set(.8, .1, 3)
scene.add(bush1)

const bush2 = new THREE.Mesh(bushGeo, bushMat)
bush2.scale.set(.25, .25, .25)
bush2.position.set(1.4, .1, 2.5)
scene.add(bush2)

const bush3 = new THREE.Mesh(bushGeo, bushMat)
bush3.scale.set(.4, .4, .4)
bush3.position.set(-1.2, .1, 3)
scene.add(bush3)

const bush4 = new THREE.Mesh(bushGeo, bushMat)
bush4.scale.set(.15, .15, .15)
bush4.position.set(-1.6, .1, 3.2)
scene.add(bush4)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeo = new THREE.BoxBufferGeometry(.6, .8, .15)
const graveMat = new THREE.MeshStandardMaterial({ color: 'gray' })

for (let i = 0; i < 40; i++) {
    // PI is a half circle, PI * 2 is a full circle, 1 times full circle is the end, 0 times full circle is the start
    const angle = Math.random() * Math.PI * 2
    // minimum is 4, maximum is 9 (plane width -1 for padding)
    const radius = 5 + Math.random() * 4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeo, graveMat)
    grave.position.set(x, .6 / 2, z)

    // Math.random - 0.5 has equal randomness negative and positive
    grave.rotation.x = (Math.random() - .5) * .2
    grave.rotation.y = (Math.random() - .5) * .4
    grave.rotation.z = (Math.random() - .5) * .4

    graves.add(grave)
}

// Floor
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20, 1, 1),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        roughnessMap: grassRoughnessTexture,
        normalMap: grassNormalTexture,
    })
)
plane.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2))
plane.rotation.x = -Math.PI * 0.5
scene.add(plane)

// Ghosts
const ghost1 = new THREE.PointLight(0xff00ff, 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight(0x00ffff, 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight(0xffff00, 2, 3)
scene.add(ghost3)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#b9d5ff', .12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(.001)
scene.add(ambientLight)

const moonLight = new THREE.DirectionalLight('#b9d5ff', .12)
const moonLightHelper = new THREE.DirectionalLightHelper(moonLight)
moonLight.position.set(2, 2, 2)

gui.add(moonLight, 'intensity').min(0).max(1).step(.001)
gui.add(moonLight.position, 'x').min(-10).max(10).step(.001)
gui.add(moonLight.position, 'y').min(-10).max(10).step(.001)
gui.add(moonLight.position, 'z').min(-10).max(10).step(.001)

scene.add(moonLight, moonLightHelper)

const doorLight = new THREE.PointLight('#ff7d46', 2, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

/**
 * Renderer
 * Limit pixel ratio to 2, more can cause performance issues on high pixel-ratio devices
 */
 const canvas = document.querySelector('canvas.webgl') as HTMLElement
 const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
 renderer.setSize(window.innerWidth, window.innerHeight)
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 
 /**
  * Shadows
  * 
  * Try to keep the shadows to an absolute minimum (cast and receive)
  */
 renderer.shadowMap.enabled = true
 renderer.shadowMap.type = THREE.PCFSoftShadowMap
 
 moonLight.castShadow = true
 moonLight.shadow.mapSize = new THREE.Vector2(128,128)
 moonLight.shadow.camera.far = 15
 
 // For each shadow, think how far it has to be, think about performance
 doorLight.castShadow = true
 doorLight.shadow.mapSize = new THREE.Vector2(128,128)
 doorLight.shadow.camera.far = 7
 
 ghost1.castShadow = true
 ghost1.shadow.mapSize = new THREE.Vector2(128,128)
 ghost1.shadow.camera.far = 7
 
 ghost2.castShadow = true
 ghost2.shadow.mapSize = new THREE.Vector2(128,128)
 ghost2.shadow.camera.far = 7
 
 ghost3.castShadow = true
 ghost3.shadow.mapSize = new THREE.Vector2(128,128)
 ghost3.shadow.camera.far = 7

 walls.castShadow = true
 bush1.castShadow = true
 bush2.castShadow = true
 bush3.castShadow = true
 bush4.castShadow = true

 for(const grave of graves.children) {
     grave.castShadow = true
 }
 
 walls.receiveShadow = true
 plane.receiveShadow = true
 
 // Set the color of the renderer
 renderer.setClearColor('#262837')
 
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
    // Move the ghosts
    const elapsed = clock.getElapsedTime()

    // Slow the ghost down by multiplying with .5
    const ghost1Angle = elapsed * .5
    // Increase the radius by multiplying with 4
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = 1 + Math.sin(elapsed * 3)

    const ghost2Angle = - elapsed * .3
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    // Mixing 2 sin creates a more random pattern, long-short-long-short
    ghost2.position.y = 1 + Math.sin(elapsed * 4) + Math.sin(elapsed * 2.5)

    const ghost3Angle = elapsed * .2
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsed * .3))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsed * .5))
    ghost3.position.y = 1 + Math.sin(elapsed * 3)

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick()