
import {
	Scene, PerspectiveCamera, WebGLRenderer, Group, Box3, Vector3, CameraHelper,
	Color, Mesh, AxesHelper, PlaneBufferGeometry, MeshPhongMaterial,
	AmbientLight, PointLight, HemisphereLight, DirectionalLight, Clock
} from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
//
import customObject from "url:~/src/static/assets/garment/GARMENT_01.obj";
// import customObject from "url:~/src/static/assets/suit1/simple-basic-men-suit.obj";
// import customObject from "url:~/src/static/assets/suit2/suit2.obj";
// import customObject from "url:~/src/static/assets/HKY.obj";

let camera, scene, renderer;

init();
animate();

function init() {
	clock = new Clock();
	scene = new Scene();
	scene.background = new Color(0xa0a0a0);

	const hemiLight = new HemisphereLight(0xffffff, 0x444444);
	hemiLight.position.set(0, 20, 0);
	scene.add(hemiLight);

	const dirLight = new DirectionalLight(0xffffff);
	dirLight.position.set(3, 10, 10);
	dirLight.castShadow = true;
	dirLight.shadow.camera.top = 2;
	dirLight.shadow.camera.bottom = - 2;
	dirLight.shadow.camera.left = - 2;
	dirLight.shadow.camera.right = 2;
	dirLight.shadow.camera.near = 0.1;
	dirLight.shadow.camera.far = 40;
	scene.add(dirLight);

	// const mesh = new Mesh(new PlaneBufferGeometry(100, 100), new MeshPhongMaterial({ color: 'gray', depthWrite: false }));
	// mesh.rotation.x = Math.PI * -.5;
	// mesh.receiveShadow = true;
	// scene.add(mesh);

	renderer = new WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement);

	// camera
	camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
	camera.position.set(1, 0.1, 20);

	// controls
	const controls = new OrbitControls(camera, renderer.domElement);
	// controls.minDistance = 20;
	// controls.maxDistance = 50;
	// controls.enablePan = false;
	controls.enableZoom = true;
	controls.target.set(0, 1, 0);
	controls.update();

	const loader = new OBJLoader();
	loader.load(
		// resource URL
		customObject,
		// called when resource is loaded
		object => {
			console.log(object);

			var box = new Box3().setFromObject(object);
			var size = new Vector3();
			box.getSize(size);
			var scaleVec = new Vector3(10, 10, 10).divide(size);
			var scale = Math.min(scaleVec.x, Math.min(scaleVec.y, scaleVec.z));
			object.scale.setScalar(scale);
			object.position.set(0, -5, -4);
			scene.add(object);
		},
		xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
		error => console.log(error, 'An error happened')
	);

	// helper
	scene.add(new AxesHelper(30));
	const cameraHelper = new CameraHelper(camera);
	scene.add(cameraHelper);
	window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	renderer.render(scene, camera);
}

