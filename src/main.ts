import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shader/vertexShader.vert";
import fragmentShader from "./shader/fragmentShader.frag";
import "./style.css";

/**
 * Setup Scene , Camera and etc
 */
/*
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const canvas = document.querySelector(".webgl") as HTMLCanvasElement;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.25, -0.25, 1);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
scene.add(camera);
*/

/**
 * Geometry
 */
class Smoke {
  width: number;
  height: number;
  clock: THREE.Clock;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  mesh: THREE.Mesh;
  cubeSineDriver: number;
  smokeParticles: THREE.Mesh[];
  camera: THREE.PerspectiveCamera;

  constructor(options = {}) {
    const defaults = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    Object.assign(this, options, defaults);
    this.onResize = this.onResize.bind(this);

    this.addEventListeners();
    this.init();
  }

  init() {
    const { width, height } = this;
    this.clock = new THREE.Clock();
    const renderer = (this.renderer = new THREE.WebGLRenderer());
    renderer.setSize(width, height);
    this.scene = new THREE.Scene();
    const meshGeometry = new THREE.BoxGeometry(200, 200, 200);
    const meshMaterial = new THREE.MeshBasicMaterial({
      color: 0xaa6666,
      wireframe: true,
    });
    this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);

    this.cubeSineDriver = 0;

    this.addCamera();
    this.addLights();
    this.addParticles();
    this.addBackground();

    document.body.appendChild(renderer.domElement);
  }

  evolveSmoke(delta: number) {
    const { smokeParticles } = this;
    let smokeParticlesLength = smokeParticles.length;

    while (smokeParticlesLength--) {
      smokeParticles[smokeParticlesLength].rotation.z += delta * 0.2;
    }
  }

  addLights() {
    const { scene } = this;
    const light = new THREE.DirectionalLight(0xffffff, 0.75);

    light.position.set(-1, 0, 1);
    scene.add(light);
  }

  addCamera() {
    const { scene } = this;
    const camera = (this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      1,
      10000
    ));

    camera.position.z = 1000;
    scene.add(camera);
  }

  addParticles() {
    const { scene } = this;
    const textureLoader = new THREE.TextureLoader();
    const smokeParticles: THREE.Mesh[] = (this.smokeParticles = []);

    textureLoader.load(
      "https://rawgit.com/marcobiedermann/playground/master/three.js/smoke-particles/dist/assets/images/clouds.png",
      (texture) => {
        const smokeMaterial = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          map: texture,
          transparent: true,
        });
        smokeMaterial.map.minFilter = THREE.LinearFilter;
        const smokeGeometry = new THREE.PlaneGeometry(300, 300);

        const smokeMeshes: THREE.Mesh[] = [];
        let limit = 150;

        while (limit--) {
          smokeMeshes[limit] = new THREE.Mesh(smokeGeometry, smokeMaterial);
          smokeMeshes[limit].position.set(
            Math.random() * 500 - 250,
            Math.random() * 500 - 250,
            Math.random() * 1000 - 100
          );
          smokeMeshes[limit].rotation.z = Math.random() * 360;
          smokeParticles.push(smokeMeshes[limit]);
          scene.add(smokeMeshes[limit]);
        }
      }
    );
  }

  addBackground() {
    const { scene } = this;
    const textureLoader = new THREE.TextureLoader();
    const textGeometry = new THREE.PlaneGeometry(600, 320);
    textureLoader.load(
      "https://rawgit.com/marcobiedermann/playground/master/three.js/smoke-particles/dist/assets/images/background.jpg",
      (texture) => {
        const textMaterial = new THREE.MeshLambertMaterial({
          blending: THREE.AdditiveBlending,
          color: 0xffffff,
          map: texture,
          opacity: 1,
          transparent: true,
        });
        textMaterial.map.minFilter = THREE.LinearFilter;
        const text = new THREE.Mesh(textGeometry, textMaterial);

        text.position.z = 800;
        scene.add(text);
      }
    );
  }

  render() {
    const { mesh } = this;
    let { cubeSineDriver } = this;

    cubeSineDriver += 0.01;

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    mesh.position.z = 100 + Math.sin(cubeSineDriver) * 500;

    this.renderer.render(this.scene, this.camera);
  }

  update() {
    this.evolveSmoke(this.clock.getDelta());
    this.render();

    requestAnimationFrame(this.update.bind(this));
  }

  onResize() {
    const { camera } = this;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    this.renderer.setSize(windowWidth, windowHeight);
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize);
  }
}

const smoke = new Smoke();
smoke.update();

/**
 * Animation
 */
/*
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
*/
