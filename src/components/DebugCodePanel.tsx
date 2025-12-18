import { AlgorithmType, VisualizationStep, DPAnimationStep, CenterExpansionStep } from '../types';

interface DebugCodePanelProps {
  algorithm: AlgorithmType;
  step: VisualizationStep | null;
  input: string;
}

interface CodeLine {
  text: string;
  lineNum: number;
  id: string;
}

interface VariableValue {
  name: string;
  value: string;
  type: 'number' | 'string' | 'boolean' | 'array';
}

// 动态规划 Java 代码
const dpCode: CodeLine[] = [
  { text: 'public String longestPalindrome(String s) {', lineNum: 1, id: 'func-start' },
  { text: '    int n = s.length();', lineNum: 2, id: 'init-n' },
  { text: '    if (n < 2) return s;', lineNum: 3, id: 'edge-case' },
  { text: '    boolean[][] dp = new boolean[n][n];', lineNum: 4, id: 'init-dp' },
  { text: '    int maxStart = 0, maxLen = 1;', lineNum: 5, id: 'init-result' },
  { text: '', lineNum: 6, id: 'blank1' },
  { text: '    // 所有长度为1的子串都是回文', lineNum: 7, id: 'comment-len1' },
  { text: '    for (int i = 0; i < n; i++) {', lineNum: 8, id: 'loop-len1' },
  { text: '        dp[i][i] = true;', lineNum: 9, id: 'set-len1' },
  { text: '    }', lineNum: 10, id: 'loop-len1-end' },
  { text: '', lineNum: 11, id: 'blank2' },
  { text: '    // 递推：从长度2开始', lineNum: 12, id: 'comment-len2' },
  { text: '    for (int L = 2; L <= n; L++) {', lineNum: 13, id: 'loop-len' },
  { text: '        for (int i = 0; i < n - L + 1; i++) {', lineNum: 14, id: 'loop-i' },
  { text: '            int j = i + L - 1;', lineNum: 15, id: 'calc-j' },
  { text: '            if (s.charAt(i) != s.charAt(j)) {', lineNum: 16, id: 'check-char-neq' },
  { text: '                dp[i][j] = false;', lineNum: 17, id: 'set-false' },
  { text: '            } else {', lineNum: 18, id: 'else' },
  { text: '                if (L <= 3) {', lineNum: 19, id: 'check-short' },
  { text: '                    dp[i][j] = true;', lineNum: 20, id: 'set-short-true' },
  { text: '                } else {', lineNum: 21, id: 'else-long' },
  { text: '                    dp[i][j] = dp[i + 1][j - 1];', lineNum: 22, id: 'transfer' },
  { text: '                }', lineNum: 23, id: 'endif-short' },
  { text: '            }', lineNum: 24, id: 'endif-char' },
  { text: '            if (dp[i][j] && L > maxLen) {', lineNum: 25, id: 'check-update' },
  { text: '                maxLen = L;', lineNum: 26, id: 'update-len' },
  { text: '                maxStart = i;', lineNum: 27, id: 'update-start' },
  { text: '            }', lineNum: 28, id: 'endif-update' },
  { text: '        }', lineNum: 29, id: 'end-loop-i' },
  { text: '    }', lineNum: 30, id: 'end-loop-len' },
  { text: '    return s.substring(maxStart, maxStart + maxLen);', lineNum: 31, id: 'return' },
  { text: '}', lineNum: 32, id: 'func-end' },
];

