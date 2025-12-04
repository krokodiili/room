import { RigidBody } from '@react-three/rapier';

export const OfficeRoom = () => {
  const wallHeight = 4;
  const floorSize = 20;

  return (
    <group>
        {/* Floor */}
        <RigidBody type="fixed" colliders="cuboid" friction={1}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.05, 0]}>
                <boxGeometry args={[floorSize, floorSize, 0.1]} />
                <meshStandardMaterial color="#f5f5f5" />
            </mesh>
        </RigidBody>

        {/* Walls */}
        <RigidBody type="fixed" colliders="cuboid">
            {/* Back Wall */}
            <mesh position={[0, wallHeight / 2, -floorSize / 2]} receiveShadow>
                <boxGeometry args={[floorSize, wallHeight, 0.5]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            {/* Front Wall (with gap for door maybe? let's just close it for now or leave open) */}
            {/* Let's leave front open for "stage" feel or close it partially */}
             <mesh position={[-floorSize / 3, wallHeight / 2, floorSize / 2]} receiveShadow>
                <boxGeometry args={[floorSize / 3, wallHeight, 0.5]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
             <mesh position={[floorSize / 3, wallHeight / 2, floorSize / 2]} receiveShadow>
                <boxGeometry args={[floorSize / 3, wallHeight, 0.5]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-floorSize / 2, wallHeight / 2, 0]} receiveShadow>
                <boxGeometry args={[0.5, wallHeight, floorSize]} />
                <meshStandardMaterial color="#e0f7fa" /> {/* Accent wall color? */}
            </mesh>

            {/* Right Wall */}
            <mesh position={[floorSize / 2, wallHeight / 2, 0]} receiveShadow>
                <boxGeometry args={[0.5, wallHeight, floorSize]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
        </RigidBody>
    </group>
  );
};
