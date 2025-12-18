import { useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAnimationController } from './hooks/useAnimationController';
import { AlgorithmType } from './types';
import { DebugCodePanel } from './components/DebugCodePanel';
import './App.css';

// 主应用组件（带路由）
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AlgorithmPage />} />
        <Route path="/dp" element={<AlgorithmPage />} />
        <Route path="/center-expansion" element={<AlgorithmPage />} />
      </Routes>
    </HashRouter>
  );
}

// 算法页面组件
function AlgorithmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  
  // 根据 URL 确定算法类型，默认是 center-expansion
  const getAlgorithmFromPath = (): AlgorithmType => {
    if (pathname === '/dp') return 'dp';
    return 'center-expansion'; // 默认是 center-expansion
  };



  const { state, initialize, play, pause, nextStep, prevStep, reset, goToStep, setSpeed, getCurrentStep } = useAnimationController();

  // 初始化时根据 URL 设置算法
  useEffect(() => {
    const algo = getAlgorithmFromPath();
    if (state.algorithm !== algo) {
      initialize(state.input, algo);
    }
  }, [pathname]);

  const handleInputSubmit = (value: string) => initialize(value, state.algorithm);
  
  const handleAlgorithmChange = (algo: AlgorithmType) => {
    // 切换算法时更新 URL
    const path = algo === 'dp' ? '/dp' : '/center-expansion';
    navigate(path);
    initialize(state.input, algo);
  };

  const currentStep = getCurrentStep();
  const input = state.input;

  return (
    <div className="app-container">
      {/* 顶部栏 */}
      <header className="header">
        <a href="https://leetcode.cn/problems/longest-palindromic-substring/" target="_blank" rel="noopener noreferrer" className="title-link">
          <span className="leetcode-badge">5.</span>
          最长回文子串
          <span className="link-icon">↗</span>
        </a>
        <div className="header-controls">
          <a href="https://github.com/user/palindrome-visualizer" target="_blank" rel="noopener noreferrer" className="github-link" title="View on GitHub">
            <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
          <div className="input-group">
            <label className="input-label">测试字符串</label>
            <div className="input-row">
              <input
                type="text"
                className="input-field"
                value={state.input}
                onChange={(e) => handleInputSubmit(e.target.value)}
                placeholder="输入要查找回文的字符串..."
              />
              <div className="input-actions">
                <select 
                  className="sample-select"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) handleInputSubmit(e.target.value);
                  }}
                >
                  <option value="">样例</option>
                  <option value="babad">babad</option>
                  <option value="cbbd">cbbd</option>
                  <option value="racecar">racecar</option>
                  <option value="aacabdkacaa">aacabdkacaa</option>
                  <option value="abcba">abcba</option>
                  <option value="noon">noon</option>
                  <option value="level">level</option>
                </select>
                <button 
                  className="random-btn"
                  onClick={() => {
                    const chars = 'abcdefghij';
                    const len = Math.floor(Math.random() * 6) + 4; // 4-9 长度
                    let str = '';
                    for (let i = 0; i < len; i++) {
                      str += chars[Math.floor(Math.random() * chars.length)];
                    }
                    handleInputSubmit(str);
                  }}
                  title="随机生成字符串"
                >
                  🎲
                </button>
              </div>
            </div>
          </div>
          <div className="algo-buttons">
            <button
              className={`algo-btn ${state.algorithm === 'dp' ? 'active' : ''}`}
              onClick={() => handleAlgorithmChange('dp')}
            >
              动态规划
            </button>
            <button
              className={`algo-btn ${state.algorithm === 'center-expansion' ? 'active' : ''}`}
              onClick={() => handleAlgorithmChange('center-expansion')}
            >
              中心扩散
            </button>
          </div>
        </div>
      </header>


      {/* 主内容区 - 三栏布局 */}
      <main className="main-content three-column">
        {/* 左侧：代码调试面板 */}
        <div className="code-debug-area">
          <DebugCodePanel algorithm={state.algorithm} step={currentStep} input={input} />
        </div>

        {/* 中间：可视化区域 */}
        <div className="visualization-area">
          {currentStep?.type === 'dp' ? (
            <DPVisualization step={currentStep} input={input} />
          ) : currentStep?.type === 'center-expansion' ? (
            <CenterExpansionVisualization step={currentStep} input={input} />
          ) : (
            <div className="empty-state">
              <div className="empty-title">🎯 最长回文子串</div>
              <div className="empty-desc">输入字符串后点击播放，观看算法演示</div>
            </div>
          )}
        </div>

        {/* 右侧：步骤说明 */}
        <div className="step-panel">
          {currentStep ? (
            <>
              <div className="step-header">
                <span className="step-title">📝 当前步骤</span>
                <span className="step-count">{state.currentStepIndex + 1}/{state.steps.length}</span>
              </div>
              <StepExplanation step={currentStep} input={input} />
              <div className="result-box">
                <div className="result-label">🏆 当前最长回文</div>
                <div className="result-value">{currentStep.currentLongestPalindrome.text}</div>
                <div className="result-info">长度: {currentStep.currentLongestPalindrome.text.length}</div>
              </div>
            </>
          ) : (
            <div className="step-intro">
              <div className="intro-title">💡 什么是回文？</div>
              <div className="intro-text">
                回文是正着读和倒着读完全一样的字符串。
              </div>
              <div className="intro-examples">
                <div className="example good">✅ "aba" → 倒读 "aba"</div>
                <div className="example good">✅ "abba" → 倒读 "abba"</div>
                <div className="example bad">❌ "abc" → 倒读 "cba"</div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 全宽进度条 */}
      <div className="progress-bar-container">
        <input
          type="range"
          className="full-width-progress"
          min="0"
          max={Math.max(0, state.steps.length - 1)}
          value={state.currentStepIndex}
          onChange={(e) => goToStep(parseInt(e.target.value))}
          style={{
            '--progress': `${state.steps.length > 1 ? (state.currentStepIndex / (state.steps.length - 1)) * 100 : 0}%`
          } as React.CSSProperties}
        />
        <div className="progress-labels">
          <span>步骤 {state.currentStepIndex + 1}</span>
          <span>共 {state.steps.length} 步</span>
        </div>
      </div>

      {/* 底部控制栏 */}
      <footer className="controls">
        <button className="ctrl-btn" onClick={reset}>重置</button>
        <button className="ctrl-btn" onClick={prevStep} disabled={state.currentStepIndex <= 0}>上一步</button>
        {state.isPlaying ? (
          <button className="ctrl-btn primary" onClick={pause}>暂停</button>
        ) : (
          <button className="ctrl-btn primary" onClick={play} disabled={state.currentStepIndex >= state.steps.length - 1}>播放</button>
        )}
        <button className="ctrl-btn" onClick={nextStep} disabled={state.currentStepIndex >= state.steps.length - 1}>下一步</button>
        <div className="speed-control">
          <span>速度</span>
          <input type="range" min="0.5" max="3" step="0.5" value={state.playbackSpeed} onChange={(e) => setSpeed(parseFloat(e.target.value))} />
          <span>{state.playbackSpeed}x</span>
        </div>
      </footer>
    </div>
  );
}


