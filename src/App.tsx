import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, PointerLockControls, KeyboardControls, Environment } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { CharacterController } from './components/CharacterController';
import { CharacterCreator } from './components/CharacterCreator';
import { Mirror } from './components/Mirror';
import { Desk } from './components/Desk';
import { Chair } from './components/Chair';
import { Plant } from './components/Plant';
import { OfficeRoom } from './components/OfficeRoom';
import { Decor } from './components/Decor';
import { NPC } from './components/NPC';
import { PinballMachine } from './components/games/PinballMachine';
import { useStore } from './store';
import { useGameStore } from './games/store';
import { Suspense, useEffect } from 'react';
import { Vector3 } from 'three';

// Define keyboard map
const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
  { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
  { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
  { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'interact', keys: ['e', 'E'] },
];

function CreatorCamera() {
    const { camera } = useThree();

    useFrame(() => {
        // Smoothly interpolate camera to the creator view
        // Target: x=-6, y=2, z=0. Look at -9.7, 2, 0 (Mirror position)
        const targetPos = new Vector3(-6, 2, 0);
        const lookAtPos = new Vector3(-9.7, 2, 0);

        camera.position.lerp(targetPos, 0.1);
        camera.lookAt(lookAtPos);
    });
    return null;
}

function Scene() {
  const npcs = useStore((state) => state.npcs);
  const isCreatorOpen = useStore((state) => state.isCreatorOpen);
  const activeGame = useGameStore((state) => state.activeGame);

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

        {/* Mirror Station - Left Wall */}
        {/* Left wall surface is at x = -9.75. We place the mirror at -9.7 so it sits on the wall */}
        <Mirror position={[-9.7, 2, 0]} rotation={[0, Math.PI / 2, 0]} />

        {/* Character Creator UI & Preview - Positioned at the same location as Mirror for relative placement */}
        <CharacterCreator position={[-9.7, 2, 0]} rotation={[0, Math.PI / 2, 0]} />

        {/* Work Zone - Left (Adjusted to avoid Mirror) */}
        <group position={[-6, 0, -4]}>
            <Desk position={[0, 0, 0]} />
            <Chair position={[0, 0, 1]} rotation={[0, Math.PI, 0]} />
        </group>

        {/* Another Work Zone */}
        <group position={[-6, 0, 4]}>
            <Desk position={[0, 0, 0]} />
            <Chair position={[0, 0, 1]} rotation={[0, Math.PI, 0]} />
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

        {/* Games */}
        <PinballMachine position={[5, 1, 0]} rotation={[0, 0, 0]} />

      </Physics>

      {/* Camera Management */}
      {isCreatorOpen ? (
          <CreatorCamera />
      ) : activeGame === 'pinball' ? (
          null // PinballMachine handles its own camera view
      ) : (
          <PointerLockControls />
      )}

    </>
  );
}

export default function App() {
  useEffect(() => {
    (window as any).useStore = useStore;
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        {/* Crosshair (Hide when creator is open) */}
        <Crosshair />

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

const Crosshair = () => {
    const isCreatorOpen = useStore((state) => state.isCreatorOpen);
    const activeGame = useGameStore((state) => state.activeGame);

    if (isCreatorOpen || activeGame !== 'none') return null;

    return (
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
    )
}
