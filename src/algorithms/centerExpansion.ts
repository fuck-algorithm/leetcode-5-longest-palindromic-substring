import { CenterExpansionStep } from '../types';

export class CenterExpansionExecutor {
  execute(input: string): CenterExpansionStep[] {
    const n = input.length;
    if (n === 0) return [];

    const steps: CenterExpansionStep[] = [];
    let longestStart = 0;
    let longestEnd = 0;

    // 步骤1：算法开始，初始化
    steps.push(this.createStep(
      input, -1, 'single', -1, -1,
      'init', longestStart, longestEnd,
      `算法开始：字符串 "${input}" 长度为 ${n}，将遍历所有可能的中心点`,
      0, n - 1
    ));

    // 遍历所有可能的中心
    for (let center = 0; center < n; center++) {
      // 单字符中心 expand(s, i, i)
      this.expandFromCenter(
        input, center, center, 'single', steps,
        longestStart, longestEnd, (s, e) => { longestStart = s; longestEnd = e; }
      );

      // 双字符中心 expand(s, i, i+1)
      if (center < n - 1) {
        this.expandFromCenter(
          input, center, center + 1, 'double', steps,
          longestStart, longestEnd, (s, e) => { longestStart = s; longestEnd = e; }
        );
      }
    }

    // 最终步骤：算法结束
    steps.push(this.createStep(
      input, -1, 'single', longestStart, longestEnd,
      'complete', longestStart, longestEnd,
      `算法结束！最长回文子串是 "${input.slice(longestStart, longestEnd + 1)}"，长度为 ${longestEnd - longestStart + 1}`,
      longestStart, longestEnd
    ));

    // 更新所有步骤的 totalSteps 和 stepNumber
    const totalSteps = steps.length;
    steps.forEach((step, idx) => {
      step.stepNumber = idx + 1;
      step.totalSteps = totalSteps;
    });

    return steps;
  }

