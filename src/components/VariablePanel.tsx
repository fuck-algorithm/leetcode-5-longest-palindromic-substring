import { VisualizationStep } from '../types';

interface VariablePanelProps {
  step: VisualizationStep | null;
  input: string;
}

export function VariablePanel({ step, input }: VariablePanelProps) {
  if (!step) return null;

  const { currentLongestPalindrome: _currentLongestPalindrome } = step;
  void _currentLongestPalindrome; // 保留以备后用

  if (step.type === 'dp') {
    const { row: i, col: j } = step.currentCell;
    const substring = input.slice(i, j + 1);
    const isPalindrome = step.cellState === 'palindrome';
    const len = j - i + 1;

    return (
      <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', fontSize: '12px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#1e40af', fontSize: '13px' }}>🔢 当前检查</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
          <div style={{ background: '#e0e7ff', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ color: '#6366f1', fontSize: '10px' }}>起始 i</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{i}</div>
            <div style={{ color: '#6b7280', fontSize: '11px' }}>字符 "{input[i]}"</div>
          </div>
          <div style={{ background: '#e0e7ff', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ color: '#6366f1', fontSize: '10px' }}>结束 j</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{j}</div>
            <div style={{ color: '#6b7280', fontSize: '11px' }}>字符 "{input[j]}"</div>
          </div>
        </div>

        <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '6px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b' }}>子串 s[{i}..{j}]</span>
            <code style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{substring}</code>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <span style={{ color: '#64748b' }}>长度</span>
            <span style={{ fontWeight: 'bold' }}>{len} 个字符</span>
          </div>
        </div>

        <div style={{ 
          background: isPalindrome ? '#dcfce7' : '#fee2e2', 
          padding: '10px', 
          borderRadius: '6px',
          border: `2px solid ${isPalindrome ? '#22c55e' : '#ef4444'}`,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: isPalindrome ? '#166534' : '#991b1b' }}>dp[{i}][{j}] =</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: isPalindrome ? '#16a34a' : '#dc2626' }}>
            {isPalindrome ? '✓ TRUE' : '✗ FALSE'}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
            {isPalindrome ? '是回文！' : '不是回文'}
          </div>
        </div>
      </div>
    );
  }

  // 中心扩散
  const { leftPointer, rightPointer, expandState, centerType } = step;
  const leftChar = input[leftPointer] ?? '';
  const rightChar = input[rightPointer] ?? '';
  const isMatch = leftChar === rightChar;

  return (
    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', fontSize: '12px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#166534', fontSize: '13px' }}>🔢 当前检查</div>
      
      <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '6px', marginBottom: '8px', textAlign: 'center' }}>
        <div style={{ color: '#6b7280', fontSize: '10px' }}>中心类型</div>
        <div style={{ fontWeight: 'bold' }}>{centerType === 'single' ? '单字符中心' : '双字符中心'}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '4px', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ background: '#dbeafe', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ color: '#2563eb', fontSize: '10px' }}>左 L={leftPointer}</div>
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>"{leftChar}"</div>
        </div>
        <div style={{ fontSize: '20px', color: isMatch ? '#22c55e' : '#ef4444' }}>
          {isMatch ? '=' : '≠'}
        </div>
        <div style={{ background: '#fee2e2', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ color: '#dc2626', fontSize: '10px' }}>右 R={rightPointer}</div>
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>"{rightChar}"</div>
        </div>
      </div>

      <div style={{ 
        background: expandState === 'matched' ? '#dcfce7' : expandState === 'mismatched' ? '#fee2e2' : '#fef3c7',
        padding: '8px', 
        borderRadius: '6px',
        textAlign: 'center'
      }}>
        <div style={{ fontWeight: 'bold' }}>
          {expandState === 'matched' && '✓ 匹配！继续扩展'}
          {expandState === 'mismatched' && '✗ 不匹配，停止'}
          {expandState === 'boundary' && '🚧 到达边界'}
          {expandState === 'expanding' && '🔍 检查中...'}
        </div>
      </div>
    </div>
  );
}

// 保留以备后用
function _Row({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <tr>
      <td style={{ padding: '4px 8px', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>{label}</td>
      <td style={{ padding: '4px 8px', fontFamily: 'monospace', fontWeight: 'bold', color: highlight ? '#16a34a' : '#1e293b', borderBottom: '1px solid #e2e8f0' }}>{value}</td>
    </tr>
  );
}
void _Row;
