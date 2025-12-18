interface ResultPanelProps {
  result: { palindrome: string; startIndex: number; endIndex: number } | null;
  totalSteps: number;
  isComplete: boolean;
}

export function ResultPanel({ result, totalSteps, isComplete }: ResultPanelProps) {
  if (!isComplete || !result) {
    return (
      <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
        <span style={{ color: '#6b7280' }}>动画播放中...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '12px', background: '#d1fae5', borderRadius: '8px', textAlign: 'center' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>最长回文子串</div>
      <div style={{ fontSize: '20px', color: '#059669' }}>"{result.palindrome}"</div>
      <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
        位置: [{result.startIndex}, {result.endIndex}] | 总步骤: {totalSteps}
      </div>
    </div>
  );
}