// DP 可视化组件
function DPVisualization({ step, input }: { step: any; input: string }) {
  const n = input.length;
  const { row: curI, col: curJ } = step.currentCell;

  return (
    <div className="dp-viz">
      <div className="dp-formula">
        {curJ - curI + 1 === 1 && "单个字符一定是回文 → dp[i][i] = true"}
        {curJ - curI + 1 === 2 && `s[${curI}]="${input[curI]}" ${input[curI] === input[curJ] ? '=' : '≠'} s[${curJ}]="${input[curJ]}" → dp[${curI}][${curJ}] = ${input[curI] === input[curJ]}`}
        {curJ - curI + 1 >= 3 && `dp[${curI}][${curJ}] = s[${curI}]=s[${curJ}] && dp[${curI+1}][${curJ-1}]`}
      </div>
      
      {/* 字符串显示 */}
      <div className="string-display">
        {input.split('').map((char, idx) => (
          <div key={idx} className={`char-cell ${idx >= curI && idx <= curJ ? 'highlight' : ''} ${idx === curI || idx === curJ ? 'endpoint' : ''}`}>
            <span className="char-index">{idx}</span>
            <span className="char-value">{char}</span>
          </div>
        ))}
      </div>

      {/* DP 表格 */}
      <div className="dp-table-container">
        <div className="dp-table">
          <div className="dp-header-row">
            <div className="dp-corner">i\j</div>
            {input.split('').map((_, j) => (
              <div key={j} className="dp-header-cell">{j}</div>
            ))}
          </div>
          {Array.from({ length: n }, (_, rowIdx) => (
            <div key={rowIdx} className="dp-row">
              <div className="dp-row-header">{rowIdx}</div>
              {Array.from({ length: n }, (_, colIdx) => {
                const i = rowIdx;
                const j = colIdx;
                if (j < i) return <div key={j} className="dp-cell empty" />;
                const isCurrent = i === curI && j === curJ;
                const value = step.dpTable[i]?.[j];
                let cellClass = 'dp-cell';
                if (isCurrent) cellClass += ' current';
                else if (value === true) cellClass += ' true';
                else if (value === false) cellClass += ' false';
                return (
                  <div key={j} className={cellClass}>
                    {isCurrent ? '?' : value === true ? '✓' : value === false ? '✗' : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="dp-legend">
        <span className="legend-item"><span className="legend-box current"></span>检查中</span>
        <span className="legend-item"><span className="legend-box true"></span>是回文</span>
        <span className="legend-item"><span className="legend-box false"></span>不是回文</span>
      </div>
    </div>
  );
}


// 中心扩散可视化组件 - 分为外层循环和内层循环两个独立区域
function CenterExpansionVisualization({ step, input }: { step: any; input: string }) {
  const { leftPointer, rightPointer, expandState, centerType, centerIndex, detailedState } = step;
  const n = input.length;
  
  // 计算当前已确认的回文范围
  const confirmedLeft = expandState === 'matched' ? leftPointer : leftPointer + 1;
  const confirmedRight = expandState === 'matched' ? rightPointer : rightPointer - 1;
  const confirmedPalindrome = confirmedLeft <= confirmedRight ? input.slice(confirmedLeft, confirmedRight + 1) : input[centerIndex] || '';

  // 计算外层循环进度 - 哪些中心点已经处理完
  const currentCenterNum = centerType === 'single' ? centerIndex * 2 : centerIndex * 2 + 1;
  
  // 判断当前是否在内层循环中
  const isInInnerLoop = detailedState && ['comparing', 'matched', 'mismatched', 'prepare-expand', 'move-pointers', 'boundary'].includes(detailedState);

  return (
    <div className="center-viz-split">
      {/* ========== 区域1: 外层 for 循环 ========== */}
      <div className="outer-loop-panel">
        <div className="panel-header">
          <span className="panel-icon">🔄</span>
          <span className="panel-title">外层循环: for (i = 0; i &lt; n; i++)</span>
        </div>
        
        <div className="outer-loop-content">
          {/* 原始字符串展示 */}
          <div className="original-string">
            <div className="string-label">原始字符串 s:</div>
            <div className="string-chars">
              {input.split('').map((char, idx) => (
                <div key={idx} className="string-char-box">
                  <span className="char-idx">{idx}</span>
                  <span className="char-val">{char}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 中心点遍历进度 */}
          <div className="centers-progress">
            <div className="centers-section">
              <div className="section-header">
                <span className="func-call">expand(s, i, i)</span>
                <span className="func-desc">单字符中心</span>
              </div>
              <div className="centers-grid">
                {Array.from({ length: n }, (_, i) => {
                  const singleIdx = i * 2;
                  const isCurrent = centerType === 'single' && centerIndex === i;
                  const isDone = singleIdx < currentCenterNum;
                  return (
                    <div 
                      key={i} 
                      className={`center-box ${isCurrent ? 'active' : isDone ? 'done' : 'pending'}`}
                    >
                      <span className="center-idx">i={i}</span>
                      <span className="center-char">"{input[i]}"</span>
                      {isCurrent && <span className="current-marker">◀</span>}
                      {isDone && <span className="done-marker">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="centers-section">
              <div className="section-header">
                <span className="func-call">expand(s, i, i+1)</span>
                <span className="func-desc">双字符中心</span>
              </div>
              <div className="centers-grid">
                {Array.from({ length: n - 1 }, (_, i) => {
                  const doubleIdx = i * 2 + 1;
                  const isCurrent = centerType === 'double' && centerIndex === i;
                  const isDone = doubleIdx < currentCenterNum;
                  return (
                    <div 
                      key={i} 
                      className={`center-box double ${isCurrent ? 'active' : isDone ? 'done' : 'pending'}`}
                    >
                      <span className="center-idx">i={i}</span>
                      <span className="center-char">"{input[i]}{input[i+1]}"</span>
                      {isCurrent && <span className="current-marker">◀</span>}
                      {isDone && <span className="done-marker">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 当前外层循环状态 */}
          <div className="outer-status">
            <span className="status-label">当前:</span>
            <span className="status-value">
              i = {centerIndex}, 调用 expand(s, {centerIndex}, {centerType === 'single' ? centerIndex : centerIndex + 1})
            </span>
          </div>
        </div>
      </div>

      {/* ========== 区域2: 内层 while 循环 ========== */}
      <div className={`inner-loop-panel ${isInInnerLoop ? 'active' : ''}`}>
        <div className="panel-header">
          <span className="panel-icon">↔️</span>
          <span className="panel-title">内层循环: while (left &gt;= 0 && right &lt; n && s[left] == s[right])</span>
        </div>

        <div className="inner-loop-content">
          {/* 扩展动画可视化 */}
          <div className="expansion-viz">
            <div className="expansion-string">
              {input.split('').map((char, idx) => {
                let cellClass = 'exp-char';
                
                // 中心点标记
                const isCenter = centerType === 'single' 
                  ? idx === centerIndex 
                  : (idx === centerIndex || idx === centerIndex + 1);
                if (isCenter) cellClass += ' is-center';
                
                // 已确认回文范围
                if (idx >= confirmedLeft && idx <= confirmedRight && confirmedLeft <= confirmedRight) {
                  cellClass += ' confirmed';
                }
                
                // 当前比较位置
                if (idx === leftPointer) cellClass += ' left-ptr';
                if (idx === rightPointer) cellClass += ' right-ptr';
                if (idx === leftPointer || idx === rightPointer) {
                  if (expandState === 'matched') cellClass += ' match';
                  else if (expandState === 'mismatched') cellClass += ' mismatch';
                }
                
                return (
                  <div key={idx} className={cellClass}>
                    <div className="exp-idx">{idx}</div>
                    <div className="exp-val">{char}</div>
                    <div className="exp-ptr">
                      {idx === leftPointer && idx === rightPointer && 'L=R'}
                      {idx === leftPointer && idx !== rightPointer && 'L'}
                      {idx === rightPointer && idx !== leftPointer && 'R'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 扩展箭头指示 */}
            <div className="expansion-arrows">
              <div className="arrow-left">← left--</div>
              <div className="arrow-center">中心</div>
              <div className="arrow-right">right++ →</div>
            </div>
          </div>

          {/* 比较详情 */}
          <div className="compare-detail">
            <div className="compare-item left-item">
              <div className="item-label">s[left={leftPointer}]</div>
              <div className="item-value">{input[leftPointer] ?? '?'}</div>
            </div>
            <div className={`compare-op ${input[leftPointer] === input[rightPointer] ? 'eq' : 'neq'}`}>
              {input[leftPointer] === input[rightPointer] ? '==' : '!='}
            </div>
            <div className="compare-item right-item">
              <div className="item-label">s[right={rightPointer}]</div>
              <div className="item-value">{input[rightPointer] ?? '?'}</div>
            </div>
            <div className={`compare-result ${expandState}`}>
              {expandState === 'matched' && '✅ 匹配，继续扩展'}
              {expandState === 'mismatched' && '❌ 不匹配，停止'}
              {expandState === 'boundary' && '🚧 到达边界'}
              {expandState === 'expanding' && '🔍 检查中...'}
            </div>
          </div>

          {/* 当前回文状态 */}
          <div className="palindrome-status">
            <div className="pal-item">
              <span className="pal-label">当前扩展范围:</span>
              <span className="pal-value">s[{leftPointer}..{rightPointer}] = "{input.slice(Math.max(0, leftPointer), Math.min(n, rightPointer + 1))}"</span>
            </div>
            <div className="pal-item highlight">
              <span className="pal-label">已确认回文:</span>
              <span className="pal-value">"{confirmedPalindrome}" (长度: {confirmedPalindrome.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="viz-legend">
        <span className="legend-item"><span className="legend-dot active"></span>当前处理</span>
        <span className="legend-item"><span className="legend-dot done"></span>已完成</span>
        <span className="legend-item"><span className="legend-dot center"></span>中心点</span>
        <span className="legend-item"><span className="legend-dot confirmed"></span>已确认回文</span>
        <span className="legend-item"><span className="legend-dot comparing"></span>正在比较</span>
      </div>
    </div>
  );
}


// 步骤说明组件
function StepExplanation({ step, input }: { step: any; input: string }) {
  if (step.type === 'dp') {
    const { row: i, col: j } = step.currentCell;
    const len = j - i + 1;
    const substring = input.slice(i, j + 1);
    const isPalindrome = step.cellState === 'palindrome';

    return (
      <div className={`explanation ${isPalindrome ? 'success' : 'fail'}`}>
        <div className="exp-substring">
          检查: <code>{substring}</code> (位置 {i} 到 {j})
        </div>
        <div className="exp-detail">
          {len === 1 && `单个字符 "${substring}" 一定是回文`}
          {len === 2 && (isPalindrome ? `"${input[i]}" = "${input[j]}"，是回文` : `"${input[i]}" ≠ "${input[j]}"，不是回文`)}
          {len >= 3 && (
            isPalindrome 
              ? `首尾相同 "${input[i]}"="${input[j]}"，且中间是回文`
              : input[i] !== input[j] 
                ? `首尾不同 "${input[i]}"≠"${input[j]}"`
                : `首尾相同但中间不是回文`
          )}
        </div>
        <div className="exp-result">
          dp[{i}][{j}] = <strong>{isPalindrome ? 'TRUE ✓' : 'FALSE ✗'}</strong>
        </div>
      </div>
    );
  }

  // 中心扩散
  const { leftPointer, rightPointer, expandState, detailedState, description } = step;

  // 根据详细状态确定样式
  const getStateClass = () => {
    if (detailedState === 'matched' || detailedState === 'update-longest') return 'success';
    if (detailedState === 'mismatched') return 'fail';
    return 'neutral';
  };

  return (
    <div className={`explanation ${getStateClass()}`}>
      <div className="exp-substring">
        {description}
      </div>
      <div className="exp-detail">
        {detailedState === 'init' && '🚀 算法初始化'}
        {detailedState === 'select-center' && '📍 选择新的中心点'}
        {detailedState === 'init-pointers' && '🎯 初始化左右指针'}
        {detailedState === 'comparing' && '🔍 正在比较字符'}
        {detailedState === 'matched' && '✅ 字符匹配，回文扩展'}
        {detailedState === 'mismatched' && '❌ 字符不匹配，停止扩展'}
        {detailedState === 'prepare-expand' && '➡️ 准备向两边扩展'}
        {detailedState === 'move-pointers' && '🔄 移动指针'}
        {detailedState === 'boundary' && '🚧 到达边界'}
        {detailedState === 'update-longest' && '🏆 发现更长回文！'}
        {detailedState === 'center-complete' && '✔️ 当前中心扩展完成'}
        {detailedState === 'complete' && '🎉 算法执行完成'}
        {!detailedState && expandState === 'expanding' && '正在检查...'}
      </div>
      <div className="exp-result">
        当前回文: <strong>{input.slice(Math.max(0, leftPointer), Math.min(input.length, rightPointer + 1))}</strong>
      </div>
    </div>
  );
}

export default App;
