import { VisualizationStep } from '../types';

interface TutorialPanelProps {
  step: VisualizationStep | null;
  input: string;
}

export function TutorialPanel({ step, input }: TutorialPanelProps) {
  if (!step) {
    return (
      <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '16px', border: '2px solid #3b82f6' }}>
        <div style={{ fontSize: '16px', marginBottom: '12px', fontWeight: 'bold', color: '#1e40af' }}>🎯 什么是回文？</div>
        <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#374151' }}>
          <b>回文</b> = 正着读和倒着读<b>完全一样</b>的字符串
          <div style={{ background: '#dbeafe', padding: '8px', borderRadius: '6px', marginTop: '8px' }}>
            ✅ "aba" → 倒过来还是 "aba"<br/>
            ✅ "abba" → 倒过来还是 "abba"<br/>
            ❌ "abc" → 倒过来是 "cba"，不一样
          </div>
          <div style={{ marginTop: '12px' }}>
            <b>目标：</b>在 "<span style={{ color: '#2563eb' }}>{input}</span>" 中找最长的回文
          </div>
        </div>
      </div>
    );
  }

  if (step.type === 'dp') {
    return <DPTutorial step={step} input={input} />;
  }
  return <CenterTutorial step={step} input={input} />;
}

function DPTutorial({ step, input }: { step: VisualizationStep & { type: 'dp' }; input: string }) {
  const { row: i, col: j } = step.currentCell;
  const len = j - i + 1;
  const substring = input.slice(i, j + 1);
  const isPalindrome = step.cellState === 'palindrome';
  const reversed = substring.split('').reverse().join('');

  // 构建带高亮的字符串显示
  const highlightedInput = input.split('').map((char, idx) => {
    const isHighlighted = idx >= i && idx <= j;
    return (
      <span key={idx} style={{ 
        background: isHighlighted ? (isPalindrome ? '#86efac' : '#fca5a5') : 'transparent',
        padding: '0 2px',
        borderRadius: '2px',
        fontWeight: isHighlighted ? 'bold' : 'normal'
      }}>{char}</span>
    );
  });

  let title = '';
  let explanation = '';

  if (len === 1) {
    title = '🔤 检查单个字符';
    explanation = `单个字符 "${substring}" 自己和自己当然一样，所以一定是回文！`;
  } else if (len === 2) {
    title = '🔤🔤 检查两个字符';
    if (isPalindrome) {
      explanation = `"${input[i]}" 和 "${input[j]}" 相同 → 是回文！`;
    } else {
      explanation = `"${input[i]}" 和 "${input[j]}" 不同 → 不是回文`;
    }
  } else {
    title = `🔍 检查 ${len} 个字符`;
    const firstChar = input[i];
    const lastChar = input[j];
    const inner = input.slice(i + 1, j);
    
    if (firstChar !== lastChar) {
      explanation = `首尾不同（"${firstChar}" ≠ "${lastChar}"）→ 直接排除，不是回文`;
    } else if (isPalindrome) {
      explanation = `首尾相同（都是"${firstChar}"）+ 中间"${inner}"是回文 → 整体是回文！`;
    } else {
      explanation = `首尾相同（都是"${firstChar}"），但中间"${inner}"不是回文 → 整体不是回文`;
    }
  }

  return (
    <div style={{ background: isPalindrome ? '#d1fae5' : '#fee2e2', borderRadius: '12px', padding: '14px', border: `2px solid ${isPalindrome ? '#10b981' : '#ef4444'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{title}</span>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>步骤 {step.stepNumber}/{step.totalSteps}</span>
      </div>
      
      <div style={{ fontSize: '16px', fontFamily: 'monospace', marginBottom: '10px', letterSpacing: '2px' }}>
        {highlightedInput}
      </div>
      
      <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#374151' }}>
        {explanation}
      </div>
      
      <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(255,255,255,0.6)', borderRadius: '6px', fontSize: '13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>正读:</span>
          <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{substring}</code>
          <span>倒读:</span>
          <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{reversed}</code>
          <span>{substring === reversed ? '✅' : '❌'}</span>
        </div>
      </div>
      
      <div style={{ marginTop: '10px', padding: '8px', background: '#fef3c7', borderRadius: '6px', fontSize: '13px' }}>
        🏆 当前最长: "<b style={{ color: '#059669' }}>{step.currentLongestPalindrome.text}</b>" (长度 {step.currentLongestPalindrome.text.length})
      </div>
    </div>
  );
}

function CenterTutorial({ step, input }: { step: VisualizationStep & { type: 'center-expansion' }; input: string }) {
  const { leftPointer, rightPointer, expandState, centerType } = step;
  const leftChar = input[leftPointer] ?? '';
  const rightChar = input[rightPointer] ?? '';
  const currentSubstring = input.slice(leftPointer, rightPointer + 1);

  // 构建带高亮的字符串显示
  const highlightedInput = input.split('').map((char, idx) => {
    const isCenter = idx >= leftPointer && idx <= rightPointer;
    const isPointer = idx === leftPointer || idx === rightPointer;
    return (
      <span key={idx} style={{ 
        background: isCenter ? (expandState === 'matched' ? '#86efac' : expandState === 'mismatched' ? '#fca5a5' : '#fde047') : 'transparent',
        padding: '0 2px',
        borderRadius: '2px',
        fontWeight: isPointer ? 'bold' : 'normal',
        textDecoration: isPointer ? 'underline' : 'none'
      }}>{char}</span>
    );
  });

  let title = '';
  let explanation = '';
  
  if (centerType === 'single' && leftPointer === rightPointer) {
    title = '🎯 选择中心点';
    explanation = `以 "${leftChar}" 为中心，准备向两边扩展`;
  } else if (centerType === 'double' && rightPointer === leftPointer + 1 && expandState !== 'matched') {
    title = '🎯 选择双字符中心';
    if (leftChar === rightChar) {
      explanation = `以 "${leftChar}${rightChar}" 为中心（两字符相同），准备扩展`;
    } else {
      explanation = `"${leftChar}" ≠ "${rightChar}"，跳过这个中心`;
    }
  } else if (expandState === 'matched') {
    title = '✅ 扩展成功';
    explanation = `左边 "${leftChar}" = 右边 "${rightChar}"，回文变长了！`;
  } else if (expandState === 'mismatched') {
    title = '⛔ 扩展停止';
    explanation = `左边 "${leftChar}" ≠ 右边 "${rightChar}"，无法继续`;
  } else if (expandState === 'boundary') {
    title = '🚧 到达边界';
    explanation = `已经到字符串边界，无法继续扩展`;
  }

  const bgColor = expandState === 'matched' ? '#d1fae5' : expandState === 'mismatched' ? '#fee2e2' : '#fef3c7';
  const borderColor = expandState === 'matched' ? '#10b981' : expandState === 'mismatched' ? '#ef4444' : '#f59e0b';

  return (
    <div style={{ background: bgColor, borderRadius: '12px', padding: '14px', border: `2px solid ${borderColor}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{title}</span>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>步骤 {step.stepNumber}/{step.totalSteps}</span>
      </div>
      
      <div style={{ fontSize: '16px', fontFamily: 'monospace', marginBottom: '10px', letterSpacing: '2px' }}>
        {highlightedInput}
      </div>
      
      <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#374151' }}>
        {explanation}
      </div>
      
      <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(255,255,255,0.6)', borderRadius: '6px', fontSize: '13px' }}>
        当前回文: "<code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>{currentSubstring}</code>" (长度 {currentSubstring.length})
      </div>
      
      <div style={{ marginTop: '10px', padding: '8px', background: '#fef3c7', borderRadius: '6px', fontSize: '13px' }}>
        🏆 当前最长: "<b style={{ color: '#059669' }}>{step.currentLongestPalindrome.text}</b>" (长度 {step.currentLongestPalindrome.text.length})
      </div>
    </div>
  );
}
