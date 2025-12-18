import * as d3 from 'd3';
import { DPAnimationStep, CenterExpansionStep } from '../types';

export class D3Renderer {
  private svg: d3.Selection<SVGElement, unknown, null, undefined> | null = null;
  private width = 0;
  private height = 0;

  initialize(container: SVGElement, width: number, height: number): void {
    this.svg = d3.select(container);
    this.width = width;
    this.height = height;
    this.clear();
  }

  clear(): void {
    if (this.svg) {
      this.svg.selectAll('*').remove();
    }
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  renderStringDisplay(input: string, highlights: number[]): void {
    if (!this.svg) return;
    const g = this.svg.append('g').attr('class', 'string-display');
    const cellSize = Math.min(30, this.width / (input.length + 2));
    const startX = (this.width - input.length * cellSize) / 2;

    const highlightSet = new Set(highlights);

    for (let i = 0; i < input.length; i++) {
      const x = startX + i * cellSize;
      g.append('rect')
        .attr('x', x)
        .attr('y', 10)
        .attr('width', cellSize - 2)
        .attr('height', cellSize - 2)
        .attr('fill', highlightSet.has(i) ? '#4ade80' : '#f3f4f6')
        .attr('stroke', '#d1d5db')
        .attr('rx', 4);

      g.append('text')
        .attr('x', x + cellSize / 2 - 1)
        .attr('y', 10 + cellSize / 2 + 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', '#1f2937')
        .text(input[i] ?? '');
    }
  }

  renderDPTable(step: DPAnimationStep, input: string): void {
    if (!this.svg) return;
    this.clear();

    const n = input.length;
    // 更大的格子
    const maxCellSize = 50;
    const cellSize = Math.min(maxCellSize, (this.height - 150) / (n + 2), (this.width - 200) / (n + 2));
    const labelOffset = 35;
    const startX = (this.width - n * cellSize) / 2;
    const startY = 80;

    const g = this.svg.append('g').attr('class', 'dp-table');

    // 表格标题说明
    g.append('text').attr('x', this.width / 2).attr('y', 20)
      .attr('text-anchor', 'middle').attr('font-size', '13px').attr('fill', '#374151')
      .text('dp[i][j] = s[i..j] 是否为回文？');

    // 列标签 (j - 结束位置)
    g.append('text').attr('x', startX + n * cellSize / 2).attr('y', startY - labelOffset + 5)
      .attr('text-anchor', 'middle').attr('font-size', '11px').attr('fill', '#6b7280')
      .text('j (结束位置)');
    for (let j = 0; j < n; j++) {
      const x = startX + j * cellSize;
      g.append('text').attr('x', x + cellSize / 2).attr('y', startY - 8)
        .attr('text-anchor', 'middle').attr('font-size', '11px').attr('fill', '#374151')
        .text(`${j}:${input[j]}`);
    }

    // 行标签 (i - 起始位置)
    g.append('text').attr('x', startX - labelOffset - 5).attr('y', startY + n * cellSize / 2)
      .attr('text-anchor', 'middle').attr('font-size', '11px').attr('fill', '#6b7280')
      .attr('transform', `rotate(-90, ${startX - labelOffset - 5}, ${startY + n * cellSize / 2})`)
      .text('i (起始位置)');
    for (let i = 0; i < n; i++) {
      const y = startY + i * cellSize;
      g.append('text').attr('x', startX - 8).attr('y', y + cellSize / 2 + 4)
        .attr('text-anchor', 'end').attr('font-size', '11px').attr('fill', '#374151')
        .text(`${i}:${input[i]}`);
    }

    const { row: curI, col: curJ } = step.currentCell;
    const curLen = curJ - curI + 1;
    const curX = startX + curJ * cellSize;
    const curY = startY + curI * cellSize;

    // 在右侧显示当前检查的子串
    const rightPanelX = startX + n * cellSize + 30;
    const substring = input.slice(curI, curJ + 1);
    
    g.append('text').attr('x', rightPanelX).attr('y', startY)
      .attr('font-size', '14px').attr('fill', '#1e40af').attr('font-weight', 'bold')
      .text('当前检查:');
    
    // 显示子串，首尾字符用箭头标注
    const charBoxSize = 30;
    for (let k = 0; k < substring.length; k++) {
      const cx = rightPanelX + k * charBoxSize;
      const cy = startY + 15;
      const isFirst = k === 0;
      const isLast = k === substring.length - 1;
      
      g.append('rect').attr('x', cx).attr('y', cy).attr('width', charBoxSize - 2).attr('height', charBoxSize - 2)
        .attr('fill', (isFirst || isLast) ? '#dbeafe' : '#f1f5f9')
        .attr('stroke', (isFirst || isLast) ? '#3b82f6' : '#e2e8f0')
        .attr('stroke-width', (isFirst || isLast) ? 2 : 1)
        .attr('rx', 4);
      
      g.append('text').attr('x', cx + charBoxSize / 2 - 1).attr('y', cy + charBoxSize / 2 + 5)
        .attr('text-anchor', 'middle').attr('font-size', '16px').attr('fill', '#1f2937')
        .text(substring[k] ?? '');
      
      // 首尾箭头标注
      if (isFirst && substring.length > 1) {
        g.append('text').attr('x', cx + charBoxSize / 2 - 1).attr('y', cy - 5)
          .attr('text-anchor', 'middle').attr('font-size', '10px').attr('fill', '#3b82f6')
          .text('s[i]');
        g.append('path')
          .attr('d', `M ${cx + charBoxSize / 2} ${cy + charBoxSize + 5} L ${cx + charBoxSize / 2} ${cy + charBoxSize + 15}`)
          .attr('stroke', '#3b82f6').attr('stroke-width', 2).attr('marker-end', 'url(#arrowBlue)');
      }
      if (isLast && substring.length > 1) {
        g.append('text').attr('x', cx + charBoxSize / 2 - 1).attr('y', cy - 5)
          .attr('text-anchor', 'middle').attr('font-size', '10px').attr('fill', '#3b82f6')
          .text('s[j]');
      }
    }

    // 比较结果
    const compareY = startY + 60;
    if (curLen >= 2) {
      const firstChar = input[curI];
      const lastChar = input[curJ];
      const isMatch = firstChar === lastChar;
      
      g.append('text').attr('x', rightPanelX).attr('y', compareY)
        .attr('font-size', '13px').attr('fill', '#374151')
        .text(`首尾比较: "${firstChar}" ${isMatch ? '=' : '≠'} "${lastChar}"`);
      
      g.append('text').attr('x', rightPanelX).attr('y', compareY + 20)
        .attr('font-size', '16px').attr('fill', isMatch ? '#16a34a' : '#dc2626').attr('font-weight', 'bold')
        .text(isMatch ? '✓ 相同' : '✗ 不同');
    }

    // 状态转移箭头（长度>=3时）
    if (curLen >= 3 && curI + 1 < n && curJ - 1 >= 0) {
      const depI = curI + 1;
      const depJ = curJ - 1;
      const depX = startX + depJ * cellSize + cellSize / 2;
      const depY = startY + depI * cellSize + cellSize / 2;
      const toX = curX + cellSize / 2;
      const toY = curY + cellSize / 2;
      
      // 定义箭头标记
      const defs = this.svg.append('defs');
      defs.append('marker').attr('id', 'arrowPurple').attr('viewBox', '0 0 10 10')
        .attr('refX', 5).attr('refY', 5).attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('orient', 'auto-start-reverse')
        .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', '#8b5cf6');
      
      // 绘制粗箭头
      g.append('line')
        .attr('x1', depX).attr('y1', depY)
        .attr('x2', toX - 15).attr('y2', toY + 15)
        .attr('stroke', '#8b5cf6').attr('stroke-width', 3)
        .attr('marker-end', 'url(#arrowPurple)');
      
      // 箭头标签
      const midX = (depX + toX) / 2 - 20;
      const midY = (depY + toY) / 2;
      g.append('text').attr('x', midX).attr('y', midY)
        .attr('font-size', '11px').attr('fill', '#8b5cf6').attr('font-weight', 'bold')
        .text('依赖');
      
      // 高亮依赖格子
      g.append('rect')
        .attr('x', startX + depJ * cellSize - 3)
        .attr('y', startY + depI * cellSize - 3)
        .attr('width', cellSize + 4).attr('height', cellSize + 4)
        .attr('fill', 'none').attr('stroke', '#8b5cf6').attr('stroke-width', 3).attr('rx', 6);
      
      // 显示依赖说明
      const depValue = step.dpTable[depI]?.[depJ];
      g.append('text').attr('x', rightPanelX).attr('y', compareY + 50)
        .attr('font-size', '13px').attr('fill', '#8b5cf6')
        .text(`中间 dp[${depI}][${depJ}] = ${depValue ? '✓ 是回文' : '✗ 不是回文'}`);
    }

    // 绘制表格
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (j < i) continue;
        const x = startX + j * cellSize;
        const y = startY + i * cellSize;
        const isCurrent = curI === i && curJ === j;
        const isDependency = curLen >= 3 && i === curI + 1 && j === curJ - 1;
        const value = step.dpTable[i]?.[j];

        let fill = '#ffffff';
        let textColor = '#9ca3af';
        let cellText = '';
        
        if (value === true) {
          fill = '#86efac';
          textColor = '#166534';
          cellText = '✓';
        } else if (value === false) {
          fill = '#fca5a5';
          textColor = '#991b1b';
          cellText = '✗';
        }
        
        if (isCurrent) {
          fill = '#fde047';
          textColor = '#1f2937';
          cellText = '?';
        }

        g.append('rect').attr('x', x).attr('y', y).attr('width', cellSize - 2).attr('height', cellSize - 2)
          .attr('fill', fill)
          .attr('stroke', isCurrent ? '#1f2937' : isDependency ? '#6366f1' : '#e5e7eb')
          .attr('stroke-width', isCurrent || isDependency ? 2 : 1)
          .attr('rx', 3);
        
        if (cellText) {
          g.append('text').attr('x', x + cellSize / 2 - 1).attr('y', y + cellSize / 2 + 5)
            .attr('text-anchor', 'middle').attr('font-size', '14px').attr('fill', textColor).text(cellText);
        }
      }
    }

    // 顶部公式说明
    const formulaY = 25;
    if (curLen === 1) {
      g.append('text').attr('x', this.width / 2).attr('y', formulaY)
        .attr('text-anchor', 'middle').attr('font-size', '14px').attr('fill', '#1e40af')
        .text('单个字符一定是回文 → dp[i][i] = true');
    } else if (curLen === 2) {
      g.append('text').attr('x', this.width / 2).attr('y', formulaY)
        .attr('text-anchor', 'middle').attr('font-size', '14px').attr('fill', '#1e40af')
        .text(`两个字符: s[${curI}]="${input[curI]}" == s[${curJ}]="${input[curJ]}" ? → dp[${curI}][${curJ}] = ${input[curI] === input[curJ]}`);
    } else {
      g.append('text').attr('x', this.width / 2).attr('y', formulaY)
        .attr('text-anchor', 'middle').attr('font-size', '14px').attr('fill', '#8b5cf6')
        .text(`dp[${curI}][${curJ}] = (s[${curI}]=="${input[curI]}" == s[${curJ}]=="${input[curJ]}") && dp[${curI + 1}][${curJ - 1}]`);
    }
    
    // 副标题
    g.append('text').attr('x', this.width / 2).attr('y', formulaY + 20)
      .attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', '#6b7280')
      .text(`检查子串 s[${curI}..${curJ}] = "${input.slice(curI, curJ + 1)}" 是否为回文`);
    
    // 图例
    const legendY = startY + n * cellSize + 15;
    const legendItems = [
      { color: '#fde047', text: '→ 正在检查', border: '#1f2937' },
      { color: '#86efac', text: '✓ 是回文', border: '#e5e7eb' },
      { color: '#fca5a5', text: '✗ 不是回文', border: '#e5e7eb' },
      { color: '#ffffff', text: '未计算', border: '#e5e7eb' },
    ];
    
    const legendG = this.svg.append('g').attr('class', 'legend');
    const legendStartX = startX;
    legendItems.forEach((item, idx) => {
      const lx = legendStartX + idx * 95;
      legendG.append('rect').attr('x', lx).attr('y', legendY).attr('width', 14).attr('height', 14)
        .attr('fill', item.color).attr('stroke', item.border).attr('rx', 2);
      legendG.append('text').attr('x', lx + 18).attr('y', legendY + 11)
        .attr('font-size', '10px').attr('fill', '#6b7280').text(item.text);
    });
  }

