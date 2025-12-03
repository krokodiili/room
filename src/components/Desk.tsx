import { RigidBody } from '@react-three/rapier';

export const Desk = (props: any) => {
  return (
    <RigidBody type="fixed" colliders="cuboid" {...props}>
      <group>
        {/* Table Top - Light Wood */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.05, 0.8]} />
          <meshStandardMaterial color="#d4c5a9" roughness={0.6} />
        </mesh>

        {/* Legs - White Metal */}
        <mesh position={[-0.7, 0.375, -0.3]} castShadow>
          <boxGeometry args={[0.04, 0.75, 0.04]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.7, 0.375, -0.3]} castShadow>
          <boxGeometry args={[0.04, 0.75, 0.04]} />
          <meshStandardMaterial color="#333" />
        </mesh>
         <mesh position={[-0.7, 0.375, 0.3]} castShadow>
          <boxGeometry args={[0.04, 0.75, 0.04]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.7, 0.375, 0.3]} castShadow>
          <boxGeometry args={[0.04, 0.75, 0.04]} />
          <meshStandardMaterial color="#333" />
        </mesh>

        {/* Divider - Accent Color */}
        <mesh position={[0, 0.9, -0.35]} castShadow>
             <boxGeometry args={[1.6, 0.3, 0.02]} />
             <meshStandardMaterial color="#039be5" />
        </mesh>

        {/* Computer Monitor */}
        <mesh position={[0, 0.95, 0.1]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.3, 0.02]} />
            <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, 0.8, 0.1]}>
             <boxGeometry args={[0.05, 0.1, 0.05]} />
             <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, 0.76, 0.1]}>
             <boxGeometry args={[0.1, 0.01, 0.1]} />
             <meshStandardMaterial color="#111" />
        </mesh>

      </group>
    </RigidBody>
  );
};
