import { AlgorithmType, VisualizationStep, DPAnimationStep, CenterExpansionStep } from '../types';

interface PseudoCodeProps {
  algorithm: AlgorithmType;
  step: VisualizationStep | null;
  inputLength: number;
}

interface CodeLine {
  text: string;
  lineNum: number;
  id: string;
}

// 动态规划 Java 代码 - 基于 LeetCode 题解标准写法
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
  { text: '                // 长度为2或3时，首尾相同即为回文', lineNum: 19, id: 'comment-short' },
  { text: '                if (L <= 3) {', lineNum: 20, id: 'check-short' },
  { text: '                    dp[i][j] = true;', lineNum: 21, id: 'set-short-true' },
  { text: '                } else {', lineNum: 22, id: 'else-long' },
  { text: '                    // 状态转移：dp[i][j] = dp[i+1][j-1]', lineNum: 23, id: 'comment-transfer' },
  { text: '                    dp[i][j] = dp[i + 1][j - 1];', lineNum: 24, id: 'transfer' },
  { text: '                }', lineNum: 25, id: 'endif-short' },
  { text: '            }', lineNum: 26, id: 'endif-char' },
  { text: '            // 更新最长回文', lineNum: 27, id: 'comment-update' },
  { text: '            if (dp[i][j] && L > maxLen) {', lineNum: 28, id: 'check-update' },
  { text: '                maxLen = L;', lineNum: 29, id: 'update-len' },
  { text: '                maxStart = i;', lineNum: 30, id: 'update-start' },
  { text: '            }', lineNum: 31, id: 'endif-update' },
  { text: '        }', lineNum: 32, id: 'end-loop-i' },
  { text: '    }', lineNum: 33, id: 'end-loop-len' },
  { text: '    return s.substring(maxStart, maxStart + maxLen);', lineNum: 34, id: 'return' },
  { text: '}', lineNum: 35, id: 'func-end' },
];

// 中心扩散 Java 代码 - 基于 LeetCode 题解标准写法
const centerCode: CodeLine[] = [
  { text: 'public String longestPalindrome(String s) {', lineNum: 1, id: 'func-start' },
  { text: '    if (s == null || s.length() < 1) return "";', lineNum: 2, id: 'edge-case' },
  { text: '    int start = 0, end = 0;', lineNum: 3, id: 'init-result' },
  { text: '', lineNum: 4, id: 'blank1' },
  { text: '    for (int i = 0; i < s.length(); i++) {', lineNum: 5, id: 'loop-center' },
  { text: '        // 以 i 为中心（奇数长度回文）', lineNum: 6, id: 'comment-odd' },
  { text: '        int len1 = expandAroundCenter(s, i, i);', lineNum: 7, id: 'expand-odd' },
  { text: '        // 以 i 和 i+1 为中心（偶数长度回文）', lineNum: 8, id: 'comment-even' },
  { text: '        int len2 = expandAroundCenter(s, i, i + 1);', lineNum: 9, id: 'expand-even' },
  { text: '        int len = Math.max(len1, len2);', lineNum: 10, id: 'max-len' },
  { text: '        if (len > end - start) {', lineNum: 11, id: 'check-update' },
  { text: '            start = i - (len - 1) / 2;', lineNum: 12, id: 'update-start' },
  { text: '            end = i + len / 2;', lineNum: 13, id: 'update-end' },
  { text: '        }', lineNum: 14, id: 'endif-update' },
  { text: '    }', lineNum: 15, id: 'end-loop-center' },
  { text: '    return s.substring(start, end + 1);', lineNum: 16, id: 'return' },
  { text: '}', lineNum: 17, id: 'func-end' },
  { text: '', lineNum: 18, id: 'blank2' },
  { text: '// 从中心向两边扩展，返回回文长度', lineNum: 19, id: 'comment-expand' },
  { text: 'int expandAroundCenter(String s, int left, int right) {', lineNum: 20, id: 'expand-func' },
  { text: '    while (left >= 0 && right < s.length()', lineNum: 21, id: 'while-cond1' },
  { text: '           && s.charAt(left) == s.charAt(right)) {', lineNum: 22, id: 'while-cond2' },
  { text: '        left--;   // 向左扩展', lineNum: 23, id: 'expand-left' },
  { text: '        right++;  // 向右扩展', lineNum: 24, id: 'expand-right' },
  { text: '    }', lineNum: 25, id: 'end-while' },
  { text: '    // 返回回文长度', lineNum: 26, id: 'comment-return' },
  { text: '    return right - left - 1;', lineNum: 27, id: 'return-len' },
  { text: '}', lineNum: 28, id: 'expand-func-end' },
];