  renderCenterExpansion(step: CenterExpansionStep, input: string): void {
    if (!this.svg) return;
    this.clear();

    const n = input.length;
    const cellSize = Math.min(40, (this.width - 40) / n);
    const startX = (this.width - n * cellSize) / 2;
    const startY = 180;

    const g = this.svg.append('g').attr('class', 'center-expansion');
    const highlightSet = new Set(step.highlightedIndices);

    // ========== 外层循环可视化：中心点进度 ==========
    const outerLoopY = 15;
    const centerCellSize = 24;
    void (n * 2 - 1); // totalCenters: 单字符中心 n 个 + 双字符中心 n-1 个
    const currentCenterNum = step.centerType === 'single' 
      ? step.centerIndex * 2 
      : step.centerIndex * 2 + 1;
    
    // 外层循环标题
    g.append('text').attr('x', 20).attr('y', outerLoopY + 12)
      .attr('font-size', '11px').attr('fill', '#0369a1').attr('font-weight', 'bold')
      .text('外层 for(i=0; i<n; i++):');
    
    // 绘制所有中心点（小格子表示进度）
    const centerStartX = 160;
    for (let i = 0; i < n; i++) {
      // 单字符中心 (i, i)
      const singleX = centerStartX + i * (centerCellSize + 2);
      const singleIdx = i * 2;
      const isSingleCurrent = step.centerType === 'single' && step.centerIndex === i;
      const isSingleDone = singleIdx < currentCenterNum;
      
      g.append('rect')
        .attr('x', singleX).attr('y', outerLoopY)
        .attr('width', centerCellSize - 2).attr('height', centerCellSize - 2)
        .attr('fill', isSingleCurrent ? '#fde047' : isSingleDone ? '#86efac' : '#f3f4f6')
        .attr('stroke', isSingleCurrent ? '#ca8a04' : isSingleDone ? '#22c55e' : '#d1d5db')
        .attr('stroke-width', isSingleCurrent ? 2 : 1)
        .attr('rx', 3);
      
      g.append('text')
        .attr('x', singleX + centerCellSize / 2 - 1).attr('y', outerLoopY + centerCellSize / 2 + 3)
        .attr('text-anchor', 'middle').attr('font-size', '10px')
        .attr('fill', isSingleCurrent ? '#92400e' : isSingleDone ? '#166534' : '#9ca3af')
        .text(input[i] ?? '');
    }
    
    // 单字符中心标签
    g.append('text').attr('x', centerStartX + n * (centerCellSize + 2) + 5).attr('y', outerLoopY + 14)
      .attr('font-size', '9px').attr('fill', '#6b7280')
      .text('单字符');

    // 双字符中心行
    const doubleY = outerLoopY + centerCellSize + 4;
    g.append('text').attr('x', 20).attr('y', doubleY + 12)
      .attr('font-size', '11px').attr('fill', '#0369a1').attr('font-weight', 'bold')
      .text('expand(i,i+1):');
    
    for (let i = 0; i < n - 1; i++) {
      const doubleX = centerStartX + i * (centerCellSize + 2) + (centerCellSize + 2) / 2;
      const doubleIdx = i * 2 + 1;
      const isDoubleCurrent = step.centerType === 'double' && step.centerIndex === i;
      const isDoubleDone = doubleIdx < currentCenterNum;
      
      g.append('rect')
        .attr('x', doubleX).attr('y', doubleY)
        .attr('width', centerCellSize - 2).attr('height', centerCellSize - 2)
        .attr('fill', isDoubleCurrent ? '#fde047' : isDoubleDone ? '#86efac' : '#f3f4f6')
        .attr('stroke', isDoubleCurrent ? '#ca8a04' : isDoubleDone ? '#22c55e' : '#d1d5db')
        .attr('stroke-width', isDoubleCurrent ? 2 : 1)
        .attr('rx', 3);
      
      // 显示双字符
      g.append('text')
        .attr('x', doubleX + centerCellSize / 2 - 1).attr('y', doubleY + centerCellSize / 2 + 3)
        .attr('text-anchor', 'middle').attr('font-size', '8px')
        .attr('fill', isDoubleCurrent ? '#92400e' : isDoubleDone ? '#166534' : '#9ca3af')
        .text(`${input[i]}${input[i + 1]}`);
    }
    
    // 双字符中心标签
    g.append('text').attr('x', centerStartX + n * (centerCellSize + 2) + 5).attr('y', doubleY + 14)
      .attr('font-size', '9px').attr('fill', '#6b7280')
      .text('双字符');

    // ========== 内层循环状态框 ==========
    const statusY = doubleY + centerCellSize + 15;
    const statusBoxWidth = 320;
    const statusBoxX = (this.width - statusBoxWidth) / 2;
    
    // 状态背景框
    g.append('rect')
      .attr('x', statusBoxX).attr('y', statusY)
      .attr('width', statusBoxWidth).attr('height', 45)
      .attr('fill', '#fef3c7').attr('stroke', '#fde68a').attr('rx', 6);
    
    // 当前中心信息
    g.append('text').attr('x', statusBoxX + 10).attr('y', statusY + 18)
      .attr('font-size', '12px').attr('fill', '#92400e').attr('font-weight', 'bold')
      .text(`当前中心: i=${step.centerIndex} (${step.centerType === 'single' ? '单字符' : '双字符'})`);
    
    // 内层循环：扩展状态
    g.append('text').attr('x', statusBoxX + 10).attr('y', statusY + 36)
      .attr('font-size', '11px').attr('fill', '#78350f')
      .text(`内层 while 扩展: left=${step.leftPointer}, right=${step.rightPointer}`);

    // 中心点指示器（在字符上方）
    const centerX = step.centerType === 'single' 
      ? startX + step.centerIndex * cellSize + cellSize / 2 - 1
      : startX + step.centerIndex * cellSize + cellSize - 1;
    
    g.append('text').attr('x', centerX).attr('y', startY - 25)
      .attr('text-anchor', 'middle').attr('font-size', '16px').attr('fill', '#8b5cf6')
      .text('▼');
    g.append('text').attr('x', centerX).attr('y', startY - 40)
      .attr('text-anchor', 'middle').attr('font-size', '10px').attr('fill', '#8b5cf6').attr('font-weight', 'bold')
      .text('中心');

    // 绘制字符格子
    for (let i = 0; i < n; i++) {
      const x = startX + i * cellSize;
      let fill = '#f3f4f6';
      let strokeColor = '#d1d5db';
      let strokeWidth = 1;
      
      // 当前比较的左右指针位置
      if (i === step.leftPointer || i === step.rightPointer) {
        fill = step.expandState === 'matched' ? '#bbf7d0' : step.expandState === 'mismatched' ? '#fecaca' : '#fef3c7';
        strokeColor = step.expandState === 'matched' ? '#22c55e' : step.expandState === 'mismatched' ? '#ef4444' : '#f59e0b';
        strokeWidth = 2;
      } else if (highlightSet.has(i)) {
        // 已确认的回文范围
        fill = '#dcfce7';
        strokeColor = '#86efac';
      }

      g.append('rect').attr('x', x).attr('y', startY).attr('width', cellSize - 2).attr('height', cellSize - 2)
        .attr('fill', fill).attr('stroke', strokeColor).attr('stroke-width', strokeWidth).attr('rx', 4);

      g.append('text').attr('x', x + cellSize / 2 - 1).attr('y', startY + cellSize / 2 + 5)
        .attr('text-anchor', 'middle').attr('font-size', '16px').attr('fill', '#1f2937').text(input[i] ?? '');

      g.append('text').attr('x', x + cellSize / 2 - 1).attr('y', startY - 8)
        .attr('text-anchor', 'middle').attr('font-size', '10px').attr('fill', '#9ca3af').text(String(i));
    }

    // 指针标记（在字符下方）
    const lx = startX + step.leftPointer * cellSize + cellSize / 2 - 1;
    const rx = startX + step.rightPointer * cellSize + cellSize / 2 - 1;
    
    g.append('text').attr('x', lx).attr('y', startY + cellSize + 15)
      .attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', '#2563eb').text('↑');
    g.append('text').attr('x', lx).attr('y', startY + cellSize + 28)
      .attr('text-anchor', 'middle').attr('font-size', '11px').attr('fill', '#2563eb').attr('font-weight', 'bold').text('L=' + step.leftPointer);
    
    g.append('text').attr('x', rx).attr('y', startY + cellSize + 15)
      .attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', '#dc2626').text('↑');
    g.append('text').attr('x', rx).attr('y', startY + cellSize + 28)
      .attr('text-anchor', 'middle').attr('font-size', '11px').attr('fill', '#dc2626').attr('font-weight', 'bold').text('R=' + step.rightPointer);

    // 比较结果（更小的显示）
    const compareY = startY + cellSize + 55;
    const leftChar = input[step.leftPointer] ?? '?';
    const rightChar = input[step.rightPointer] ?? '?';
    const isMatch = step.expandState === 'matched';
    const isMismatch = step.expandState === 'mismatched';
    
    // 小型比较框
    const compareBoxWidth = 160;
    const compareBoxX = (this.width - compareBoxWidth) / 2;
    
    g.append('rect')
      .attr('x', compareBoxX).attr('y', compareY)
      .attr('width', compareBoxWidth).attr('height', 36)
      .attr('fill', isMatch ? '#f0fdf4' : isMismatch ? '#fef2f2' : '#fffbeb')
      .attr('stroke', isMatch ? '#86efac' : isMismatch ? '#fca5a5' : '#fde68a')
      .attr('rx', 6);
    
    // 比较内容
    const compareText = `s[${step.leftPointer}]="${leftChar}" ${isMatch ? '=' : '≠'} s[${step.rightPointer}]="${rightChar}"`;
    g.append('text').attr('x', this.width / 2).attr('y', compareY + 15)
      .attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', '#374151')
      .text(compareText);
    
    const resultText = isMatch ? '✓ 匹配，继续扩展' : isMismatch ? '✗ 不匹配，停止' : '边界检查';
    g.append('text').attr('x', this.width / 2).attr('y', compareY + 30)
      .attr('text-anchor', 'middle').attr('font-size', '11px')
      .attr('fill', isMatch ? '#16a34a' : isMismatch ? '#dc2626' : '#d97706')
      .attr('font-weight', 'bold')
      .text(resultText);

    // 当前最长回文信息
    const infoY = compareY + 50;
    const palindrome = step.currentLongestPalindrome;
    g.append('text').attr('x', this.width / 2).attr('y', infoY)
      .attr('text-anchor', 'middle').attr('font-size', '11px').attr('fill', '#6b7280')
      .text(`当前最长回文: "${palindrome.text}" (长度: ${palindrome.text.length})`);

    // 图例
    const legendY = infoY + 25;
    const legendItems = [
      { color: '#dcfce7', border: '#86efac', text: '已确认回文' },
      { color: '#bbf7d0', border: '#22c55e', text: '匹配' },
      { color: '#fecaca', border: '#ef4444', text: '不匹配' },
    ];
    
    const legendStartX = (this.width - legendItems.length * 90) / 2;
    legendItems.forEach((item, idx) => {
      const lx = legendStartX + idx * 90;
      g.append('rect').attr('x', lx).attr('y', legendY).attr('width', 12).attr('height', 12)
        .attr('fill', item.color).attr('stroke', item.border).attr('rx', 2);
      g.append('text').attr('x', lx + 16).attr('y', legendY + 10)
        .attr('font-size', '10px').attr('fill', '#6b7280').text(item.text);
    });
  }
}