// 中心扩散 Java 代码
const centerCode: CodeLine[] = [
  { text: 'public String longestPalindrome(String s) {', lineNum: 1, id: 'func-start' },
  { text: '    if (s == null || s.length() < 1) return "";', lineNum: 2, id: 'edge-case' },
  { text: '    int start = 0, end = 0;', lineNum: 3, id: 'init-result' },
  { text: '', lineNum: 4, id: 'blank1' },
  { text: '    for (int i = 0; i < s.length(); i++) {', lineNum: 5, id: 'loop-center' },
  { text: '        int len1 = expand(s, i, i);     // 奇数', lineNum: 6, id: 'expand-odd' },
  { text: '        int len2 = expand(s, i, i + 1); // 偶数', lineNum: 7, id: 'expand-even' },
  { text: '        int len = Math.max(len1, len2);', lineNum: 8, id: 'max-len' },
  { text: '        if (len > end - start) {', lineNum: 9, id: 'check-update' },
  { text: '            start = i - (len - 1) / 2;', lineNum: 10, id: 'update-start' },
  { text: '            end = i + len / 2;', lineNum: 11, id: 'update-end' },
  { text: '        }', lineNum: 12, id: 'endif-update' },
  { text: '    }', lineNum: 13, id: 'end-loop-center' },
  { text: '    return s.substring(start, end + 1);', lineNum: 14, id: 'return' },
  { text: '}', lineNum: 15, id: 'func-end' },
  { text: '', lineNum: 16, id: 'blank2' },
  { text: 'int expand(String s, int left, int right) {', lineNum: 17, id: 'expand-func' },
  { text: '    while (left >= 0 && right < s.length()', lineNum: 18, id: 'while-cond1' },
  { text: '            && s.charAt(left) == s.charAt(right)) {', lineNum: 19, id: 'while-cond2' },
  { text: '        left--;', lineNum: 20, id: 'expand-left' },
  { text: '        right++;', lineNum: 21, id: 'expand-right' },
  { text: '    }', lineNum: 22, id: 'end-while' },
  { text: '    return right - left - 1;', lineNum: 23, id: 'return-len' },
  { text: '}', lineNum: 24, id: 'expand-func-end' },
];


// 获取 DP 算法当前高亮行和变量值
function getDPDebugInfo(step: DPAnimationStep, input: string): { 
  highlightLine: number; 
  secondaryLines: number[];
  variables: Map<number, VariableValue[]>;
} {
  const { row: i, col: j } = step.currentCell;
  const len = j - i + 1;
  const isPalindrome = step.cellState === 'palindrome';
  const n = input.length;
  
  const variables = new Map<number, VariableValue[]>();
  
  // 基础变量 - 在第2行显示 n
  variables.set(2, [{ name: 'n', value: String(n), type: 'number' }]);
  
  // 在第5行显示 maxStart 和 maxLen
  variables.set(5, [
    { name: 'maxStart', value: String(step.currentLongestPalindrome.start), type: 'number' },
    { name: 'maxLen', value: String(step.currentLongestPalindrome.text.length), type: 'number' }
  ]);

  // 长度为1：初始化阶段
  if (len === 1) {
    variables.set(8, [{ name: 'i', value: String(i), type: 'number' }]);
    variables.set(9, [{ name: `dp[${i}][${i}]`, value: 'true', type: 'boolean' }]);
    return { highlightLine: 9, secondaryLines: [8], variables };
  }

  // 在循环行显示 L, i, j
  variables.set(13, [{ name: 'L', value: String(len), type: 'number' }]);
  variables.set(14, [{ name: 'i', value: String(i), type: 'number' }]);
  variables.set(15, [
    { name: 'j', value: String(j), type: 'number' },
    { name: `s[${i}]`, value: `"${input[i]}"`, type: 'string' },
    { name: `s[${j}]`, value: `"${input[j]}"`, type: 'string' }
  ]);

  // 长度为2或3
  if (len === 2 || len === 3) {
    if (isPalindrome) {
      variables.set(20, [{ name: `dp[${i}][${j}]`, value: 'true', type: 'boolean' }]);
      return { highlightLine: 20, secondaryLines: [13, 14, 15, 16, 19], variables };
    } else {
      variables.set(17, [{ name: `dp[${i}][${j}]`, value: 'false', type: 'boolean' }]);
      return { highlightLine: 17, secondaryLines: [13, 14, 15, 16], variables };
    }
  }

  // 长度>=4：状态转移
  if (isPalindrome) {
    const innerVal = step.dpTable[i + 1]?.[j - 1];
    variables.set(22, [
      { name: `dp[${i+1}][${j-1}]`, value: String(innerVal), type: 'boolean' },
      { name: `dp[${i}][${j}]`, value: 'true', type: 'boolean' }
    ]);
    return { highlightLine: 22, secondaryLines: [13, 14, 15, 16], variables };
  } else {
    if (input[i] !== input[j]) {
      variables.set(17, [{ name: `dp[${i}][${j}]`, value: 'false', type: 'boolean' }]);
      return { highlightLine: 17, secondaryLines: [13, 14, 15, 16], variables };
    } else {
      const innerVal = step.dpTable[i + 1]?.[j - 1];
      variables.set(22, [
        { name: `dp[${i+1}][${j-1}]`, value: String(innerVal), type: 'boolean' },
        { name: `dp[${i}][${j}]`, value: 'false', type: 'boolean' }
      ]);
      return { highlightLine: 22, secondaryLines: [13, 14, 15, 16], variables };
    }
  }
}

