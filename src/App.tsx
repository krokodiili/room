import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, KeyboardControls, Environment } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { CharacterController } from './components/CharacterController';
import { CharacterCreator } from './components/CharacterCreator';
import { Kiosk } from './components/Kiosk';
import { Desk } from './components/Desk';
import { Chair } from './components/Chair';
import { Plant } from './components/Plant';
import { OfficeRoom } from './components/OfficeRoom';
import { Decor } from './components/Decor';
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
      {/* Lighting & Environment */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Environment preset="city" />
      <Sky sunPosition={[100, 20, 100]} />

      <Physics debug={false} gravity={[0, -9.81, 0]}>

        <OfficeRoom />
        <Decor />

        {/* Player Controller - Spawn near the entrance */}
        <CharacterController position={[0, 5, 8]} />

        {/* Kiosk - Center Feature */}
        <Kiosk position={[0, 0, -2]} />

        {/* Work Zone - Left */}
        <group position={[-6, 0, -4]}>
            <Desk position={[0, 0, 0]} />
            <Chair position={[0, 0, 1]} rotation={[0, Math.PI, 0]} />

            <Desk position={[0, 0, -2.5]} />
            <Chair position={[0, 0, -1.5]} rotation={[0, Math.PI, 0]} />

            <Plant position={[-2, 0, 0]} />
        </group>

        <group position={[-6, 0, 4]}>
            <Desk position={[0, 0, 0]} />
            <Chair position={[0, 0, 1]} rotation={[0, Math.PI, 0]} />

            <Desk position={[0, 0, -2.5]} />
            <Chair position={[0, 0, -1.5]} rotation={[0, Math.PI, 0]} />

             <Plant position={[-2, 0, 0]} />
        </group>

        {/* Lounge Zone - Right */}
         <group position={[6, 0, 0]}>
             {/* Small Table */}
              <mesh position={[0, 0.4, 0]}>
                 <cylinderGeometry args={[1, 1, 0.05]} />
                 <meshStandardMaterial color="white" />
              </mesh>

             <Chair position={[0, 0, 1.5]} rotation={[0, Math.PI, 0]} />
             <Chair position={[1.5, 0, 0]} rotation={[0, -Math.PI/2, 0]} />
             <Chair position={[-1.5, 0, 0]} rotation={[0, Math.PI/2, 0]} />

             <Plant position={[3, 0, -3]} />
             <Plant position={[3, 0, 3]} />
         </group>


        {/* NPCs */}
        {npcs.map(npc => (
          <NPC key={npc.id} data={npc} />
        ))}

      </Physics>

      <CharacterCreator />
      <PointerLockControls />

    </>
  );
}

export default function App() {
  useEffect(() => {
    (window as any).useStore = useStore;
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        {/* Crosshair */}
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
