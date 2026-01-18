import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let config, mixer, actions = {}, currentAction = null, model = null;
const clock = new THREE.Clock();

async function init() {
    if (window.location.protocol === 'file:') {
        alert("⚠️ Security Warning (CORS)\n\nPlease use a Local Server.");
    }

    try {
        const response = await fetch('config.json');
        config = await response.json();
        
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1e1e1e);
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 5);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas-container').appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 5);
        scene.add(dirLight);
        
        const loader = new GLTFLoader();
        loader.load(config.modelFile, (gltf) => {
            model = gltf.scene;
            scene.add(model);
            
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
                
                // 全域預設 (如果有)
                let globalDefaultAnim = gltf.animations[0];
                if (config.sourceAnimationName) {
                    const found = gltf.animations.find(a => a.name === config.sourceAnimationName);
                    if (found) globalDefaultAnim = found;
                }
                
                config.clips.forEach(clipConfig => {
                    let targetAnim = globalDefaultAnim;
                    
                    // [關鍵修正] 優先使用 Clip 自己的 sourceAnim
                    if (clipConfig.sourceAnim && clipConfig.sourceAnim !== "") {
                         const exactMatch = gltf.animations.find(a => a.name === clipConfig.sourceAnim);
                         if (exactMatch) targetAnim = exactMatch;
                    } 
                    // 原樣匯出模式的 Fallback
                    else if (!config.sourceAnimationName) {
                        const nameMatch = gltf.animations.find(a => a.name === clipConfig.name);
                        if (nameMatch) targetAnim = nameMatch;
                    }
                    
                    const fps = 30;
                    const subClip = THREE.AnimationUtils.subclip(
                        targetAnim,
                        clipConfig.name,
                        Math.floor(clipConfig.start * fps),
                        Math.floor(clipConfig.end * fps),
                        fps
                    );
                    const action = mixer.clipAction(subClip);
                    action.timeScale = clipConfig.speed || 1.0;
                    if (!clipConfig.loop) {
                        action.setLoop(THREE.LoopOnce);
                        action.clampWhenFinished = true;
                    }
                    actions[clipConfig.name] = action;
                });
                
                createAnimationButtons();
            }
        });

        function animate() {
            requestAnimationFrame(animate);
            if (mixer) mixer.update(clock.getDelta());
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        window.onresize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
    } catch (e) { console.error(e); }
}

function createAnimationButtons() {
    const container = document.getElementById('button-container');
    if(!container) return;
    container.innerHTML = '';
    config.clips.forEach(clip => {
        const button = document.createElement('button');
        button.textContent = clip.name;
        button.onclick = () => playAnimation(clip.name);
        container.appendChild(button);
    });
}

function playAnimation(name) {
    if (currentAction) currentAction.fadeOut(0.3);
    currentAction = actions[name];
    if (currentAction) {
        currentAction.reset().fadeIn(0.3).play();
        const info = document.getElementById('current-animation') || document.getElementById('info');
        if (info) info.textContent = `Current: ${name}`;
    }
}
init();
