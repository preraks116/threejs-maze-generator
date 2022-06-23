  import './style.css'

  import * as THREE from 'three';
  import * as CANNON from 'cannon-es';
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import Stats from 'three/examples/jsm/libs/stats.module.js';
  import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
  import { textures } from './src/utils/textures';
  import { setKey } from './src/utils/keyControls';
  import { setZoom } from './src/components/camera/orthographicCamera';
  // import CannonDebugger from 'cannon-es-debugger'


  // import { sceneObjects, lighting, camera, scene, world, cannonDebugger } from './src/scenes/perspective';
  import { sceneObjects, lighting, camera, scene, world, cannonDebugger } from './src/scenes/isometric'; 

  const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  let controls, stats;
  // const player = sceneObjects['cube'];
  const player = sceneObjects['player'];
  // const player = sceneObjects['coin'];


  async function init() {
    // initialization
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    console.log(renderer.shadowMap)
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // load camera
    camera.render();

    // orbit controls
    // controls = new OrbitControls(camera.camera, renderer.domElement);
    // controls.listenToKeyEvents(window); // optional

    // lighting
    for(let key in lighting) {
      lighting[key].render();
    }

    // renders all objects in scene
    for (let key in sceneObjects) {
      sceneObjects[key].render();
    }

    stats = new Stats();
    // add custom panel
    // add memory panel
    // stats.addPanel(new Stats.Panel('Memory', '#ff8', '#221'));
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3: mem, 4: calls, 5: raf, 6: all
    document.body.appendChild(stats.dom);

    // lighting.ambientLight.intensity = 1;
    // add gui
    const gui = new GUI();
    const lightingFolder = gui.addFolder('Lighting');
    const directionalLightFolder = lightingFolder.addFolder('Directional Light');
    const directionalLightPositionFolder = directionalLightFolder.addFolder('Position');
    const ambientLightFolder = lightingFolder.addFolder('Ambient Light');
    const propsAmbientLight = {
      get 'Intensity'() {
        return lighting.ambientLight.light.intensity;
      },
      set 'Intensity'(value) {
        lighting.ambientLight.light.intensity = value;
      },
      get 'Color'() {
        return lighting.ambientLight.light.color.getHex();
      },
      set 'Color'(value) {
        lighting.ambientLight.light.color.setHex(value);
      }
    }
    const propsDirectionalLight = {
      get 'Intensity'() {
        return lighting.directionalLight.light.intensity;
      },
      set 'Intensity'(value) {
        lighting.directionalLight.light.intensity = value;
      },
      get 'Color'() {
        return lighting.directionalLight.light.color.getHex();
      },
      set 'Color'(value) {
        lighting.directionalLight.light.color.setHex(value);
      }
    }
    const propsDirectionalLightPosition = {
      get 'X'() {
        return lighting.directionalLight.light.position.x;
      },
      set 'X'(value) {
        lighting.directionalLight.light.position.x = value;
      },
      get 'Y'() {
        return lighting.directionalLight.light.position.y;
      },
      set 'Y'(value) {
        lighting.directionalLight.light.position.y = value;
      },
      get 'Z'() {
        return lighting.directionalLight.light.position.z;
      },
      set 'Z'(value) {
        lighting.directionalLight.light.position.z = value;
      }
    }
    ambientLightFolder.add(propsAmbientLight, 'Intensity', 0, 1).step(0.01);
    ambientLightFolder.addColor(propsAmbientLight, 'Color').onChange(function(value) {
      lighting.ambientLight.light.color.setHex(value);
    });
    directionalLightFolder.add(propsDirectionalLight, 'Intensity', 0, 1).step(0.01);
    directionalLightFolder.addColor(propsDirectionalLight, 'Color').onChange(function(value) {
      lighting.directionalLight.light.color.setHex(value);
    });
    directionalLightPositionFolder.add(propsDirectionalLightPosition, 'X', -100, 100).step(0.01);
    directionalLightPositionFolder.add(propsDirectionalLightPosition, 'Y', -100, 100).step(0.01);
    directionalLightPositionFolder.add(propsDirectionalLightPosition, 'Z', -100, 100).step(0.01);

    // console.log(lighting.ambientLight.intensity);

    // for debugging
    // const cube = new THREE.Mesh(
    //   new THREE.BoxGeometry(3, 3, 3), 
    //   new THREE.MeshStandardMaterial(textures.brick)
    // );
    // cube.position.set(3, 1.5, -3);
    // scene.add(  cube );

    // add a cylinder
    // console.log(scene);
    // const cylinder = new THREE.Mesh(
    //   new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32),
    //   new THREE.MeshStandardMaterial({color: 0xffff00})
    // );
    // cylinder.position.set(0, 1.5, 0);
    // // rotate cylinder to face the camera
    // cylinder.lookAt(camera.camera.position);
    // cylinder.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // // cylinder.rotation.x = Math.PI / 2;
    // // cylinder.rotation.z = Math.PI;

    // scene.add(cylinder);

    // const cylinder2 = new THREE.Mesh(
    //   new THREE.CylinderGeometry(0.45, 0.45, 0.1, 32),
    //   new THREE.MeshStandardMaterial(textures.brick)
    // );
    // cylinder2.position.set(0.1, 1.6, 0.1);
    // // rotate cylinder to face the camera
    // cylinder2.lookAt(camera.camera.position);
    // cylinder2.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // // cylinder.rotation.x = Math.PI / 2;
    // // cylinder.rotation.z = Math.PI;
    // scene.add(cylinder2);

    // event listeners
    window.addEventListener('wheel', (e) => setZoom(e,camera));
    window.addEventListener('keydown', (e) => setKey(e, true));
    window.addEventListener('resize', onWindowResize);
    window.addEventListener( 'keyup', (e) => setKey(e, false));
  }

  function animate() {
    requestAnimationFrame(animate);
    // setTimeout( function() {

    //   requestAnimationFrame( animate );

    // }, 1000 / 30 );
    stats.begin();
    // update memory panel
    renderer.render(scene, camera.camera);
    stats.end();
    // controls.update();
    if(player){camera.update(player.body)};
    world.step(1 / 60);

    for (let key in sceneObjects) {
      sceneObjects[key].update();
    }
    cannonDebugger.update()
  }

  function onWindowResize() {
    camera.camera.aspect = window.innerWidth / window.innerHeight;
    camera.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  init();
  animate();