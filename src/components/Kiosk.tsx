import { useStore } from '../store';
import { RigidBody } from '@react-three/rapier';

export const Kiosk = (props: any) => {
  const { openCreator } = useStore();

  return (
    <RigidBody type="fixed" colliders="cuboid" {...props}>
      <group onClick={openCreator} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1, 2, 0.2]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1, 0.11]}>
          <planeGeometry args={[0.8, 1.8]} />
          <meshStandardMaterial color="#88ccff" emissive="#88ccff" emissiveIntensity={0.5} />
        </mesh>
        <pointLight position={[0, 1, 0.5]} intensity={1} distance={3} color="cyan" />
      </group>
    </RigidBody>
  );
};