// 获取中心扩散算法当前高亮行和变量值
function getCenterDebugInfo(step: CenterExpansionStep, input: string): {
  highlightLine: number;
  secondaryLines: number[];
  variables: Map<number, VariableValue[]>;
} {
  const { expandState, centerType, leftPointer, rightPointer, centerIndex } = step;
  const variables = new Map<number, VariableValue[]>();
  
  // 基础变量
  variables.set(3, [
    { name: 'start', value: String(step.currentLongestPalindrome.start), type: 'number' },
    { name: 'end', value: String(step.currentLongestPalindrome.end), type: 'number' }
  ]);
  
  variables.set(5, [{ name: 'i', value: String(centerIndex), type: 'number' }]);

  // expand 函数内的变量
  variables.set(17, [
    { name: 'left', value: String(leftPointer), type: 'number' },
    { name: 'right', value: String(rightPointer), type: 'number' }
  ]);
  
  const leftChar = input[leftPointer] ?? '?';
  const rightChar = input[rightPointer] ?? '?';
  variables.set(19, [
    { name: `s[${leftPointer}]`, value: `"${leftChar}"`, type: 'string' },
    { name: `s[${rightPointer}]`, value: `"${rightChar}"`, type: 'string' }
  ]);

  // 根据状态确定高亮行
  if (expandState === 'matched') {
    if (centerType === 'single') {
      variables.set(6, [{ name: 'len1', value: '...', type: 'number' }]);
      return { highlightLine: 19, secondaryLines: [5, 6, 17, 18, 20, 21], variables };
    } else {
      variables.set(7, [{ name: 'len2', value: '...', type: 'number' }]);
      return { highlightLine: 19, secondaryLines: [5, 7, 17, 18, 20, 21], variables };
    }
  }

  if (expandState === 'mismatched' || expandState === 'boundary') {
    const len = rightPointer - leftPointer - 1;
    variables.set(23, [{ name: 'return', value: String(len > 0 ? len : rightPointer - leftPointer + 1), type: 'number' }]);
    return { highlightLine: 23, secondaryLines: [17, 18, 19, 22], variables };
  }

  // 默认：遍历中心
  return { highlightLine: 5, secondaryLines: [], variables };
}

function getDebugInfo(step: VisualizationStep | null, input: string) {
  if (!step) {
    return { highlightLine: -1, secondaryLines: [], variables: new Map<number, VariableValue[]>() };
  }
  
  if (step.type === 'dp') {
    return getDPDebugInfo(step, input);
  } else {
    return getCenterDebugInfo(step, input);
  }
}


