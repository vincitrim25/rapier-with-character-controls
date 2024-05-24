import RAPIER from '@dimforge/rapier3d'
import * as THREE from 'three'
import { usePhysics, usePhysicsObjects } from '../init'

export type PhysicsObject = {
    mesh: THREE.Mesh,
    collider: RAPIER.Collider,
    rigidBody: RAPIER.RigidBody,
    fn?: Function,
    autoAnimate: boolean
}

export const addPhysics = (
    mesh: THREE.Mesh,
    rigidBodyType: string,
    autoAnimate: boolean = true,
    postPhysicsFn?: Function,
    colliderType?: string,
    colliderSettings?: any
) => {
    const physics = usePhysics()
    const physicsObjects = usePhysicsObjects()
    
    const rigidBodyDesc = (RAPIER.RigidBodyDesc as any)[rigidBodyType]()
    rigidBodyDesc.setTranslation(mesh.position.x, mesh.position.y, mesh.position.z)

    const rigidBody = physics.createRigidBody(rigidBodyDesc);

    let colliderDesc

    switch (colliderType) {
        case 'cuboid':
            {
                const {width, height, depth} = colliderSettings
                colliderDesc = RAPIER.ColliderDesc.cuboid(width, height, depth)
            }
            break;
        case 'ball':
            {
                const { radius } = colliderSettings
                colliderDesc = RAPIER.ColliderDesc.ball(radius);
            }
            break;
        case 'capsule':
            {
                const { halfHeight, radius } = colliderSettings
                colliderDesc = RAPIER.ColliderDesc.capsule(halfHeight, radius)
            }
            break;
        default:
            {
                colliderDesc = RAPIER.ColliderDesc.trimesh(
                    mesh.geometry.attributes.position.array as Float32Array,
                    mesh.geometry.index?.array as Uint32Array
                )
            }
            break; 
    }

    if(!colliderDesc){
        console.error('Coolider mesh error: creation failed')
    }

    const collider = physics.createCollider(colliderDesc, rigidBody);

    const physicsObject: PhysicsObject = {mesh, collider, rigidBody, fn: postPhysicsFn, autoAnimate}

    physicsObjects.push(physicsObject);

    return physicsObject;
}