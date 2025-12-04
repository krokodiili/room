import { RigidBody } from '@react-three/rapier';

export const Plant = (props: any) => {
  return (
    <RigidBody type="fixed" colliders="cuboid" {...props}>
      <group>
        {/* Pot */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.15, 0.5]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Soil */}
         <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.05]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>

        {/* Leaves */}
        <mesh position={[0, 0.8, 0]}>
            <coneGeometry args={[0.3, 0.8, 8]} />
            <meshStandardMaterial color="#4caf50" />
        </mesh>
         <mesh position={[0.1, 0.7, 0.1]} rotation={[0.2, 0, 0]}>
            <coneGeometry args={[0.2, 0.6, 8]} />
            <meshStandardMaterial color="#66bb6a" />
        </mesh>
         <mesh position={[-0.1, 0.7, -0.1]} rotation={[-0.2, 0, 0]}>
            <coneGeometry args={[0.2, 0.6, 8]} />
            <meshStandardMaterial color="#388e3c" />
        </mesh>
      </group>
    </RigidBody>
  );
};
