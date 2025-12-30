import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as THREE from "three";
import { useParams } from 'react-router-dom';
import axios from 'axios'
import Helmet from 'react-helmet';

function View() {
	let { id } = useParams();

	const productId = String(id);

	const getFetchData = async () => {
		await axios.post("http://localhost:8080/costume/info/" + productId).then((res) => {
			let data = res.data[0];
			if (data.exists) {
				init(data.irochi);
				animate();
			} else {
				alert("잘못된 접근입니다.");
				window.close();
			}
		}).catch(error => {
			alert("오류가 발생했습니다.");
			return Promise.reject(error);
		})
	}
	getFetchData();

	let camera, scene, scene2, renderer, stats, effect;

	let ani = true;

	const clock = new THREE.Clock();

	let mixer, mixer2;

	let animationActions = [];
	let activeAction;
	let lastAction;
	let animationActions2 = [];
	let activeAction2;
	let lastAction2;

	const crossFadeControls = [];
	let currentAction = 0; // default

	function init(irochi) {
		const container = document.createElement('div');
		container.setAttribute("id", "three");

		document.body.appendChild(container);

		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
		//camera.position.set(100, 200, 300);
		camera.position.set(0, 130, 250); // 정면
		//camera.position.set(-260, 100, 0); // 오른쪽 카메라

		scene = new THREE.Scene();
		scene2 = new THREE.Scene();
		scene.background = new THREE.Color(0xa0a0a0);
		scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
		scene2.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

		const ambient = new THREE.AmbientLight(0xffffff);
		scene.add(ambient);
		const ambient2 = new THREE.AmbientLight(0xffffff);
		scene2.add(ambient2);

		// ground
		const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false }));
		mesh.rotation.x = - Math.PI / 2;
		//mesh.receiveShadow = true;
		scene2.add(mesh);

		const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
		grid.material.opacity = 0.2;
		grid.material.transparent = true;
		scene2.add(grid);

		// model
		const loadingManager = new THREE.LoadingManager(() => {

			// const loadingScreen = document.getElementById('loading-screen');
			// loadingScreen.classList.add('fade-out');

			// // optional: remove loader from DOM via event listener
			// loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
		});
		// loadingManager.onProgress = function (item, loaded, total) {
		//  	console.log(item, loaded, total);
		// };
		loadingManager.onLoad = function () {


			const loadingScreen = document.getElementById('loading-screen');
			loadingScreen.classList.add('fade-out');

			// optional: remove loader from DOM via event listener
			loadingScreen.addEventListener('transitionend', onTransitionEnd);
			//console.log("loaded all resources");
		}
		const loader = new FBXLoader(loadingManager);

		loader.resourcePath = 'a/b/c/';

		//let bodyURL = require(`./models/${productId}/model.fbx`);
		// let bodyTextureURL = require(`./models/${productId}/body.png`);
		// let faceTextureURL = require(`./models/${productId}/head.png`);
		let bodyURL = `http://localhost:8080/costume/model/${productId}`;
		let bodyTextureURL = `http://localhost:8080/costume/texture/${productId}/body`;
		let faceTextureURL = `http://localhost:8080/costume/texture/${productId}/head`;

		const textureLoader = new THREE.TextureLoader(loadingManager);
		let bodyTexture = textureLoader.load(bodyTextureURL);
		let faceTexture = textureLoader.load(faceTextureURL);

		let bodyTextureURL_Irochi;
		let faceTextureURL_Irochi;
		let bodyTexture_Irochi;
		let faceTexture_Irochi;

		if (irochi) {
			bodyTextureURL_Irochi = `http://localhost:8080/costume/texture/${productId}/body_c1`;
			faceTextureURL_Irochi = `http://localhost:8080/costume/texture/${productId}/head_c1`;
			bodyTexture_Irochi = textureLoader.load(bodyTextureURL_Irochi);
			faceTexture_Irochi = textureLoader.load(faceTextureURL_Irochi);
		}

		let headObject;

		loader.load(bodyURL, function (object) {
			headObject = object;

			mixer2 = new THREE.AnimationMixer(object);

			//mixer2.clipAction(object.animations[0]).play();

			object.scale.set(100, 100, 100);

			object.traverse(function (child) {
				if (child.isMesh) {
					if (child.name === "Mouth") {
						child.visible = false;
					} else if (child.name.indexOf("Eye") === -1) {
						child.visible = false;
					} else if (child.name === "RinNyaEye_Overlay") {
						child.visible = false;
					}
					let oldMaterial = child.material;
					let toonMaterial = new THREE.MeshToonMaterial({
						//gradientMap: threeTone,
						map: oldMaterial.map,
						normalMap: oldMaterial.normalMap
					});
					child.material = toonMaterial;
					child.material.map = faceTexture;
					if (child.morphTargetInfluences && child.name !== "Mouth") {
						const morphFolder = facialFolder.addFolder(child.name);
						morphFolder.close();
						for (let i = 0; i < child.morphTargetInfluences.length; i++) {
							const ctrl = morphFolder.add(child.morphTargetInfluences, i, 0, 1, 0.01).listen();
							Object.keys(child.morphTargetDictionary).forEach((key) => {
							  if (key && child.morphTargetDictionary[key] === i) ctrl.name(key);
							});
						}
					}
				}
			});
			scene2.add(object);

			let animationAction = mixer2.clipAction(object.animations[0]);
			animationActions2.push(animationAction);
			activeAction2 = animationActions2[0];
		});

		let bodyObject;

		loader.load(bodyURL, function (object) {
			bodyObject = object;

			mixer = new THREE.AnimationMixer(object);

			object.scale.set(100, 100, 100);

			object.traverse(function (child) {

				if (child.isMesh) {
					if (child.name.indexOf("Eye") !== -1) {
						child.visible = false;
					}
					let oldMaterial = child.material;
					let toonMaterial = new THREE.MeshToonMaterial({
						map: oldMaterial.map,
						normalMap: oldMaterial.normalMap
					});
					child.material = toonMaterial;
					if (child.name === "Body") {
						child.material.map = bodyTexture;
					} else if (child.name.indexOf("Shadow") !== -1) {
						child.visible = false;
					} else if (child.name === "RinNyaEye_Overlay") {
						child.visible = false;
					} else {
						child.material.map = faceTexture;
					}
					if (child.morphTargetInfluences && child.name === "Mouth") {
						const morphFolder = facialFolder.addFolder(child.name);
						morphFolder.close();
						for (let i = 0; i < child.morphTargetInfluences.length; i++) {
							const ctrl = morphFolder.add(child.morphTargetInfluences, i, 0, 1, 0.01).listen();
							Object.keys(child.morphTargetDictionary).forEach((key) => {
							  if (key && child.morphTargetDictionary[key] === i) ctrl.name(key);
							});
						}
					}
				}
				if (child.name.indexOf("BreastSize") === 0) {
					child.scale.set(1.04, 1.02, 1.04);
				}
			});

			scene.add(object);

			let animationAction = mixer.clipAction(object.animations[0]);
			animationActions.push(animationAction);
			crossFadeControls.push(animationsFolder.add(animations_Muse, 'default'));
			activeAction = animationActions[0];


			loader.load(require(`./models/ch0301_GEN_preview1_L.fbx`), function (object) {
				let animationAction = mixer.clipAction(object.animations[0]);
				animationActions.push(animationAction);
				crossFadeControls.push(animationsFolder.add(animations_Muse, 'preview'));
				animationAction = mixer2.clipAction(object.animations[0]);
				animationActions2.push(animationAction);

				loader.load(require(`./models/ch0001_HNK_idle1_L.fbx`), function (object) {
					let animationAction = mixer.clipAction(object.animations[0]);
					animationActions.push(animationAction);
					crossFadeControls.push(animationsFolder_Muse.add(animations_Muse, 'honoka'));
					animationAction = mixer2.clipAction(object.animations[0]);
					animationActions2.push(animationAction);

					loader.load(require(`./models/ch0002_ERI_idle1_L.fbx`), function (object) {
						let animationAction = mixer.clipAction(object.animations[0]);
						animationActions.push(animationAction);
						crossFadeControls.push(animationsFolder_Muse.add(animations_Muse, 'eri'));
						animationAction = mixer2.clipAction(object.animations[0]);
						animationActions2.push(animationAction);

						loader.load(require(`./models/ch0003_KTR_idle1_L.fbx`), function (object) {
							let animationAction = mixer.clipAction(object.animations[0]);
							animationActions.push(animationAction);
							crossFadeControls.push(animationsFolder_Muse.add(animations_Muse, 'kotori'));
							animationAction = mixer2.clipAction(object.animations[0]);
							animationActions2.push(animationAction);

							loader.load(require(`./models/ch0004_UMI_idle1_L.fbx`), function (object) {
								let animationAction = mixer.clipAction(object.animations[0]);
								animationActions.push(animationAction);
								crossFadeControls.push(animationsFolder_Muse.add(animations_Muse, 'umi'));
								animationAction = mixer2.clipAction(object.animations[0]);
								animationActions2.push(animationAction);

								loader.load(require(`./models/ch0005_RIN_idle1_L.fbx`), function (object) {
									let animationAction = mixer.clipAction(object.animations[0]);
									animationActions.push(animationAction);
									crossFadeControls.push(animationsFolder_Muse.add(animations_Muse, 'rin'));
									animationAction = mixer2.clipAction(object.animations[0]);
									animationActions2.push(animationAction);

									loader.load(require(`./models/ch0006_MAK_idle1_L.fbx`), function (object) {
										let animationAction = mixer.clipAction(object.animations[0]);
										animationActions.push(animationAction);
										crossFadeControls.push(animationsFolder_Muse.add(animations_Muse, 'maki'));
										animationAction = mixer2.clipAction(object.animations[0]);
										animationActions2.push(animationAction);

										loader.load(require(`./models/ch0007_NZM_idle1_L.fbx`), function (object) {
											let animationAction = mixer.clipAction(object.animations[0]);
											animationActions.push(animationAction);
											crossFadeControls.push(animationsFolder_Muse.add(animations_Muse, 'nozomi'));
											animationAction = mixer2.clipAction(object.animations[0]);
											animationActions2.push(animationAction);

											loader.load(require(`./models/ch0008_HNY_idle1_L.fbx`), function (object) {
												let animationAction = mixer.clipAction(object.animations[0]);
												animationActions.push(animationAction);
												crossFadeControls.push(animationsFolder_Muse.add(animations_Muse, 'hanayo'));
												animationAction = mixer2.clipAction(object.animations[0]);
												animationActions2.push(animationAction);

												loader.load(require(`./models/ch0009_NIK_idle1_L.fbx`), function (object) {
													let animationAction = mixer.clipAction(object.animations[0]);
													animationActions.push(animationAction);
													crossFadeControls.push(animationsFolder_Muse.add(animations_Muse, 'nico'));
													animationAction = mixer2.clipAction(object.animations[0]);
													animationActions2.push(animationAction);

													loader.load(require(`./models/ch0101_CHK_idle1_L.fbx`), function (object) {
														let animationAction = mixer.clipAction(object.animations[0]);
														animationActions.push(animationAction);
														crossFadeControls.push(animationsFolder_Aqours.add(animations_Aqours, 'chika'));
														animationAction = mixer2.clipAction(object.animations[0]);
														animationActions2.push(animationAction);

														loader.load(require(`./models/ch0102_RIK_idle1_L.fbx`), function (object) {
															let animationAction = mixer.clipAction(object.animations[0]);
															animationActions.push(animationAction);
															crossFadeControls.push(animationsFolder_Aqours.add(animations_Aqours, 'riko'));
															animationAction = mixer2.clipAction(object.animations[0]);
															animationActions2.push(animationAction);

															loader.load(require(`./models/ch0103_KNN_idle1_L.fbx`), function (object) {
																let animationAction = mixer.clipAction(object.animations[0]);
																animationActions.push(animationAction);
																crossFadeControls.push(animationsFolder_Aqours.add(animations_Aqours, 'kanan'));
																animationAction = mixer2.clipAction(object.animations[0]);
																animationActions2.push(animationAction);

																loader.load(require(`./models/ch0104_DIY_idle1_L.fbx`), function (object) {
																	let animationAction = mixer.clipAction(object.animations[0]);
																	animationActions.push(animationAction);
																	crossFadeControls.push(animationsFolder_Aqours.add(animations_Aqours, 'dia'));
																	animationAction = mixer2.clipAction(object.animations[0]);
																	animationActions2.push(animationAction);

																	loader.load(require(`./models/ch0105_YOU_idle1_L.fbx`), function (object) {
																		let animationAction = mixer.clipAction(object.animations[0]);
																		animationActions.push(animationAction);
																		crossFadeControls.push(animationsFolder_Aqours.add(animations_Aqours, 'you'));
																		animationAction = mixer2.clipAction(object.animations[0]);
																		animationActions2.push(animationAction);

																		loader.load(require(`./models/ch0106_YSK_idle1_L.fbx`), function (object) {
																			let animationAction = mixer.clipAction(object.animations[0]);
																			animationActions.push(animationAction);
																			crossFadeControls.push(animationsFolder_Aqours.add(animations_Aqours, 'yoshiko'));
																			animationAction = mixer2.clipAction(object.animations[0]);
																			animationActions2.push(animationAction);

																			loader.load(require(`./models/ch0107_HNM_idle1_L.fbx`), function (object) {
																				let animationAction = mixer.clipAction(object.animations[0]);
																				animationActions.push(animationAction);
																				crossFadeControls.push(animationsFolder_Aqours.add(animations_Aqours, 'hanamaru'));
																				animationAction = mixer2.clipAction(object.animations[0]);
																				animationActions2.push(animationAction);

																				loader.load(require(`./models/ch0108_MRI_idle1_L.fbx`), function (object) {
																					let animationAction = mixer.clipAction(object.animations[0]);
																					animationActions.push(animationAction);
																					crossFadeControls.push(animationsFolder_Aqours.add(animations_Aqours, 'mari'));
																					animationAction = mixer2.clipAction(object.animations[0]);
																					animationActions2.push(animationAction);

																					loader.load(require(`./models/ch0109_RBY_idle1_L.fbx`), function (object) {
																						let animationAction = mixer.clipAction(object.animations[0]);
																						animationActions.push(animationAction);
																						crossFadeControls.push(animationsFolder_Aqours.add(animations_Aqours, 'ruby'));
																						animationAction = mixer2.clipAction(object.animations[0]);
																						animationActions2.push(animationAction);

																						loader.load(require(`./models/ch0201_AYM_idle1_L.fbx`), function (object) {
																							let animationAction = mixer.clipAction(object.animations[0]);
																							animationActions.push(animationAction);
																							crossFadeControls.push(animationsFolder_Niji.add(animations_Niji, 'ayumu'));
																							animationAction = mixer2.clipAction(object.animations[0]);
																							animationActions2.push(animationAction);

																							loader.load(require(`./models/ch0202_KSM_idle1_L.fbx`), function (object) {
																								let animationAction = mixer.clipAction(object.animations[0]);
																								animationActions.push(animationAction);
																								crossFadeControls.push(animationsFolder_Niji.add(animations_Niji, 'kasumi'));
																								animationAction = mixer2.clipAction(object.animations[0]);
																								animationActions2.push(animationAction);

																								loader.load(require(`./models/ch0203_SZK_idle1_L.fbx`), function (object) {
																									let animationAction = mixer.clipAction(object.animations[0]);
																									animationActions.push(animationAction);
																									crossFadeControls.push(animationsFolder_Niji.add(animations_Niji, 'shizuku'));
																									animationAction = mixer2.clipAction(object.animations[0]);
																									animationActions2.push(animationAction);

																									loader.load(require(`./models/ch0204_KRN_idle1_L.fbx`), function (object) {
																										let animationAction = mixer.clipAction(object.animations[0]);
																										animationActions.push(animationAction);
																										crossFadeControls.push(animationsFolder_Niji.add(animations_Niji, 'karin'));
																										animationAction = mixer2.clipAction(object.animations[0]);
																										animationActions2.push(animationAction);

																										loader.load(require(`./models/ch0205_AII_idle1_L.fbx`), function (object) {
																											let animationAction = mixer.clipAction(object.animations[0]);
																											animationActions.push(animationAction);
																											crossFadeControls.push(animationsFolder_Niji.add(animations_Niji, 'ai'));
																											animationAction = mixer2.clipAction(object.animations[0]);
																											animationActions2.push(animationAction);

																											loader.load(require(`./models/ch0206_KNT_idle1_L.fbx`), function (object) {
																												let animationAction = mixer.clipAction(object.animations[0]);
																												animationActions.push(animationAction);
																												crossFadeControls.push(animationsFolder_Niji.add(animations_Niji, 'kanata'));
																												animationAction = mixer2.clipAction(object.animations[0]);
																												animationActions2.push(animationAction);

																												loader.load(require(`./models/ch0207_STN_idle1_L.fbx`), function (object) {
																													let animationAction = mixer.clipAction(object.animations[0]);
																													animationActions.push(animationAction);
																													crossFadeControls.push(animationsFolder_Niji.add(animations_Niji, 'setsuna'));
																													animationAction = mixer2.clipAction(object.animations[0]);
																													animationActions2.push(animationAction);

																													loader.load(require(`./models/ch0208_VLD_idle1_L.fbx`), function (object) {
																														let animationAction = mixer.clipAction(object.animations[0]);
																														animationActions.push(animationAction);
																														crossFadeControls.push(animationsFolder_Niji.add(animations_Niji, 'emma'));
																														animationAction = mixer2.clipAction(object.animations[0]);
																														animationActions2.push(animationAction);

																														loader.load(require(`./models/ch0209_RNA_idle1_L.fbx`), function (object) {
																															let animationAction = mixer.clipAction(object.animations[0]);
																															animationActions.push(animationAction);
																															crossFadeControls.push(animationsFolder_Niji.add(animations_Niji, 'rina'));
																															animationAction = mixer2.clipAction(object.animations[0]);
																															animationActions2.push(animationAction);

																															loader.load(require(`./models/ch0210_SOR_idle1_L.fbx`), function (object) {
																																let animationAction = mixer.clipAction(object.animations[0]);
																																animationActions.push(animationAction);
																																crossFadeControls.push(animationsFolder_Niji.add(animations_Niji, 'shioriko'));
																																animationAction = mixer2.clipAction(object.animations[0]);
																																animationActions2.push(animationAction);

																																loader.load(require(`./models/ch0211_RNJ_idle1_L.fbx`), function (object) {
																																	let animationAction = mixer.clipAction(object.animations[0]);
																																	animationActions.push(animationAction);
																																	crossFadeControls.push(animationsFolder_Niji.add(animations_Niji, 'lanzhu'));
																																	animationAction = mixer2.clipAction(object.animations[0]);
																																	animationActions2.push(animationAction);

																																	loader.load(require(`./models/ch0212_MIA_idle1_L.fbx`), function (object) {
																																		let animationAction = mixer.clipAction(object.animations[0]);
																																		animationActions.push(animationAction);
																																		crossFadeControls.push(animationsFolder_Niji.add(animations_Niji, 'mia'));
																																		animationAction = mixer2.clipAction(object.animations[0]);
																																		animationActions2.push(animationAction);

																																		crossFadeControls.forEach(function (control) {
																																			control.setInactive = function () {
																																				control.domElement.classList.add('control-inactive');
																																			};

																																			control.setActive = function () {
																																				control.domElement.classList.remove('control-inactive');
																																			};

																																			if (control.property !== "default") {
																																				control.setInactive();
																																			}
																																		});
																																	});
																																});
																															});
																														});
																													});
																												});
																											});
																										});
																									});
																								});
																							});
																						});
																					});
																				});
																			});
																		});
																	});
																});
															});
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});


		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);

		container.appendChild(renderer.domElement);

		effect = new OutlineEffect(renderer, {
			defaultThickness: 0.001,
			defaultColor: [0, 0, 0],
			defaultAlpha: 0.8,
			defaultKeepAlive: true
		});
		effect.shadowMap.enabled = true;
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.target.set(0, 100, 0);
		controls.update();

		window.addEventListener('resize', onWindowResize);

		// stats
		stats = new Stats();
		container.appendChild(stats.dom);

		const api = {
			'animation': true,
			'outline': true,
			'Grid': true,
			'Fog': true,
			'Irochi': false,
		};

		const gui = new GUI({ autoPlace: false });

		var customContainer = document.getElementById('three');
		customContainer.appendChild(gui.domElement);

		gui.add(api, 'animation').onChange(function () {

			ani = api['animation'];

		});

		gui.add(api, 'outline').onChange(function () {

			effect.enabled = api['outline'];

		});

		gui.add(api, 'Grid').onChange(function () {
			grid.traverse(function (child) {
				child.visible = api['Grid'];
			})
		});

		gui.add(api, 'Fog').onChange(function () {
			if (api['Fog']) {
				scene.fog.near = 200;
				scene.fog.far = 1000;
				scene2.fog.near = 200;
				scene2.fog.far = 1000;
			} else {
				scene.fog.near = 0.1;
				scene.fog.far = 0;
				scene2.fog.near = 0.1;
				scene2.fog.far = 0;
			}
		});

		if (irochi) {
			gui.add(api, 'Irochi').onChange(function () {
				let face_texture, body_texture;
				if (api['Irochi']) {
					face_texture = faceTexture_Irochi;
					body_texture = bodyTexture_Irochi;
				} else {
					face_texture = faceTexture;
					body_texture = bodyTexture;
				}
				headObject.traverse(function (child) {

					if (child.isMesh) {
						if (child.name === "Mouth") {
							child.visible = false;
						}
						if (child.name.indexOf("Eye") === -1) {
							child.visible = false;
						}
						let oldMaterial = child.material;
						let toonMaterial = new THREE.MeshToonMaterial({
							map: oldMaterial.map,
							normalMap: oldMaterial.normalMap
						});
						child.material = toonMaterial;
						child.material.map = face_texture;
					}
				});
				bodyObject.traverse(function (child) {

					if (child.isMesh) {
						if (child.name.indexOf("Eye") !== -1) {
							child.visible = false;
						}
						let oldMaterial = child.material;
						let toonMaterial = new THREE.MeshToonMaterial({
							map: oldMaterial.map,
							normalMap: oldMaterial.normalMap
						});
						child.material = toonMaterial;
						if (child.name === "Body") {
							child.material.map = body_texture;
						} else if (child.name.indexOf("Shadow") !== -1) {
							child.visible = false;
						} else {
							child.material.map = face_texture;
						}
					}
				});
			});
		}

		const facialFolder = gui.addFolder('Facial');

		facialFolder.close();

		const animationsFolder = gui.addFolder('Animations');

		const animationsFolder_Muse = animationsFolder.addFolder('μ’s');
		const animationsFolder_Aqours = animationsFolder.addFolder('Aqours');
		const animationsFolder_Niji = animationsFolder.addFolder('Nijigasaki');

		animationsFolder_Muse.close();
		animationsFolder_Aqours.close();
		animationsFolder_Niji.close();

		var animations_Muse = {
			default: function () {
				setAction(0);
			},
			preview: function () {
				setAction(1);
			},
			honoka: function () {
				setAction(2);
			},
			eri: function () {
				setAction(3);
			},
			kotori: function () {
				setAction(4);
			},
			umi: function () {
				setAction(5);
			},
			rin: function () {
				setAction(6);
			},
			maki: function () {
				setAction(7);
			},
			nozomi: function () {
				setAction(8);
			},
			hanayo: function () {
				setAction(9);
			},
			nico: function () {
				setAction(10);
			}
		}
		var animations_Aqours = {
			chika: function () {
				setAction(11);
			},
			riko: function () {
				setAction(12);
			},
			kanan: function () {
				setAction(13);
			},
			dia: function () {
				setAction(14);
			},
			you: function () {
				setAction(15);
			},
			yoshiko: function () {
				setAction(16);
			},
			hanamaru: function () {
				setAction(17);
			},
			mari: function () {
				setAction(18);
			},
			ruby: function () {
				setAction(19);
			}
		}
		var animations_Niji = {
			ayumu: function () {
				setAction(20);
			},
			kasumi: function () {
				setAction(21);
			},
			shizuku: function () {
				setAction(22);
			},
			karin: function () {
				setAction(23);
			},
			ai: function () {
				setAction(24);
			},
			kanata: function () {
				setAction(25);
			},
			setsuna: function () {
				setAction(26);
			},
			emma: function () {
				setAction(27);
			},
			rina: function () {
				setAction(28);
			},
			shioriko: function () {
				setAction(29);
			},
			lanzhu: function () {
				setAction(30);
			},
			mia: function () {
				setAction(31);
			}
		}
		const setAction = (idx) => {
			let toAction = animationActions[idx];
			if (toAction !== activeAction) {
				lastAction = activeAction;
				activeAction = toAction;
				lastAction.fadeOut(1);
				activeAction.reset();
				activeAction.fadeIn(1);
				activeAction.play();

				setAction2(idx);
				aniUpdate(idx);
			}
		}
		const setAction2 = (idx) => {
			let toAction = animationActions2[idx];
			if (toAction !== activeAction2) {
				lastAction2 = activeAction2;
				activeAction2 = toAction;
				lastAction2.fadeOut(1);
				activeAction2.reset();
				activeAction2.fadeIn(1);
				activeAction2.play();
			}
		}

		function aniUpdate(toAction) {
			currentAction = toAction;
			for (var i = 0; i < crossFadeControls.length; ++i) {
				if (i !== currentAction) {
					crossFadeControls[i].setInactive();
				} else {
					crossFadeControls[i].setActive();
				}
			}
		}

		window.addEventListener('keydown', onKeyDown, false);
		
		function onKeyDown(event) {
			//controls.reset();
			switch( event.keyCode ) {
				case 49:
				case 97: // front
					camera.position.set(0, 130, 250);
					break;
				case 57:
				case 105: // back
					camera.position.set(0, 130, -250);
					break;
				case 52:
				case 100: // right
					camera.position.set(-250, 130, 0);
					break;
				case 54:
				case 102: // left
					camera.position.set(250, 130, 0);
					break;
				default:
					break;
			}
			//console.log(event.keyCode);
			//camera.lookAt(THREE.Vector3(0, 0, 0));
			camera.updateProjectionMatrix();
			controls.target.set(0, 100, 0);
			controls.update();
		};
		renderer.autoClear = false;
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

	}

	//
	// renderer.autoClear = false;
	function animate() {
		requestAnimationFrame(animate);

		const delta = clock.getDelta();

		if (ani) {
			if (mixer) mixer.update(delta);

			if (mixer2) mixer2.update(delta);
		}

		effect.render(scene, camera);
		renderer.render(scene2, camera);

		stats.update();
	}

	function onTransitionEnd(event) {
		event.target.remove();
	}

	return (
		<>
			<Helmet>
				<style>
					{`
			   			body {
							overflow: hidden;
							margin: 0;
							width: 100%;
							height: 100%;
			  			}
			  		`}
				</style>
			</Helmet>
			<section id="loading-screen">
				<div id="loader"></div>
			</section>
		</>
	);
}

export default View;