import { Text } from '@react-three/drei';

interface CharacterModelProps {
  name?: string;
  bodyColor: string;
  accessory: 'none' | 'hat' | 'glasses';
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const CharacterModel = ({ name, bodyColor, accessory, position = [0, 0, 0], rotation = [0, 0, 0] }: CharacterModelProps) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Name Tag */}
      {name && (
        <Text position={[0, 1.5, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="middle">
          {name}
        </Text>
      )}

      {/* Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Accessory: Hat */}
      {accessory === 'hat' && (
        <mesh position={[0, 0.6, 0]}>
          <coneGeometry args={[0.4, 0.5, 32]} />
          <meshStandardMaterial color="purple" />
        </mesh>
      )}

      {/* Accessory: Glasses */}
      {accessory === 'glasses' && (
        <mesh position={[0, 0.3, 0.25]}>
          <boxGeometry args={[0.4, 0.1, 0.1]} />
          <meshStandardMaterial color="black" />
        </mesh>
      )}
    </group>
  );
};
