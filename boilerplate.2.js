function init() {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )

  camera.position.z = 25
  camera.position.x = 25
  camera.position.y = 18
  camera.lookAt(scene.position)

  var geometry = new THREE.BoxGeometry(5, 5, 5)
  var material = new THREE.MeshPhongMaterial({
    // color: 0xffffff,
    emissive: 0xff69b4,
    emissiveIntensity: 0.5,
    wireframe: true
  })
  var cube = new THREE.Mesh(geometry, material)
  var cube2 = new THREE.Mesh(geometry, material)
  scene.add(cube)
  scene.add(cube2)

  // var light = new THREE.AmbientLight(0xffffff) // soft white light
  // scene.add(light)

  var spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(20, 1, 20)

  spotLight.castShadow = true

  spotLight.shadow.mapSize.width = 1024
  spotLight.shadow.mapSize.height = 1024

  spotLight.shadow.camera.near = 500
  spotLight.shadow.camera.far = 4000
  spotLight.shadow.camera.fov = 30

  scene.add(spotLight)

  var spotLight2 = new THREE.SpotLight(0x01f7f7)
  spotLight2.position.set(-10, 1, -10)
  // spotLight2.castShadow = true
  spotLight2.shadow.mapSize.width = 1024
  spotLight2.shadow.mapSize.height = 1024
  spotLight2.shadow.camera.near = 500
  spotLight2.shadow.camera.far = 4000
  spotLight2.shadow.camera.fov = 30

  scene.add(spotLight2)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor('rgb(20,20,20)')
  document.body.appendChild(renderer.domElement)
  // document.getElementById('WebGL-output').appendChild(renderer.domElement)

  const controls = new THREE.OrbitControls(camera, renderer.domElement)

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onResize, false)

  // const gui = new dat.GUI()

  // gui.add(playbackCtrl, 'toggle')
  // // gui.close()
  // gui.add(playbackCtrl, 'stop')

  // AUDIO STUFF

  let listener = new THREE.AudioListener()
  camera.add(listener)

  // create a global audio source
  let sound = new THREE.Audio(listener)

  let audioLoader = new THREE.AudioLoader()

  //Load a sound and set it as the Audio object's buffer
  audioLoader.load('./audio/stable.mp3', function(buffer) {
    sound.setBuffer(buffer)
    sound.setLoop(true)
    sound.setVolume(1)
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
        sound.startTime = 30
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
  cam.add(camera.position, 'y', 0, 100).listen()
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

  var box = gui.addFolder('Cube')
  box
    .add(cube.scale, 'x', 0, 3)
    .name('Width')
    .listen()
  box
    .add(cube.scale, 'y', 0, 3)
    .name('Height')
    .listen()
  box
    .add(cube.scale, 'z', 0, 3)
    .name('Length')
    .listen()
  box.add(cube.material, 'wireframe').listen()
  box.open()

  gui.add(options, 'stop')
  gui.add(options, 'reset')
  gui.add(playbackCtrl, 'toggle')
  // gui.close()
  gui.add(playbackCtrl, 'stop')

  console.log(cube.material.emissiveIntensity)
  console.log(sound)
  const render = () => {
    // console.log(sound.context.currentTime)
    requestAnimationFrame(render)
    controls.update()

    let data = analyser.getFrequencyData()
    let freq = analyser.getAverageFrequency()
    // cube.rotation.z += 0.01
    cube.rotation.x += 0.01
    cube.rotation.z += 0.01
    cube2.rotation.x -= 0.01
    cube2.rotation.z -= 0.01
    cube.material.emissiveIntensity = data[300] / 100
    spotLight.intensity = data[50] / 100
    spotLight2.intensity = data[150] / 100

    // cube.scale.z = data[50] / 100
    // cube.scale.y = data[50] / 100
    renderer.render(scene, camera)
  }

  render()
  return scene
}

const scene = init()
