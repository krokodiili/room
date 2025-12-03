export const Decor = (props: any) => {
  // Rugs, Wall Art, etc.
  return (
    <group {...props}>
        {/* Large Rug in Lounge Area */}
        <mesh position={[-5, 0.01, 5]} rotation={[-Math.PI/2, 0, 0]}>
             <planeGeometry args={[4, 4]} />
             <meshStandardMaterial color="#fce4ec" />
        </mesh>

         {/* Wall Art */}
        <mesh position={[-5, 2, -9.9]}>
             <planeGeometry args={[2, 1.5]} />
             <meshStandardMaterial color="#ec407a" />
        </mesh>
         <mesh position={[-2, 2, -9.9]}>
             <planeGeometry args={[1, 1.5]} />
             <meshStandardMaterial color="#ffd54f" />
        </mesh>
    </group>
  );
};
