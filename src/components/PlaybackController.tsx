interface PlaybackControllerProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export function PlaybackController({
  isPlaying, currentStep, totalSteps, speed,
  onPlay, onPause, onNext, onPrev, onReset, onSpeedChange,
}: PlaybackControllerProps) {
  const btnStyle = { padding: '8px 12px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <button onClick={onReset} style={btnStyle}>重置</button>
      <button onClick={onPrev} disabled={currentStep <= 0} style={btnStyle}>上一步</button>
      {isPlaying ? (
        <button onClick={onPause} style={{ ...btnStyle, background: '#fef3c7' }}>暂停</button>
      ) : (
        <button onClick={onPlay} disabled={currentStep >= totalSteps - 1} style={{ ...btnStyle, background: '#d1fae5' }}>播放</button>
      )}
      <button onClick={onNext} disabled={currentStep >= totalSteps - 1} style={btnStyle}>下一步</button>
      <span style={{ fontSize: '14px', color: '#6b7280' }}>步骤 {currentStep + 1}/{totalSteps}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '14px' }}>速度:</span>
        <input type="range" min="0.5" max="3" step="0.5" value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          style={{ width: '80px' }} />
        <span style={{ fontSize: '14px' }}>{speed}x</span>
      </div>
    </div>
  );
}
