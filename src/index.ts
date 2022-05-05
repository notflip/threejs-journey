import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import * as dat from 'dat.gui';

const gui = new dat.GUI();

const scene = new THREE.Scene()

// Params
const parameters = {
    count: 70000,
    size: 0.023,
    radius: 8,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 6,
    colorInside: '#ff6030',
    colorOutside: '#1b3984'
}

let galaxyGeometry: THREE.BufferGeometry | null = null
let galaxyMaterial: THREE.PointsMaterial | null = null
let galaxyPoints: THREE.Points | null = null

// Galaxy
const generateGalaxy = () => {
    // !! Clean up the scene using dispose and scene.remove
    if (galaxyPoints !== null && galaxyGeometry !== null && galaxyMaterial !== null) {
        galaxyMaterial.dispose()
        galaxyGeometry.dispose()
        scene.remove(galaxyPoints)
    }

    galaxyMaterial = new THREE.PointsMaterial({
        color: '#fff',
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    galaxyGeometry = new THREE.BufferGeometry()
    const galaxyVertices = new Float32Array(parameters.count * 3)
    const galaxyColors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.colorInside)
    const colorOutside = new THREE.Color(parameters.colorOutside)

    for (let i = 0; i < parameters.count * 3; i++) {

        const i3 = i * 3 // 0, 3, 6, 9
        const radius = Math.random() * parameters.radius

        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        // particles further away have more spin, so multiply by the radius of the particle calculated above
        // this is not the same as the radius parameter, it's the calculated radius, so keeping distance into account.
        const spinAngle = parameters.spin * radius

        // we want a different randomness for each axes
        // creating an exponential curve using Math.pow
        // the last part of each line is a random 1 or -1 method
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        // use combination of sin en cos to position points on a circle
        galaxyVertices[i3] = Math.sin(branchAngle + spinAngle) * radius + randomX
        galaxyVertices[i3 + 1] = randomY
        galaxyVertices[i3 + 2] = Math.cos(branchAngle + spinAngle) * radius + randomZ

        const mixedColor = colorInside.clone()

        // We need a value 0 -> 1, so divide by the radius parameter to get that
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        galaxyColors[i3] = mixedColor.r
        galaxyColors[i3 + 1] = mixedColor.g
        galaxyColors[i3 + 2] = mixedColor.b
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyVertices, 3))
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3))

    galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial)
    scene.add(galaxyPoints)
}

generateGalaxy()

// Galaxy GUI
// !! Call the onFinishChange method to redraw using our function
gui.add(parameters, 'count', 1000, 100000, 1).onFinishChange(generateGalaxy)
gui.add(parameters, 'size', 0.001, .25, 0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius', 0.01, 10, 0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches', 2, 20, 1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin', -5, 5, 0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness', 0, 1, 0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower', 1, 10, 0.01).onFinishChange(generateGalaxy)

// Lights
const ambientLight = new THREE.AmbientLight('#fff', .4)
scene.add(ambientLight)

//Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 20

// Renderer
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

// Tick
const clock = new THREE.Clock()
const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick()