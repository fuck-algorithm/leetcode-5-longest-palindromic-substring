import { AlgorithmType } from '../types';

interface AlgorithmSelectorProps {
  selected: AlgorithmType;
  onChange: (algorithm: AlgorithmType) => void;
  disabled: boolean;
}

export function AlgorithmSelector({ selected, onChange, disabled }: AlgorithmSelectorProps) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={() => onChange('dp')}
        disabled={disabled}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          background: selected === 'dp' ? '#3b82f6' : '#e5e7eb',
          color: selected === 'dp' ? 'white' : '#1f2937',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        动态规划
      </button>
      <button
        onClick={() => onChange('center-expansion')}
        disabled={disabled}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          background: selected === 'center-expansion' ? '#3b82f6' : '#e5e7eb',
          color: selected === 'center-expansion' ? 'white' : '#1f2937',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        中心扩散
      </button>
    </div>
  );
}
