import { AlgorithmType } from '../types';

interface AlgorithmIntroProps {
  algorithm: AlgorithmType;
}

export function AlgorithmIntro({ algorithm }: AlgorithmIntroProps) {
  if (algorithm === 'dp') {
    return (
      <div style={{ background: '#f0f9ff', borderRadius: '8px', padding: '12px', fontSize: '13px', lineHeight: 1.6 }}>
        <div style={{ fontWeight: 'bold', color: '#0369a1', marginBottom: '8px' }}>💡 动态规划思路</div>
        <div style={{ color: '#374151' }}>
          <b>状态定义：</b>dp[i][j] 表示 s[i..j] 是否为回文
          <div style={{ background: '#dbeafe', padding: '8px', borderRadius: '6px', margin: '8px 0', fontFamily: 'monospace', fontSize: '12px' }}>
            <b>状态转移方程：</b><br/>
            dp[i][j] = (s[i] == s[j]) && dp[i+1][j-1]
          </div>
          <b>边界条件：</b><br/>
          ① dp[i][i] = true （单字符）<br/>
          ② 长度为2或3时，首尾相同即为回文<br/>
          <div style={{ marginTop: '8px', padding: '6px', background: '#e0f2fe', borderRadius: '4px', fontSize: '11px' }}>
            <b>时间复杂度：</b>O(n²) &nbsp; <b>空间复杂度：</b>O(n²)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '12px', fontSize: '13px', lineHeight: 1.6 }}>
      <div style={{ fontWeight: 'bold', color: '#166534', marginBottom: '8px' }}>💡 中心扩散思路</div>
      <div style={{ color: '#374151' }}>
        <b>核心想法：</b>回文串一定是对称的，从中心向两边扩展
        <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '6px', margin: '8px 0', fontFamily: 'monospace', fontSize: '12px' }}>
          枚举所有可能的中心位置：<br/>
          • 奇数长度：以单个字符为中心<br/>
          • 偶数长度：以两个字符为中心
        </div>
        <b>扩展过程：</b><br/>
        ① 从中心开始，left 和 right 指针<br/>
        ② 若 s[left] == s[right]，继续扩展<br/>
        ③ 否则停止，记录当前回文长度
        <div style={{ marginTop: '8px', padding: '6px', background: '#d1fae5', borderRadius: '4px', fontSize: '11px' }}>
          <b>时间复杂度：</b>O(n²) &nbsp; <b>空间复杂度：</b>O(1)
        </div>
      </div>
    </div>
  );
}
