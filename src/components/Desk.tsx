import { RigidBody } from '@react-three/rapier';

export const Desk = (props: any) => {
  return (
    <RigidBody type="fixed" colliders="cuboid" {...props}>
      <group>
        {/* Table Top */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.1, 1]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.9, 0.375, -0.4]} castShadow>
          <boxGeometry args={[0.1, 0.75, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.9, 0.375, -0.4]} castShadow>
          <boxGeometry args={[0.1, 0.75, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
         <mesh position={[-0.9, 0.375, 0.4]} castShadow>
          <boxGeometry args={[0.1, 0.75, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.9, 0.375, 0.4]} castShadow>
          <boxGeometry args={[0.1, 0.75, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
    </RigidBody>
  );
};
