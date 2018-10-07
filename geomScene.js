function init() {
  var scene = new THREE.Scene()
  var clock = new THREE.Clock()

  let analyser
  // initialize objects
  var planeMaterial = getMaterial('phong', 'rgb(255, 255, 255)')
  var plane = getPlane(planeMaterial, 30, 60)
  plane.name = 'plane-1'

  // manipulate objects
  plane.rotation.x = Math.PI / 2
  plane.rotation.z = Math.PI / 4

  // add objects to the scene
  scene.add(plane)

  // camera
  var camera = new THREE.PerspectiveCamera(
    45, // field of view
    window.innerWidth / window.innerHeight, // aspect ratio
    1, // near clipping plane
    1000 // far clipping plane
  )
  camera.position.z = 20
  camera.position.x = 0
  camera.position.y = 5
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // renderer
  var renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  document.getElementById('WebGL-output').appendChild(renderer.domElement)

  var controls = new THREE.OrbitControls(camera, renderer.domElement)

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
  analyser = new THREE.AudioAnalyser(sound, 1024)

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
      // cube.scale.x = 1
      // cube.scale.y = 1
      // cube.scale.z = 1
      // cube.material.wireframe = true
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

  gui.add(options, 'stop')
  gui.add(options, 'reset')
  gui.add(playbackCtrl, 'toggle')
  // gui.close()
  gui.add(playbackCtrl, 'stop')

  update(renderer, scene, camera, controls, clock, analyser)

  return scene
}

function getPlane(material, size, segments) {
  var geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  material.side = THREE.DoubleSide
  var obj = new THREE.Mesh(geometry, material)
  obj.receiveShadow = true
  obj.castShadow = true

  return obj
}

function getMaterial(type, color) {
  var selectedMaterial
  var materialOptions = {
    // color: color === undefined ? 'rgb(255, 255, 255)' : color,
    wireframe: true,
    emissive: 0xff69b4,
    emissiveIntensity: 0.5
  }

  switch (type) {
    case 'basic':
      selectedMaterial = new THREE.MeshBasicMaterial(materialOptions)
      break
    case 'lambert':
      selectedMaterial = new THREE.MeshLambertMaterial(materialOptions)
      break
    case 'phong':
      selectedMaterial = new THREE.MeshPhongMaterial(materialOptions)
      break
    case 'standard':
      selectedMaterial = new THREE.MeshStandardMaterial(materialOptions)
      break
    default:
      selectedMaterial = new THREE.MeshBasicMaterial(materialOptions)
      break
  }

  return selectedMaterial
}

function update(renderer, scene, camera, controls, clock, analyser) {
  controls.update()

  let data = analyser.getFrequencyData()
  let freq = analyser.getAverageFrequency()

  let elapsedTime = clock.getElapsedTime()

  let plane = scene.getObjectByName('plane-1')
  let planeGeom = plane.geometry
  plane.material.emissiveIntensity = data[50] / 150
  planeGeom.vertices.forEach((vertex, i) => {
    vertex.z += Math.sin(elapsedTime + i * 0.1) * 0.005
  })
  planeGeom.verticesNeedUpdate = true

  renderer.render(scene, camera)
  requestAnimationFrame(function() {
    update(renderer, scene, camera, controls, clock)
  })
}

var scene = init()
