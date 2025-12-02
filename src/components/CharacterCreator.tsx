import { useState } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '../store';

export const CharacterCreator = () => {
  const { isCreatorOpen, closeCreator, addNPC } = useStore();
  const [name, setName] = useState('New Employee');
  const [bodyColor, setBodyColor] = useState('#ffeb3b');
  const [accessory, setAccessory] = useState<'none' | 'hat' | 'glasses'>('none');

  if (!isCreatorOpen) return null;

  return (
    <Html center>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '300px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#333' }}>New Hire Onboarding</h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Outfit Color</label>
          <input
            type="color"
            value={bodyColor}
            onChange={(e) => setBodyColor(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Accessory</label>
          <select
            value={accessory}
            onChange={(e) => setAccessory(e.target.value as any)}
            style={{ width: '100%', padding: '5px' }}
          >
            <option value="none">None</option>
            <option value="hat">Party Hat</option>
            <option value="glasses">Smart Glasses</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => addNPC({ name, bodyColor, accessory })}
            style={{
              flex: 1,
              padding: '10px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Save & Join
          </button>
          <button
            onClick={closeCreator}
            style={{
              flex: 1,
              padding: '10px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Html>
  );
};
