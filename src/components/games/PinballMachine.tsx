import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, CylinderCollider, RapierRigidBody, useRevoluteJoint } from '@react-three/rapier';
import { useKeyboardControls, Text } from '@react-three/drei';
import { Vector3, Group } from 'three';
import { useGameStore } from '../../games/store';
import { useStore } from '../../store';

// Constants
const FLIPPER_LENGTH = 1.2;
const FLIPPER_WIDTH = 0.3;
const FLIPPER_THICKNESS = 0.2;
const BALL_RADIUS = 0.15;
const TABLE_WIDTH = 4.5;
const TABLE_LENGTH = 8;

const Flipper = ({ position, side, anchor }: { position: [number, number, number], side: 'left' | 'right', anchor: React.RefObject<RapierRigidBody> }) => {
  const body = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls();

  // Joint
  const joint = useRevoluteJoint(anchor, body, [
    [position[0], position[1], position[2]], // Anchor position relative to global (since anchor is fixed body at 0,0,0 effectively or we adjust)
    [side === 'left' ? -FLIPPER_LENGTH / 2 + 0.1 : FLIPPER_LENGTH / 2 - 0.1, 0, 0], // Local pivot on flipper
    [0, 1, 0] // Axis of rotation (Y-up because table is tilted later? No, let's keep physics local if possible or align with world Y)
  ]);

  // We need to think about the axis. The table is tilted.
  // It's easier to build the table flat and rotate the whole group, but Rapier RigidBodies don't always like parent rotation if they are static.
  // Dynamic bodies (ball) need gravity.
  // If we rotate the table visuals, we must rotate the gravity vector or rotate the physics bodies match.
  // Rotating physics bodies is better.

  // Actually, easiest is to keep physics flat (gravity pointing down Y)
  // and just simulate the "slope" by applying a constant force on the ball towards the "bottom" (-Z).
  // This avoids complex rotated hitboxes issues sometimes.
  // Let's try "Fake Gravity" (force) on the ball.

  useFrame(() => {
    if (!joint.current) return;

    const { left, right } = get();
    const isPressed = side === 'left' ? left : right;

    // Motor control
    // configureMotorPosition(targetPos, stiffness, damping)
    const target = isPressed ? (side === 'left' ? -0.8 : 0.8) : (side === 'left' ? 0.5 : -0.5);
    joint.current.configureMotorPosition(target, 100, 5);
  });

  return (
    <RigidBody
      ref={body}
      position={position}
      colliders="hull"
      type="dynamic"
      enabledRotations={[false, true, false]} // Only rotate Y
    >
        {/* Visuals */}
        <mesh>
            <boxGeometry args={[FLIPPER_LENGTH, FLIPPER_THICKNESS, FLIPPER_WIDTH]} />
            <meshStandardMaterial color={side === 'left' ? "#ff0055" : "#0055ff"} />
        </mesh>
    </RigidBody>
  );
};

const Bumper = ({ position, onHit }: { position: [number, number, number], onHit: () => void }) => {
    return (
        <RigidBody type="fixed" position={position} restitution={1.5} onCollisionEnter={onHit}>
            <CylinderCollider args={[0.2, 0.3]} />
            <mesh>
                <cylinderGeometry args={[0.3, 0.3, 0.4, 32]} />
                <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
            </mesh>
        </RigidBody>
    )
}

const PinballBall = ({ resetBall }: { resetBall: () => void }) => {
    const body = useRef<RapierRigidBody>(null);

    useFrame(() => {
        if (!body.current) return;

        // Apply "slope" gravity
        // Standard gravity is -9.81 Y.
        // We want ball to roll towards +Z (bottom of table).
        // So we add force in +Z.
        body.current.addForce({ x: 0, y: 0, z: 15 }, true);

        const pos = body.current.translation();

        // Reset if falls off ( drain )
        if (pos.z > TABLE_LENGTH / 2 + 2) {
            resetBall();
        }
    });

    useEffect(() => {
        if (body.current) {
            body.current.setTranslation({ x: 1.8, y: 0.5, z: 3 }, true);
            body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }
    }, [resetBall]); // Reset when function changes (new ball) or manually called

    return (
        <RigidBody
            ref={body}
            colliders="ball"
            type="dynamic"
            position={[1.8, 0.5, 3]}
            restitution={0.5}
            friction={0.1}
            ccd
        >
            <mesh>
                <sphereGeometry args={[BALL_RADIUS]} />
                <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
            </mesh>
        </RigidBody>
    )
}

