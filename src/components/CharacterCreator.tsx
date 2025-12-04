import { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '../store';
import { CharacterModel } from './CharacterModel';

export const CharacterCreator = (props: any) => {
  const { isCreatorOpen, closeCreator, addNPC } = useStore();
  const [name, setName] = useState('New Employee');
  const [bodyColor, setBodyColor] = useState('#ffeb3b');
  const [accessory, setAccessory] = useState<'none' | 'hat' | 'glasses'>('none');

  // Reset or initialize when opening
  useEffect(() => {
      if(isCreatorOpen) {
          // Ideally we would move camera here, but let's assume the user clicks the mirror and we might handle camera movement elsewhere or assume they are close.
          // For now, let's just make sure the UI is visible.
      }
  }, [isCreatorOpen]);

  if (!isCreatorOpen) return null;

  return (
    <group {...props}>
      {/* Preview Character - Standing on the floor in front of the mirror */}
      {/* Assuming the mirror is at some position, we place the character slightly in front of it */}
      {/* Since this component will be placed relative to the mirror or wall, let's adjust coords locally */}

      {/* If this component is placed AT the mirror position, we offset the character slightly in front (z) and down to floor if needed */}
      <group position={[0, -1.5, 1]} rotation={[0, Math.PI, 0]}>
          <CharacterModel
            bodyColor={bodyColor}
            accessory={accessory}
            // No name tag in preview perhaps, or yes?
          />
           {/* Spotlight for the character */}
           <spotLight position={[0, 5, 2]} intensity={2} angle={0.5} penumbra={1} castShadow />
      </group>

      {/* UI Panel - On the wall, next to the mirror */}
      {/* We'll offset it to the right of the mirror. Mirror width is ~2.2 (frame). Half is 1.1. */}
      {/* So we put UI at x=1.5 or so. */}
      <Html transform position={[1.6, 0, 0]} scale={0.2} occlude={false}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          width: '400px',
          fontFamily: "'Inter', sans-serif",
          userSelect: 'none',
          pointerEvents: 'auto' // ensure interaction works
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#333', fontSize: '24px' }}>Customize</h2>
            <button
                onClick={closeCreator}
                style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}
            >
                ✕
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Outfit Color</label>
            <div style={{ display: 'flex', gap: '10px' }}>
                {['#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#f44336', '#ff9800', '#795548', '#607d8b'].map(color => (
                    <div
                        key={color}
                        onClick={() => setBodyColor(color)}
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            backgroundColor: color,
                            cursor: 'pointer',
                            border: bodyColor === color ? '3px solid #333' : '3px solid transparent',
                            transition: 'all 0.2s'
                        }}
                    />
                ))}
                 <input
                    type="color"
                    value={bodyColor}
                    onChange={(e) => setBodyColor(e.target.value)}
                    style={{ width: '30px', height: '30px', padding: 0, border: 'none', background: 'none' }}
                />
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Accessory</label>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => setAccessory('none')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        border: accessory === 'none' ? '2px solid #333' : '1px solid #ddd',
                        background: accessory === 'none' ? '#eee' : 'white',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    None
                </button>
                <button
                    onClick={() => setAccessory('hat')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        border: accessory === 'hat' ? '2px solid #333' : '1px solid #ddd',
                        background: accessory === 'hat' ? '#eee' : 'white',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Hat
                </button>
                <button
                    onClick={() => setAccessory('glasses')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        border: accessory === 'glasses' ? '2px solid #333' : '1px solid #ddd',
                        background: accessory === 'glasses' ? '#eee' : 'white',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Glasses
                </button>
            </div>
          </div>

          <button
            onClick={() => addNPC({ name, bodyColor, accessory })}
            style={{
              width: '100%',
              padding: '15px',
              background: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)'
            }}
          >
            Join Office
          </button>
        </div>
      </Html>
    </group>
  );
};
