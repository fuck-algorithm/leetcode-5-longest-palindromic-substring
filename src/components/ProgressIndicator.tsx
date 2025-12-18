import { VisualizationStep } from '../types';

interface ProgressIndicatorProps {
  step: VisualizationStep | null;
  input: string;
}

export function ProgressIndicator({ step, input }: ProgressIndicatorProps) {
  if (!step) return null;

  const n = input.length;
  
  if (step.type === 'dp') {
    const { row: i, col: j } = step.currentCell;
    const len = j - i + 1;
    
    // 计算当前阶段
    let phase = 1;
    let phaseText = '初始化单字符';
    let phaseDesc = '每个单独的字符都是回文';
    
    if (len === 2) {
      phase = 2;
      phaseText = '检查长度2';
      phaseDesc = '比较相邻两个字符是否相同';
    } else if (len >= 3) {
      phase = 3;
      phaseText = `检查长度${len}`;
      phaseDesc = '首尾相同 + 中间是回文 = 整体是回文';
    }

    // 计算进度
    const progress = Math.round((step.stepNumber / step.totalSteps) * 100);

    return (
      <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px', fontSize: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', color: '#1e40af' }}>📍 算法进度</span>
          <span style={{ color: '#6b7280' }}>{progress}%</span>
        </div>
        
        {/* 进度条 */}
        <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '6px', marginBottom: '10px' }}>
          <div style={{ 
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', 
            borderRadius: '4px', 
            height: '100%', 
            width: `${progress}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* 阶段指示 */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          {[1, 2, 3].map(p => (
            <div key={p} style={{
              flex: 1,
              padding: '4px',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '10px',
              background: p === phase ? '#dbeafe' : p < phase ? '#d1fae5' : '#f1f5f9',
              border: p === phase ? '2px solid #3b82f6' : '1px solid #e2e8f0',
              color: p === phase ? '#1e40af' : p < phase ? '#166534' : '#9ca3af'
            }}>
              {p === 1 && '长度1'}
              {p === 2 && '长度2'}
              {p === 3 && '长度≥3'}
              {p < phase && ' ✓'}
            </div>
          ))}
        </div>

        {/* 当前阶段说明 */}
        <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '6px' }}>
          <div style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '2px' }}>
            阶段 {phase}: {phaseText}
          </div>
          <div style={{ color: '#64748b', fontSize: '11px' }}>{phaseDesc}</div>
        </div>
      </div>
    );
  }

  // 中心扩散
  const { centerIndex, centerType, expandState } = step;
  void (2 * n - 1); // totalCenters 保留计算逻辑
  void (centerType === 'single' ? centerIndex * 2 : centerIndex * 2 + 1); // currentCenter 保留计算逻辑
  const progress = Math.round((step.stepNumber / step.totalSteps) * 100);

  return (
    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px', fontSize: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold', color: '#166534' }}>📍 算法进度</span>
        <span style={{ color: '#6b7280' }}>{progress}%</span>
      </div>
      
      <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '6px', marginBottom: '10px' }}>
        <div style={{ 
          background: 'linear-gradient(90deg, #22c55e, #10b981)', 
          borderRadius: '4px', 
          height: '100%', 
          width: `${progress}%`,
          transition: 'width 0.3s ease'
        }} />
      </div>

      <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '6px' }}>
        <div style={{ fontWeight: 'bold', color: '#166534', marginBottom: '2px' }}>
          中心 {centerIndex}: {centerType === 'single' ? '单字符' : '双字符'}
        </div>
        <div style={{ color: '#64748b', fontSize: '11px' }}>
          {expandState === 'matched' && '✓ 字符匹配，继续向外扩展'}
          {expandState === 'mismatched' && '✗ 字符不匹配，尝试下一个中心'}
          {expandState === 'boundary' && '🚧 到达边界，尝试下一个中心'}
          {expandState === 'expanding' && '🔍 正在检查...'}
        </div>
      </div>
    </div>
  );
}
