import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, KeyboardControls } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { CharacterController } from './components/CharacterController';
import { CharacterCreator } from './components/CharacterCreator';
import { Kiosk } from './components/Kiosk';
import { Desk } from './components/Desk';
import { NPC } from './components/NPC';
import { useStore } from './store';
import { Suspense, useEffect } from 'react';

// Define keyboard map
const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
  { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
  { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
  { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
  { name: 'jump', keys: ['Space'] },
];

function Scene() {
  const npcs = useStore((state) => state.npcs);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      <Physics debug={false} gravity={[0, -9.81, 0]}>
        {/* Floor */}
        <RigidBody type="fixed" colliders="cuboid">
           <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#eeeeee" />
          </mesh>
        </RigidBody>

        {/* Walls - Simple enclosure */}
         <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, 2.5, -10]} receiveShadow>
                <boxGeometry args={[20, 5, 0.5]} />
                <meshStandardMaterial color="white" />
            </mesh>
             <mesh position={[0, 2.5, 10]} receiveShadow>
                <boxGeometry args={[20, 5, 0.5]} />
                <meshStandardMaterial color="white" />
            </mesh>
             <mesh position={[-10, 2.5, 0]} receiveShadow>
                <boxGeometry args={[0.5, 5, 20]} />
                <meshStandardMaterial color="white" />
            </mesh>
             <mesh position={[10, 2.5, 0]} receiveShadow>
                <boxGeometry args={[0.5, 5, 20]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </RigidBody>

        {/* Player Controller */}
        <CharacterController />

        {/* Kiosk */}
        <Kiosk position={[0, 0, -5]} />

        {/* Desks */}
        <Desk position={[-5, 0, 0]} />
        <Desk position={[5, 0, 0]} />
        <Desk position={[-5, 0, 5]} />
        <Desk position={[5, 0, 5]} />

        {/* NPCs */}
        {npcs.map(npc => (
          <NPC key={npc.id} data={npc} />
        ))}

      </Physics>

      <CharacterCreator />
      <PointerLockControls />
      <Sky sunPosition={[100, 20, 100]} />
    </>
  );
}

export default function App() {
  useEffect(() => {
    (window as any).useStore = useStore;
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '10px',
            height: '10px',
            background: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid black',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 1000,
            borderRadius: '50%'
        }} />
        <KeyboardControls map={keyboardMap}>
            <Canvas shadows camera={{ fov: 60 }}>
                <Suspense fallback={null}>
                <Scene />
                </Suspense>
            </Canvas>
        </KeyboardControls>
    </div>
  );
}