export const PinballMachine = (props: any) => {
    const { activeGame, startGame, exitGame, updateHighScore, getHighScore } = useGameStore();
    const isCreatorOpen = useStore((state) => state.isCreatorOpen);
    const isPlaying = activeGame === 'pinball';
    const [score, setScore] = useState(0);
    const [ballsLeft, setBallsLeft] = useState(3);
    const [ballKey, setBallKey] = useState(0); // To force remount/reset of ball

    // Refs
    const anchorRef = useRef<RapierRigidBody>(null);
    const groupRef = useRef<Group>(null);

    // Keyboard for Plunger
    const [, get] = useKeyboardControls();
    const plungerRef = useRef<RapierRigidBody>(null);

    // High Score
    const currentHighScore = getHighScore('pinball');

    // Detect proximity to interaction
    useFrame((state) => {
        if (!groupRef.current) return;

        // Check proximity
        const worldPos = new Vector3();
        groupRef.current.getWorldPosition(worldPos);
        const distance = state.camera.position.distanceTo(worldPos);

        // Only allow start if close and not already playing
        if (distance < 5 && !isPlaying && !isCreatorOpen) {
             const { interact } = get();
             if (interact) {
                 startGame('pinball');
                 setScore(0);
                 setBallsLeft(3);
                 setBallKey(prev => prev + 1);
             }
        }

        // Plunger Logic (Space)
        if (isPlaying && plungerRef.current) {
             const { jump } = get(); // Space
             if (jump) {
                 plungerRef.current.applyImpulse({ x: 0, y: 0, z: -0.5 }, true);
             }
        }

        // Camera override when playing
        if (isPlaying) {
            const targetPos = new Vector3(
                props.position[0],
                props.position[1] + 8,
                props.position[2] + 4
            );
            const lookAtPos = new Vector3(
                props.position[0],
                props.position[1],
                props.position[2]
            );
            state.camera.position.lerp(targetPos, 0.1);
            state.camera.lookAt(lookAtPos);
        }
    });

    const handleBallDrain = () => {
        if (ballsLeft > 1) {
            setBallsLeft(prev => prev - 1);
            setBallKey(prev => prev + 1); // Reset ball
        } else {
            // Game Over
            if (score > currentHighScore) {
                updateHighScore('pinball', score);
            }
            setBallsLeft(0);
            exitGame();
        }
    };

    // Add score periodically for fun or use collisions?
    // Let's rely on simple collision events on bumpers in future.
    // For now, simple mock score increment when hitting bumper.

    return (
        <group ref={groupRef} {...props}>

            {/* Cabinet Visuals */}
            <mesh position={[0, -0.5, 0]}>
                 <boxGeometry args={[TABLE_WIDTH + 1, 2, TABLE_LENGTH + 1]} />
                 <meshStandardMaterial color="#222" />
            </mesh>
            {/* Legs */}
            <mesh position={[-2, -2, -3.5]}>
                <boxGeometry args={[0.2, 3, 0.2]} />
                <meshStandardMaterial color="#888" />
            </mesh>
            <mesh position={[2, -2, -3.5]}>
                <boxGeometry args={[0.2, 3, 0.2]} />
                <meshStandardMaterial color="#888" />
            </mesh>
            <mesh position={[-2, -2, 3.5]}>
                <boxGeometry args={[0.2, 3, 0.2]} />
                <meshStandardMaterial color="#888" />
            </mesh>
            <mesh position={[2, -2, 3.5]}>
                <boxGeometry args={[0.2, 3, 0.2]} />
                <meshStandardMaterial color="#888" />
            </mesh>

            {/* Backglass */}
            <group position={[0, 2, -TABLE_LENGTH/2 - 0.5]}>
                 <mesh>
                     <boxGeometry args={[TABLE_WIDTH + 1, 4, 1]} />
                     <meshStandardMaterial color="#333" />
                 </mesh>
                 {/* Score Display */}
                 <Text position={[0, 1, 0.51]} fontSize={0.5} color="red">
                     {isPlaying ? score.toString().padStart(6, '0') : "PINBALL"}
                 </Text>
                 <Text position={[0, 0, 0.51]} fontSize={0.2} color="white">
                     HIGH SCORE: {currentHighScore}
                 </Text>
                  {!isPlaying && (
                     <Text position={[0, -1, 0.51]} fontSize={0.3} color="yellow">
                         PRESS 'E' TO PLAY
                     </Text>
                 )}
            </group>

            {/* Physics World for Table */}
            {/* Anchor for joints */}
            <RigidBody ref={anchorRef} type="fixed" colliders={false} />

            {/* Table Floor */}
            <RigidBody type="fixed" friction={0.1}>
                 <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
                     <planeGeometry args={[TABLE_WIDTH, TABLE_LENGTH]} />
                     <meshStandardMaterial color="#111" />
                 </mesh>
            </RigidBody>

            {/* Walls */}
            <RigidBody type="fixed">
                 {/* Left */}
                 <CuboidCollider args={[0.1, 1, TABLE_LENGTH/2]} position={[-TABLE_WIDTH/2 - 0.1, 0, 0]} />
                 <mesh position={[-TABLE_WIDTH/2 - 0.1, 0.5, 0]}>
                     <boxGeometry args={[0.2, 1, TABLE_LENGTH]} />
                     <meshStandardMaterial color="blue" />
                 </mesh>

                 {/* Right */}
                 <CuboidCollider args={[0.1, 1, TABLE_LENGTH/2]} position={[TABLE_WIDTH/2 + 0.1, 0, 0]} />
                 <mesh position={[TABLE_WIDTH/2 + 0.1, 0.5, 0]}>
                     <boxGeometry args={[0.2, 1, TABLE_LENGTH]} />
                     <meshStandardMaterial color="blue" />
                 </mesh>

                 {/* Top Arc */}
                 <CuboidCollider args={[TABLE_WIDTH/2, 1, 0.1]} position={[0, 0, -TABLE_LENGTH/2 - 0.1]} />
                 <mesh position={[0, 0.5, -TABLE_LENGTH/2 - 0.1]}>
                     <boxGeometry args={[TABLE_WIDTH, 1, 0.2]} />
                     <meshStandardMaterial color="blue" />
                 </mesh>

                 {/* Plunger Lane Wall */}
                 <CuboidCollider args={[0.1, 1, TABLE_LENGTH/2 - 1]} position={[TABLE_WIDTH/2 - 0.8, 0, 1]} />
                 <mesh position={[TABLE_WIDTH/2 - 0.8, 0.5, 1]}>
                     <boxGeometry args={[0.1, 1, TABLE_LENGTH - 2]} />
                     <meshStandardMaterial color="blue" />
                 </mesh>
            </RigidBody>

            {/* Slingshots / Triangles near flippers */}
            <RigidBody type="fixed" restitution={1.5}>
                 <mesh position={[-1.5, 0.2, 2]} rotation={[0, -0.5, 0]}>
                     <boxGeometry args={[0.2, 0.4, 1.5]} />
                     <meshStandardMaterial color="white" />
                 </mesh>
                 <mesh position={[1.0, 0.2, 2]} rotation={[0, 0.5, 0]}>
                     <boxGeometry args={[0.2, 0.4, 1.5]} />
                     <meshStandardMaterial color="white" />
                 </mesh>
            </RigidBody>

            {/* Interactive Elements */}
            {isPlaying && (
                <>
                    <Flipper position={[-0.8, 0.2, 3.5]} side="left" anchor={anchorRef} />
                    <Flipper position={[0.4, 0.2, 3.5]} side="right" anchor={anchorRef} />

                    <Bumper position={[0, 0.2, -1]} onHit={() => setScore(s => s + 100)} />
                    <Bumper position={[-1, 0.2, -2]} onHit={() => setScore(s => s + 100)} />
                    <Bumper position={[1, 0.2, -2]} onHit={() => setScore(s => s + 100)} />

                    <PinballBall key={ballKey} resetBall={handleBallDrain} />

                    {/* Plunger */}
                    {/* Just a visual block that pushes? */}
                </>
            )}

            {/* Plunger Area */}
            {isPlaying && (
                 <RigidBody ref={plungerRef} position={[2, 0.2, 3.8]} type="dynamic" mass={1} lockRotations>
                     <mesh>
                         <boxGeometry args={[0.4, 0.4, 0.4]} />
                         <meshStandardMaterial color="red" />
                     </mesh>
                 </RigidBody>
            )}

        </group>
    );
};
