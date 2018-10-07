var bloomStrength = 3
var bloomRadius = 0
var bloomThreshold = 0.1

function init() {
  const date = new Date()
  const pn = new Perlin('rnd' + date.getTime())
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )
  camera.position.z = 20
  camera.position.y = 1.5

  camera.lookAt(new THREE.Vector3(0, 0, 0))

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.toneMapping = THREE.LinearToneMapping
  renderer.setClearColor('rgb(20,20,20)')
  // renderer.setClearColor(0x000000, 0.0)

  // boilerplate
  const controls = new THREE.OrbitControls(camera, renderer.domElement)

  document.getElementById('WebGL-output').appendChild(renderer.domElement)

  var renderScene = new THREE.RenderPass(scene, camera)

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
  // composer.addPass(effectFXAA)

  composer.addPass(bloomPass)
  composer.addPass(copyShader)

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onResize, false)

  // renderer.shadowMap.enabled = true
  // document.getElementById('WebGL-output').appendChild(renderer.domElement)

  let stars = []
  let floor = []
  let ground
  let strip

  const addSphere = () => {
    for (let z = -1000; z < 1000; z += 20) {
      let geometry = new THREE.SphereGeometry(0.5, 32, 32)
      let material = new THREE.MeshBasicMaterial({ color: 0xffffff })
      let sphere = new THREE.Mesh(geometry, material)

      sphere.position.x = Math.random() * 1000 - 500
      sphere.position.y =
        Math.random(window.innerHeight / 4, window.innerHeight) * 200

      sphere.position.z = z

      // sphere.scale.x = sphere.scale.y = 2

      scene.add(sphere)

      stars.push(sphere)
    }
  }

  const addGround = () => {
    for (let z = -1600; z < 1600; z += 800) {
      let groundMaterial = new THREE.MeshLambertMaterial({
        // color: 0xffffff,
        color: 0x000000,
        side: THREE.DoubleSide
      })
      // let groundMaterial = new THREE.MeshBasicMaterial({
      //   color: 0xffffff
      //   // side: THREE.DoubleSide
      // })

      let geometry = new THREE.PlaneGeometry(40, 800, 300, 300)

      geometry.computeFaceNormals()
      geometry.computeVertexNormals()

      ground = new THREE.Mesh(geometry, groundMaterial)
      ground.rotation.x = -Math.PI / -2

      ground.position.z = z
      ground.position.y = -4

      ground.doubleSided = true
      scene.add(ground)
      floor.push(ground)
    }

    for (let z = -100; z < 100; z += 10) {
      // let stripMaterial = new THREE.MeshLambertMaterial({
      //   color: 0xff69b4,
      //   emissive: 0xff69b4,
      //   // emissiveIntensity: 1.3,
      //   side: THREE.DoubleSide
      // })

      // let stripGeometry = new THREE.PlaneGeometry(0.1, 5, 100, 100)

      geometry = new THREE.PlaneGeometry(0.2, 5, 100, 100)
      let geo = new THREE.EdgesGeometry(geometry)
      let mat = new THREE.LineBasicMaterial({
        color: 0xff69b4,
        linewidth: 0.3
      })

      strip = new THREE.LineSegments(geo, mat)
      strip.rotation.x = -Math.PI / -2
      strip.position.y = -1
      strip.position.z = z
      scene.add(strip)
      floor.push(strip)
      // scene.add(mesh)

      // let ground = new THREE.Mesh(geometry, groundMaterial)
      // ground.position.y = -1.9
      // ground.rotation.x = -Math.PI / 2

      // for (let i = 0, l = geometry.vertices.length; i < l; i++) {
      //   let vertex = geometry.vertices[i]
      //   let value = pn.noise(vertex.x / 10, vertex.y / 10, 0)
      //   vertex.z = value * 6
      // }

      // stripGeometry.computeFaceNormals()
      // stripGeometry.computeVertexNormals()
      // strip = new THREE.Mesh(stripGeometry, stripMaterial)
      // strip.rotation.x = -Math.PI / -2
      // strip.position.y = -1
      // strip.doubleSided = true
    }
  }

  const addLight = () => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
    directionalLight.position.set(1, 2, 10)
    directionalLight.castShadow = true
    // directionalLight.shadowCameraVisible = true

    // scene.add(directionalLight)
  }

  function animateScene() {
    // loop through each star
    for (let i = 0; i < stars.length; i++) {
      star = stars[i]

      // move it forward by a 10th of its array position each time
      star.position.z += i

      // once the star is too close, reset its z position
      if (star.position.z > 1000) star.position.z -= 2000
    }

    for (let i = 0; i < floor.length; i++) {
      ground = floor[i]

      ground.position.z += 2
      if (ground.position.z > 50) {
        ground.position.z -= 200
      }
    }
  }

  // const createTerrainMatrix = () => {
  //   for (let z = 100; z > -200; z -= 100) {
  //     let perlinSurface = new perlinSurface(perlinNoise, 100, 100)

  //   }
  // }

  const render = () => {
    requestAnimationFrame(render)
    controls.update()
    // cube.rotation.z += 0.01
    // cube.rotation.x += 0.01
    // cube.rotation.z += 0.01
    // renderer.render(scene, camera)
    // strip.rotation.y += 0.01
    // renderer.toneMappingExposure += Math.pow(0.2, 4.0)
    animateScene()
    composer.render()

    // PUT SONG AMPLITUDE AS STRENGTH HERE
    // bloomPass.strength += Number(0.2)
  }

  // addSphere()
  console.log(camera.rotation)
  addGround()
  addLight()
  render()
  return scene
}

const scene = init()
