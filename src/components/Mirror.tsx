import { useStore } from '../store';
import { Text } from '@react-three/drei';

export const Mirror = (props: any) => {
  const { openCreator, isCreatorOpen } = useStore();

  return (
    <group {...props}>
      {/* Wall Frame */}
      <mesh position={[0, 0, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 3.2, 0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Mirror Surface */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial
            color="#aaddff"
            metalness={0.9}
            roughness={0.1}
        />
      </mesh>

      {/* Interaction Trigger */}
      {!isCreatorOpen && (
          <group
            onClick={openCreator}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
            position={[0, 0, 0.1]}
          >
             <mesh visible={false}>
                 <planeGeometry args={[2.2, 3.2]} />
             </mesh>
             <Text position={[0, 0, 0]} fontSize={0.2} color="black" outlineWidth={0.01} outlineColor="white">
                 Click to Customize
             </Text>
          </group>
      )}
    </group>
  );
};
