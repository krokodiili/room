import { RigidBody } from '@react-three/rapier';

export const Chair = (props: any) => {
  return (
    <RigidBody type="dynamic" colliders="cuboid" {...props}>
      <group>
        {/* Seat */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshStandardMaterial color="#444" />
        </mesh>

        {/* Backrest */}
        <mesh position={[0, 0.75, -0.2]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.1]} />
          <meshStandardMaterial color="#444" />
        </mesh>

        {/* Stem */}
        <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.4]} />
            <meshStandardMaterial color="#222" />
        </mesh>

        {/* Base */}
        <mesh position={[0, 0.05, 0]}>
             <cylinderGeometry args={[0.3, 0.3, 0.05]} />
             <meshStandardMaterial color="#222" />
        </mesh>
      </group>
    </RigidBody>
  );
};
