var camera, scene, renderer
var geometry, material, mesh
var composer

/*var bloomStrength = 2;
		var bloomRadius = 5;
		var bloomThreshold = 0.4;*/
var bloomStrength = 2
var bloomRadius = 0
var bloomThreshold = 0.1

init()
animate()

function init() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  )
  camera.position.z = 1000

  scene = new THREE.Scene()

  //geometry = new THREE.CubeGeometry(200,200,200);
  geometry = new THREE.ConeGeometry(200, 400, 8)
  var geo = new THREE.EdgesGeometry(geometry)
  var mat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 0 })

  mesh = new THREE.LineSegments(geo, mat)
  scene.add(mesh)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.LinearToneMapping
  renderer.setClearColor(0x000000, 0.0)
  controls = new THREE.OrbitControls(camera, renderer.domElement)

  document.body.appendChild(renderer.domElement)

  renderScene = new THREE.RenderPass(scene, camera)

  var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader)
  effectFXAA.uniforms['resolution'].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
  )

  var copyShader = new THREE.ShaderPass(THREE.CopyShader)
  copyShader.renderToScreen = true

  var bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    bloomStrength,
    bloomRadius,
    bloomThreshold
  )

  composer = new THREE.EffectComposer(renderer)

  composer.setSize(window.innerWidth, window.innerHeight)
  composer.addPass(renderScene)
  composer.addPass(effectFXAA)
  composer.addPass(effectFXAA)

  composer.addPass(bloomPass)
  composer.addPass(copyShader)
}

function animate() {
  // note: three.js includes requestAnimationFrame shim
  requestAnimationFrame(animate)

  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.02

  //renderer.render(scene, camera);
  composer.render()
}
