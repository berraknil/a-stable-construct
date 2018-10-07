function init() {
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

  const renderer = new THREE.WebGLRenderer({ antialias: true })

  renderer.shadowMap.enabled = true
  renderer.setSize(window.innerWidth, window.innerHeight)
  // renderer.toneMapping = THREE.LinearToneMapping
  renderer.setClearColor('rgb(20,20,20)')
  // renderer.setClearColor(0x000000, 0.0)

  // boilerplate
  const controls = new THREE.OrbitControls(camera, renderer.domElement)

  document.getElementById('WebGL-output').appendChild(renderer.domElement)

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onResize, false)

  // renderer.shadowMap.enabled = true
  // document.getElementById('WebGL-output').appendChild(renderer.domElement)

  // let model
  // // Instantiate a loader
  // var loader = new THREE.GLTFLoader()

  // // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  // // THREE.DRACOLoader.setDecoderPath( '/examples/js/libs/draco' );
  // // loader.setDRACOLoader( new THREE.DRACOLoader() );

  // // Load a glTF resource
  // loader.load(
  //   // resource URL
  //   'models/model.gltf',
  //   // called when the resource is loaded
  //   function(gltf) {
  //     model = gltf.scene
  //     scene.add(model)
  //     gltf.animations // Array<THREE.AnimationClip>
  //     gltf.scene // THREE.Scene
  //     gltf.scenes // Array<THREE.Scene>
  //     gltf.cameras // Array<THREE.Camera>
  //     gltf.asset // Object
  //   },
  //   // called while loading is progressing
  //   function(xhr) {
  //     console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  //   },
  //   // called when loading has errors
  //   function(error) {
  //     console.log('An error happened')
  //   }
  // )

  // if (model) model.position.y = -10

  let floor = []
  let strips = []
  let ground
  let strip
  const addGround = () => {
    for (let z = -2400; z < 2400; z += 800) {
      // let groundMaterial = new THREE.MeshLambertMaterial({
      //   // color: 0xffffff,
      //   color: 0x01f7f7,
      //   emissive: 0x01f7f7,
      //   // color: 0x000000,
      //   wireframe: true,
      //   side: THREE.DoubleSide
      // })

      let backgroundMaterial = new THREE.MeshLambertMaterial({
        // color: 0xffffff,
        // color: 0x01f7f7,
        // emissive: 0x01f7f7,
        color: 0x000000,
        // wireframe: true,
        side: THREE.DoubleSide
      })
      // let groundMaterial = new THREE.MeshBasicMaterial({
      //   color: 0xffffff
      //   // side: THREE.DoubleSide
      // })

      let geometry = new THREE.PlaneGeometry(40, 800, 32, 32)

      var geo = new THREE.EdgesGeometry(geometry) // or WireframeGeometry( geometry )

      let groundMaterial = new THREE.LineBasicMaterial({
        color: 0x01f7f7,
        linewidth: 20
      })

      ground = new THREE.LineSegments(geo, groundMaterial)

      // scene.add(wireframe)

      geometry.computeFaceNormals()
      geometry.computeVertexNormals()

      // ground = new THREE.Mesh(geometry, groundMaterial)
      background = new THREE.Mesh(geometry, backgroundMaterial)
      ground.rotation.x = -Math.PI / -2
      background.rotation.x = -Math.PI / -2

      ground.position.z = z
      background.position.z = z
      ground.position.y = -4
      background.position.y = -4

      ground.doubleSided = true
      background.doubleSided = true
      // scene.add(ground)
      scene.add(background)
      // floor.push(ground)
      floor.push(background)
    }

    for (let z = -100; z < 100; z += 10) {
      // let stripMaterial = new THREE.MeshLambertMaterial({
      //   color: 0xff69b4,
      //   emissive: 0xff69b4,
      //   // emissiveIntensity: 1.3,
      //   side: THREE.DoubleSide
      // })

      // let stripGeometry = new THREE.PlaneGeometry(0.1, 5, 100, 100)

      // geometry = new THREE.PlaneGeometry(0.2, 5, 100, 100)
      let geo = new THREE.PlaneGeometry(0.3, 5, 100, 100)
      // let mat = new THREE.LineBasicMaterial({
      //   color: 0xff69b4,
      //   linewidth: 0.3
      // })
      let mat = new THREE.MeshLambertMaterial({
        // color: 0xffffff,
        emissive: 0xff69b4,
        emissiveIntensity: 0.5,
        wireframe: true
      })

      strip = new THREE.Mesh(geo, mat)
      strip.rotation.x = -Math.PI / -2
      strip.position.y = -3
      strip.position.z = z
      scene.add(strip)
      strips.push(strip)
    }
  }

  // const addLight = () => {
  //   const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
  //   directionalLight.position.set(1, 2, 10)
  //   directionalLight.castShadow = true
  //   // directionalLight.shadowCameraVisible = true

  //   // scene.add(directionalLight)
  // }

  function animateScene(value, value2) {
    for (let i = 0; i < floor.length; i++) {
      ground = floor[i]

      ground.position.z += 2
      // ground.material.emissiveIntensity = value2
      if (ground.position.z > 50) {
        ground.position.z -= 200
      }
    }
    for (let i = 0; i < strips.length; i++) {
      ground = strips[i]
      ground.material.emissiveIntensity = value
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
  // AUDIO STUFF

  let listener = new THREE.AudioListener()
  camera.add(listener)

  // create a global audio source
  let sound = new THREE.Audio(listener)

  let audioLoader = new THREE.AudioLoader()

  //Load a sound and set it as the Audio object's buffer
  audioLoader.load('./audio/delorean.mp3', function(buffer) {
    sound.setBuffer(buffer)
    sound.setLoop(true)
    sound.setVolume(0.5)
    // sound.startTime = 500
    // sound.play()
  })
  const analyser = new THREE.AudioAnalyser(sound, 1024)

  // console.log(audioLoader)
  // console.log(sound)
  // this.sound.offset = 60
  //Get the average frequency of the sound

  const playbackCtrl = new function() {
    this.toggle = () => {
      if (!sound.isPlaying) {
        sound.startTime = 500
        sound.play()

        console.log('now playing')
      } else {
        sound.pause()
        console.log('playback paused')
      }
    }
    this.stop = () => {
      sound.stop()

      // sound.startTime = 150
      console.log('playback stopped, playhead at 0')
    }
    /*   this.pause = () => {
           sound.pause()
       } */
  }()
  // Options to be added to the GUI

  var options = {
    velx: 0,
    vely: 0,
    camera: {
      speed: 0.0001
    },
    stop: function() {
      this.velx = 0
      this.vely = 0
    },
    reset: function() {
      this.velx = 0.1
      this.vely = 0.1
      camera.position.z = 75
      camera.position.x = 0
      camera.position.y = 0
      cube.scale.x = 1
      cube.scale.y = 1
      cube.scale.z = 1
      cube.material.wireframe = true
    }
  }

  var gui = new dat.GUI()

  var cam = gui.addFolder('Camera')
  cam.add(options.camera, 'speed', 0, 0.001).listen()
  cam.add(camera.position, 'x', 0, 100).listen()
  cam.add(camera.position, 'y', 0, 100).listen()
  cam.add(camera.position, 'z', 0, 100).listen()
  cam.open()

  var velocity = gui.addFolder('Velocity')
  velocity
    .add(options, 'velx', -0.2, 0.2)
    .name('X')
    .listen()
  velocity
    .add(options, 'vely', -0.2, 0.2)
    .name('Y')
    .listen()
  velocity.open()

  // gui.add(options, 'stop')
  gui.add(playbackCtrl, 'toggle')
  // gui.close()
  gui.add(playbackCtrl, 'stop')
  // gui.add(options, 'reset')
  const render = () => {
    // console.log(model)
    requestAnimationFrame(render)
    controls.update()

    let data = analyser.getFrequencyData()
    let freq = analyser.getAverageFrequency()
    // cube.rotation.z += 0.01
    // cube.rotation.x += 0.01
    // cube.rotation.z += 0.01
    // renderer.render(scene, camera)
    // strip.rotation.y += 0.01
    // renderer.toneMappingExposure += Math.pow(0.2, 4.0)
    if (sound.isPlaying) {
      // console.log(data[50])
      // console.log(data[150] / 100)
      // console.log(freq)
      // console.log(data[50])
      /*   console.log(`
      0: ${data[0]}, 
      50: ${data[50]}, 
      100: ${data[100]}, 
      150: ${data[150]},
      200: ${data[200]}, 
      250: ${data[250]}, 
      300: ${data[300]}, 
      350: ${data[350]},
      400: ${data[400]}, 
      450: ${data[450]}, 
      500: ${data[500]}`) */
    }

    // strip.material.emissiveIntensity = data[50] / 100
    // strip.position.z = data[50] / 100
    animateScene(data[50] / 100)
    // PUT SONG AMPLITUDE AS STRENGTH HERE
    // bloomPass.strength = Number(freq / 5)
    renderer.render(scene, camera)
  }

  // addSphere()
  // console.log(camera.rotation)
  addGround()
  render()
  return scene
}

const scene = init()
