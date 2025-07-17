import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { MindARThree } from 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js';

const loadGLTF = (path) => {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader(); 
        loader.load(path, (gltf) => resolve(gltf), undefined, (error) => reject(error));
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {
        const mindARInstance = new MindARThree({
            container: document.body,
            imageTargetSrc: './mind/targets1.mind',
            maxTrack: 3
        });

        const { renderer, scene, camera } = mindARInstance;

        const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
        scene.add(light);

        try {
            const chair = await loadGLTF('./mo/Chair.glb');
            chair.scene.scale.set(0.2, 0.2, 0.2);         // ⬅️ ปรับให้เล็กลง
            chair.scene.position.set(0, 0, 0.5);          // ⬅️ ใกล้กล้อง

            const dining = await loadGLTF('./mo/Dining.glb');
            dining.scene.scale.set(0.2, 0.2, 0.2);
            dining.scene.position.set(0, 0, 0.5);

            const office = await loadGLTF('./mo/Office.glb');
            office.scene.scale.set(0.2, 0.2, 0.2);
            office.scene.position.set(0, 0, 0.5);

            // Anchor แต่ละโมเดล
            const chairAnchor = mindARInstance.addAnchor(0);
            chairAnchor.group.add(chair.scene);

            const diningAnchor = mindARInstance.addAnchor(1);
            diningAnchor.group.add(dining.scene);

            const officeAnchor = mindARInstance.addAnchor(2);
            officeAnchor.group.add(office.scene);

            await mindARInstance.start();

            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera);
            });
        } catch (error) {
            console.error('Error loading models:', error);
        }
    };

    start();
});
