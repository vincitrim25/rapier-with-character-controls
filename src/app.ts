import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'
import { Camera } from 'three'
import { useCamera, useGui, useRenderSize, useScene } from './render/init'
import { addPhysics } from './render/physics/physics'
import { depth } from 'three/examples/jsm/nodes/Nodes.js'

const startApp = async () => {
    // three
    const scene = useScene();
    const camera = useCamera();
    camera.position.x += 10;
    camera.position.y += 10;
    camera.lookAt(new THREE.Vector3(0));
    const gui = useGui();
    const {width, height} = useRenderSize();

    const dirLight = new THREE.DirectionalLight('#ffffff', 1);
    dirLight.position.x += .5;
    dirLight.position.y += 1;

    const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
    const ambientLight = new THREE.AmbientLight('#ffffff', .5);
    scene.add(dirLight, ambientLight);
    
    const _addGroundMesh = () => {
        const planeWidth = 100;
        const planeHeight = 100;

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const material = new THREE.MeshPhysicalMaterial({
            color: '#333',
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(geometry, material);

        const collider = addPhysics(
            plane,
            'fixed',
            true,
            () => {
                plane.rotation.x -= Math.PI / 2;
            },
            'cuboid',
            {
                width: planeWidth / 2,
                height: 0.001,
                depth: planeHeight / 2
            }
        ).collider;

        scene.add(plane);
    }

    _addGroundMesh();

    const _addCubeMesh = (pos: THREE.Vector3) => {
        const size = 6

        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color().setHex(Math.min(Math.random() + 0.15, 1) * 0xffffff),
            side: THREE.DoubleSide
        });
        const cube = new THREE.Mesh(geometry, material);

        cube.position.copy(pos);
        cube.position.y += 2;

        const collider = addPhysics(cube, 'dynamic', true, undefined, 'cuboid', {
            width: size / 2,
            height: size / 2,
            depth: size / 2
        }).collider;

        scene.add(cube);
    }

    const NUM_CUBES = 10;
    for(let i = 0; i < NUM_CUBES; i++){
        _addCubeMesh(
            new THREE.Vector3((Math.random() - 0.5) * 20, 10 + i * 5, (Math.random() - 0.5) * 20 )
        );
    }

}

export default startApp