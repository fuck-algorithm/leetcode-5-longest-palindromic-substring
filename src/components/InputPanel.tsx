import { useState } from 'react';
import { validateInput } from '../utils/validation';

interface InputPanelProps {
  initialValue: string;
  onSubmit: (value: string) => void;
  disabled: boolean;
}

export function InputPanel({ initialValue, onSubmit, disabled }: InputPanelProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const result = validateInput(value);
    if (!result.isValid) {
      setError(result.error ?? '输入无效');
      return;
    }
    setError(result.error ?? null);
    onSubmit(result.sanitizedInput ?? value);
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder="输入字符串..."
        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #d1d5db', width: '200px' }}
      />
      <button onClick={handleSubmit} disabled={disabled}
        style={{ padding: '8px 16px', borderRadius: '4px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}>
        开始
      </button>
      {error && <span style={{ color: '#ef4444', fontSize: '14px' }}>{error}</span>}
    </div>
  );
}