// 语法高亮
function highlightSyntax(text: string): JSX.Element[] {
  const parts: JSX.Element[] = [];
  let remaining = text;
  let keyIndex = 0;

  const patterns = [
    { regex: /\/\/.*$/, className: 'syntax-comment' },
    { regex: /\b(public|private|int|boolean|String|for|if|else|while|return|new|true|false|null)\b/, className: 'syntax-keyword' },
    { regex: /\b(length|charAt|substring|max|expand|Math)\b/, className: 'syntax-method' },
    { regex: /\b\d+\b/, className: 'syntax-number' },
    { regex: /"[^"]*"/, className: 'syntax-string' },
  ];

  while (remaining.length > 0) {
    let earliestMatch: { index: number; length: number; className: string } | null = null;

    for (const pattern of patterns) {
      const match = remaining.match(pattern.regex);
      if (match && match.index !== undefined) {
        if (!earliestMatch || match.index < earliestMatch.index) {
          earliestMatch = { index: match.index, length: match[0].length, className: pattern.className };
        }
      }
    }

    if (earliestMatch) {
      if (earliestMatch.index > 0) {
        parts.push(<span key={keyIndex++}>{remaining.slice(0, earliestMatch.index)}</span>);
      }
      parts.push(
        <span key={keyIndex++} className={earliestMatch.className}>
          {remaining.slice(earliestMatch.index, earliestMatch.index + earliestMatch.length)}
        </span>
      );
      remaining = remaining.slice(earliestMatch.index + earliestMatch.length);
    } else {
      parts.push(<span key={keyIndex++}>{remaining}</span>);
      break;
    }
  }

  return parts;
}

// 变量值显示组件
function InlineVariables({ variables }: { variables: VariableValue[] }) {
  if (variables.length === 0) return null;
  
  return (
    <span className="inline-variables">
      {variables.map((v, idx) => (
        <span key={idx} className={`var-badge var-${v.type}`}>
          <span className="var-name">{v.name}</span>
          <span className="var-eq">=</span>
          <span className="var-value">{v.value}</span>
        </span>
      ))}
    </span>
  );
}

export function DebugCodePanel({ algorithm, step, input }: DebugCodePanelProps) {
  const code = algorithm === 'dp' ? dpCode : centerCode;
  const title = algorithm === 'dp' ? '动态规划' : '中心扩散';
  const { highlightLine, secondaryLines, variables } = getDebugInfo(step, input);

  return (
    <div className="debug-code-panel">
      <div className="debug-header">
        <div className="debug-title">
          <span className="debug-icon">☕</span>
          <span>{title} - Java</span>
        </div>
        {step && (
          <div className="debug-status">
            <span className="status-dot"></span>
            <span>调试中</span>
          </div>
        )}
      </div>
      
      <div className="debug-code-container">
        {code.map((line) => {
          const isPrimary = line.lineNum === highlightLine;
          const isSecondary = secondaryLines.includes(line.lineNum);
          const lineVars = variables.get(line.lineNum) || [];
          const isComment = line.text.trim().startsWith('//');
          
          let lineClass = 'code-row';
          if (isPrimary) lineClass += ' highlight-primary';
          else if (isSecondary) lineClass += ' highlight-secondary';
          
          return (
            <div key={line.lineNum} className={lineClass}>
              <div className={`gutter-cell ${isPrimary ? 'breakpoint' : ''}`}>
                {isPrimary && <span className="breakpoint-dot">●</span>}
                <span className="line-num">{line.lineNum}</span>
              </div>
              <div className="code-cell">
                <span className="code-text">
                  {isComment ? (
                    <span className="syntax-comment">{line.text}</span>
                  ) : (
                    highlightSyntax(line.text)
                  )}
                </span>
                {lineVars.length > 0 && <InlineVariables variables={lineVars} />}
              </div>
            </div>
          );
        })}
      </div>
      
      {step && (
        <div className="debug-watch-panel">
          <div className="watch-title">监视</div>
          <div className="watch-list">
            {Array.from(variables.entries()).flatMap(([, vars]) => 
              vars.map((v, idx) => (
                <div key={`${v.name}-${idx}`} className="watch-item">
                  <span className="watch-name">{v.name}</span>
                  <span className={`watch-value type-${v.type}`}>{v.value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
