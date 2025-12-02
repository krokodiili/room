import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { Vector3 } from 'three';
import { useKeyboardControls } from '@react-three/drei';

export const CharacterController = () => {
  const { camera } = useThree();
  const rigidBody = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls();

  useFrame(() => {
    if (!rigidBody.current) return;

    const { forward, backward, left, right, jump } = get();

    const frontVector = new Vector3(0, 0, Number(backward) - Number(forward));
    const sideVector = new Vector3(Number(left) - Number(right), 0, 0);
    const direction = new Vector3();
    const speed = 5;

    // Calculate movement direction relative to camera
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(camera.rotation);

    // Apply velocity
    const velocity = rigidBody.current.linvel();
    rigidBody.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

    // Jump
    if (jump && Math.abs(velocity.y) < 0.1) {
       rigidBody.current.setLinvel({ x: velocity.x, y: 5, z: velocity.z }, true);
    }

    // Sync camera to player
    const translation = rigidBody.current.translation();
    camera.position.set(translation.x, translation.y + 1.5, translation.z);
  });

  return (
    <RigidBody ref={rigidBody} colliders={false} mass={1} type="dynamic" position={[0, 5, 0]} enabledRotations={[false, false, false]}>
        <CapsuleCollider args={[0.5, 0.5]} />
    </RigidBody>
  );
};