  private expandFromCenter(
    input: string,
    initLeft: number,
    initRight: number,
    centerType: 'single' | 'double',
    steps: CenterExpansionStep[],
    longestStart: number,
    longestEnd: number,
    updateLongest: (start: number, end: number) => void
  ): void {
    const n = input.length;
    const centerIndex = initLeft;
    
    let left = initLeft;
    let right = initRight;

    // 步骤：开始处理新的中心点
    steps.push(this.createStep(
      input, centerIndex, centerType, left, right,
      'select-center', longestStart, longestEnd,
      centerType === 'single'
        ? `选择中心点 i=${centerIndex}，调用 expand(s, ${left}, ${right})，以 "${input[left]}" 为中心`
        : `选择中心点 i=${centerIndex}，调用 expand(s, ${left}, ${right})，以 "${input[left]}${input[right]}" 为中心`,
      left, right
    ));

    // 步骤：初始化左右指针
    steps.push(this.createStep(
      input, centerIndex, centerType, left, right,
      'init-pointers', longestStart, longestEnd,
      `初始化指针：left=${left}, right=${right}`,
      left, right
    ));

    // 步骤：检查初始中心是否匹配
    const initialMatched = input[left] === input[right];
    
    steps.push(this.createStep(
      input, centerIndex, centerType, left, right,
      'comparing', longestStart, longestEnd,
      `比较 s[${left}]="${input[left]}" 和 s[${right}]="${input[right]}"`,
      left, right
    ));

    if (!initialMatched) {
      // 双字符中心不匹配，直接结束
      steps.push(this.createStep(
        input, centerIndex, centerType, left, right,
        'mismatched', longestStart, longestEnd,
        `s[${left}]="${input[left]}" ≠ s[${right}]="${input[right]}"，不匹配，结束此中心的扩展`,
        left, right
      ));
      return;
    }

    // 初始中心匹配
    steps.push(this.createStep(
      input, centerIndex, centerType, left, right,
      'matched', longestStart, longestEnd,
      centerType === 'single'
        ? `s[${left}]="${input[left]}" 单字符，一定是回文`
        : `s[${left}]="${input[left]}" = s[${right}]="${input[right]}"，匹配！`,
      left, right
    ));

    // 检查是否需要更新最长回文
    const currentLen = right - left + 1;
    const longestLen = longestEnd - longestStart + 1;
    
    if (currentLen > longestLen) {
      // 更新最长回文
      steps.push(this.createStep(
        input, centerIndex, centerType, left, right,
        'update-longest', left, right,
        `发现更长回文 "${input.slice(left, right + 1)}"（长度 ${currentLen} > ${longestLen}），更新最长回文`,
        left, right
      ));
      longestStart = left;
      longestEnd = right;
      updateLongest(left, right);
    }

    // 向两边扩展
    let expandCount = 0;
    while (true) {
      const newLeft = left - 1;
      const newRight = right + 1;
      
      // 步骤：准备扩展
      steps.push(this.createStep(
        input, centerIndex, centerType, left, right,
        'prepare-expand', longestStart, longestEnd,
        `准备向两边扩展：left=${left}→${newLeft}, right=${right}→${newRight}`,
        left, right
      ));

      // 检查边界
      if (newLeft < 0) {
        steps.push(this.createStep(
          input, centerIndex, centerType, left, right,
          'boundary', longestStart, longestEnd,
          `left=${newLeft} < 0，到达左边界，停止扩展`,
          left, right
        ));
        break;
      }
      
      if (newRight >= n) {
        steps.push(this.createStep(
          input, centerIndex, centerType, left, right,
          'boundary', longestStart, longestEnd,
          `right=${newRight} >= ${n}，到达右边界，停止扩展`,
          left, right
        ));
        break;
      }

      // 更新指针
      left = newLeft;
      right = newRight;
      expandCount++;

      // 步骤：移动指针
      steps.push(this.createStep(
        input, centerIndex, centerType, left, right,
        'move-pointers', longestStart, longestEnd,
        `第 ${expandCount} 次扩展：移动指针到 left=${left}, right=${right}`,
        left, right
      ));

      // 步骤：比较字符
      steps.push(this.createStep(
        input, centerIndex, centerType, left, right,
        'comparing', longestStart, longestEnd,
        `比较 s[${left}]="${input[left]}" 和 s[${right}]="${input[right]}"`,
        left, right
      ));

      const matched = input[left] === input[right];

      if (matched) {
        steps.push(this.createStep(
          input, centerIndex, centerType, left, right,
          'matched', longestStart, longestEnd,
          `s[${left}]="${input[left]}" = s[${right}]="${input[right]}"，匹配！回文扩展为 "${input.slice(left, right + 1)}"`,
          left, right
        ));

        // 检查是否需要更新最长回文
        const newLen = right - left + 1;
        const currentLongestLen = longestEnd - longestStart + 1;
        
        if (newLen > currentLongestLen) {
          steps.push(this.createStep(
            input, centerIndex, centerType, left, right,
            'update-longest', left, right,
            `发现更长回文 "${input.slice(left, right + 1)}"（长度 ${newLen} > ${currentLongestLen}），更新最长回文`,
            left, right
          ));
          longestStart = left;
          longestEnd = right;
          updateLongest(left, right);
        }
      } else {
        steps.push(this.createStep(
          input, centerIndex, centerType, left, right,
          'mismatched', longestStart, longestEnd,
          `s[${left}]="${input[left]}" ≠ s[${right}]="${input[right]}"，不匹配，停止扩展`,
          left, right
        ));
        break;
      }
    }

    // 步骤：此中心扩展结束
    const finalLeft = Math.max(0, left);
    const finalRight = Math.min(n - 1, right);
    
    steps.push(this.createStep(
      input, centerIndex, centerType, finalLeft, finalRight,
      'center-complete', longestStart, longestEnd,
      `中心 ${centerIndex} (${centerType === 'single' ? '单字符' : '双字符'}) 扩展完成`,
      finalLeft, finalRight
    ));
  }

  private createStep(
    input: string,
    centerIndex: number,
    centerType: 'single' | 'double',
    left: number,
    right: number,
    state: 'init' | 'select-center' | 'init-pointers' | 'comparing' | 'matched' | 'mismatched' | 'prepare-expand' | 'move-pointers' | 'boundary' | 'update-longest' | 'center-complete' | 'complete',
    longestStart: number,
    longestEnd: number,
    description: string,
    highlightStart: number,
    highlightEnd: number
  ): CenterExpansionStep {
    const indices: number[] = [];
    for (let k = Math.max(0, highlightStart); k <= Math.min(input.length - 1, highlightEnd); k++) {
      indices.push(k);
    }

    // 映射新状态到原有类型系统
    let expandState: 'expanding' | 'matched' | 'mismatched' | 'boundary';
    switch (state) {
      case 'matched':
      case 'update-longest':
        expandState = 'matched';
        break;
      case 'mismatched':
        expandState = 'mismatched';
        break;
      case 'boundary':
        expandState = 'boundary';
        break;
      default:
        expandState = 'expanding';
    }

    return {
      type: 'center-expansion',
      stepNumber: 0, // 稍后更新
      totalSteps: 0, // 稍后更新
      description,
      highlightedIndices: indices,
      currentLongestPalindrome: {
        start: longestStart,
        end: longestEnd,
        text: input.slice(longestStart, longestEnd + 1),
      },
      centerIndex: Math.max(0, centerIndex),
      centerType,
      leftPointer: Math.max(0, left),
      rightPointer: Math.min(input.length - 1, right),
      expandState,
      detailedState: state, // 保存详细状态用于UI展示
    };
  }

  getAlgorithmName(): string {
    return '中心扩散';
  }

  getAlgorithmType(): 'center-expansion' {
    return 'center-expansion';
  }
}
