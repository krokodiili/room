import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { Vector3 } from 'three';
import { CharacterData } from '../store';
import { CharacterModel } from './CharacterModel';

interface NPCProps {
  data: CharacterData;
  position?: [number, number, number];
}

export const NPC = ({ data, position = [0, 5, 0] }: NPCProps) => {
  const rigidBody = useRef<RapierRigidBody>(null);
  const [, setState] = useState<'IDLE' | 'WALKING' | 'SITTING' | 'DRINKING'>('IDLE');
  const [target, setTarget] = useState<Vector3 | null>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    time.current += delta;

    // Simple state machine behavior
    if (Math.random() < 0.005) {
       const actions: ('IDLE' | 'WALKING' | 'DRINKING')[] = ['IDLE', 'WALKING', 'DRINKING'];
       const next = actions[Math.floor(Math.random() * actions.length)];
       setState(next);

       if (next === 'WALKING') {
         const x = (Math.random() - 0.5) * 20;
         const z = (Math.random() - 0.5) * 20;
         setTarget(new Vector3(x, 0, z));
       } else {
         setTarget(null);
       }
    }

    if (target && rigidBody.current) {
        const currentPos = rigidBody.current.translation();
        const currentPosVec = new Vector3(currentPos.x, currentPos.y, currentPos.z);
        const direction = new Vector3().subVectors(target, currentPosVec).setY(0).normalize();
        const speed = 2;

        const currentLinvel = rigidBody.current.linvel();
        rigidBody.current.setLinvel({ x: direction.x * speed, y: currentLinvel.y, z: direction.z * speed }, true);

        // Stop if close
        if (currentPosVec.distanceTo(target) < 1) {
            setTarget(null);
            setState('IDLE');
        }
    }
  });

  return (
    <RigidBody ref={rigidBody} colliders={false} type="dynamic" position={position} enabledRotations={[false, false, false]} linearDamping={0.5}>
      <CapsuleCollider args={[0.5, 0.3]} />
      <CharacterModel
        name={data.name}
        bodyColor={data.bodyColor}
        eyeColor={data.eyeColor}
        accessory={data.accessory}
      />
    </RigidBody>
  );
};