// 获取 DP 算法当前应高亮的代码行
function getDPHighlightLines(step: DPAnimationStep): number[] {
  const { row: i, col: j } = step.currentCell;
  const len = j - i + 1;
  const isPalindrome = step.cellState === 'palindrome';

  // 长度为1：初始化阶段
  if (len === 1) {
    return [8, 9]; // for循环和dp[i][i]=true
  }

  // 长度为2或3：首尾相同即为回文
  if (len === 2 || len === 3) {
    if (isPalindrome) {
      return [16, 20, 21]; // 检查字符 + 短长度判断 + 设为true
    } else {
      return [16, 17]; // 字符不等，设为false
    }
  }

  // 长度>=4：需要状态转移
  if (isPalindrome) {
    return [16, 24, 28, 29, 30]; // 字符相等 + 状态转移 + 更新最长
  } else {
    return [16, 17]; // 字符不等 或 内部不是回文
  }
}

// 获取中心扩散算法当前应高亮的代码行
function getCenterHighlightLines(step: CenterExpansionStep): number[] {
  const { expandState, centerType, leftPointer, rightPointer } = step;

  // 初始化中心
  if (leftPointer === rightPointer && centerType === 'single') {
    if (expandState === 'matched') {
      return [7, 21, 22]; // 调用expand + while条件
    }
  }

  if (centerType === 'double' && rightPointer === leftPointer + 1) {
    if (expandState === 'matched') {
      return [9, 21, 22]; // 调用expand + while条件
    }
    if (expandState === 'mismatched') {
      return [9, 21, 22, 27]; // 不匹配，返回长度
    }
  }

  // 扩展过程
  if (expandState === 'matched') {
    return [21, 22, 23, 24]; // while条件 + 扩展
  }

  if (expandState === 'mismatched' || expandState === 'boundary') {
    return [25, 27]; // 退出while + 返回长度
  }

  return [5]; // 默认：遍历中心
}

function getHighlightLines(step: VisualizationStep | null): number[] {
  if (!step) return [];
  
  if (step.type === 'dp') {
    return getDPHighlightLines(step);
  } else {
    return getCenterHighlightLines(step);
  }
}

// 语法高亮
function highlightSyntax(text: string): JSX.Element[] {
  const keywords = /\b(public|private|int|boolean|String|for|if|else|while|return|new|true|false|null)\b/g;
  const methods = /\b(length|charAt|substring|max|expandAroundCenter|Math)\b/g;
  const numbers = /\b\d+\b/g;
  
  // 使用唯一标记进行替换，保留原始匹配内容
  let result = text;
  result = result.replace(keywords, '\u0001k$&\u0001');
  result = result.replace(methods, '\u0001m$&\u0001');
  result = result.replace(numbers, '\u0001n$&\u0001');
  
  const segments = result.split('\u0001');
  return segments.map((seg, i) => {
    if (seg.startsWith('k')) {
      return <span key={i} style={{ color: '#569cd6' }}>{seg.slice(1)}</span>;
    } else if (seg.startsWith('m')) {
      return <span key={i} style={{ color: '#dcdcaa' }}>{seg.slice(1)}</span>;
    } else if (seg.startsWith('n')) {
      return <span key={i} style={{ color: '#b5cea8' }}>{seg.slice(1)}</span>;
    }
    return <span key={i}>{seg}</span>;
  });
}

export function PseudoCode({ algorithm, step }: Omit<PseudoCodeProps, 'inputLength'>) {
  const code = algorithm === 'dp' ? dpCode : centerCode;
  const title = algorithm === 'dp' ? '动态规划 (Java)' : '中心扩散 (Java)';
  const highlightLines = getHighlightLines(step);
  const primaryLine = highlightLines[0] || -1;

  return (
    <div style={{ background: '#1e1e1e', borderRadius: '8px', padding: '12px', fontSize: '11px', fontFamily: 'Consolas, Monaco, monospace', color: '#d4d4d4', overflow: 'auto', height: '100%' }}>
      <div style={{ color: '#569cd6', marginBottom: '8px', fontWeight: 'bold', fontSize: '12px' }}>☕ {title}</div>
      {code.map((line) => {
        const isPrimary = line.lineNum === primaryLine;
        const isSecondary = highlightLines.includes(line.lineNum) && !isPrimary;
        const isComment = line.text.trim().startsWith('//');
        
        let bgColor = 'transparent';
        let borderColor = 'transparent';
        let lineNumColor = '#858585';
        
        if (isPrimary) {
          bgColor = '#264f78';
          borderColor = '#fde047';
          lineNumColor = '#fde047';
        } else if (isSecondary) {
          bgColor = '#1e3a5f';
          borderColor = '#4a90d9';
          lineNumColor = '#4a90d9';
        }
        
        return (
          <div
            key={line.lineNum}
            style={{
              display: 'flex',
              background: bgColor,
              borderLeft: `3px solid ${borderColor}`,
              borderRadius: '2px',
              transition: 'all 0.15s ease',
              padding: '1px 0',
            }}
          >
            <span style={{ 
              width: '24px', 
              color: lineNumColor, 
              textAlign: 'right', 
              paddingRight: '8px', 
              userSelect: 'none', 
              fontWeight: isPrimary ? 'bold' : 'normal' 
            }}>
              {line.lineNum}
            </span>
            <span style={{ whiteSpace: 'pre' }}>
              {isComment ? (
                <span style={{ color: '#6a9955' }}>{line.text}</span>
              ) : (
                highlightSyntax(line.text)
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
