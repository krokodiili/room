import { Text } from '@react-three/drei';

interface CharacterModelProps {
  name?: string;
  bodyColor: string;
  eyeColor?: string;
  accessory: 'none' | 'hat' | 'glasses';
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const CharacterModel = ({ name, bodyColor, eyeColor = 'black', accessory, position = [0, 0, 0], rotation = [0, 0, 0] }: CharacterModelProps) => {
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

      {/* Eyes */}
      <group position={[0, 0.6, 0.25]}>
          <mesh position={[-0.1, 0, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color={eyeColor} />
          </mesh>
          <mesh position={[0.1, 0, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color={eyeColor} />
          </mesh>
      </group>

      {/* Accessory: Hat */}
      {/* Capsule top is roughly at 0.8 (0.5 cylinder half-height + 0.3 radius).
          Cone height is 0.5. Center at 0.25.
          So position y should be 0.8 + 0.25 = 1.05 to sit on top.
      */}
      {accessory === 'hat' && (
        <mesh position={[0, 1.05, 0]}>
          <coneGeometry args={[0.4, 0.5, 32]} />
          <meshStandardMaterial color="purple" />
        </mesh>
      )}

      {/* Accessory: Glasses */}
      {/* Eyes are at 0.6. Glasses should be at similar height, maybe slightly lower or same. */}
      {accessory === 'glasses' && (
        <mesh position={[0, 0.6, 0.3]}>
          <boxGeometry args={[0.4, 0.1, 0.1]} />
          <meshStandardMaterial color="black" />
        </mesh>
      )}
    </group>
  );
};
