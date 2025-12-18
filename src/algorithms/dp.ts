import { DPAnimationStep } from '../types';

export class DPAlgorithmExecutor {
  execute(input: string): DPAnimationStep[] {
    const n = input.length;
    if (n === 0) return [];

    const steps: DPAnimationStep[] = [];
    // 用 null 表示"未计算"，true 表示"是回文"，false 表示"不是回文"
    const dp: (boolean | null)[][] = Array.from({ length: n }, () => Array(n).fill(null));
    let longestStart = 0;
    let longestEnd = 0;

    // 步骤1：算法开始
    steps.push(this.createStep(
      input, dp, -1, -1, 'checking', longestStart, longestEnd, [],
      `算法开始：创建 ${n}×${n} 的 DP 表格，dp[i][j] 表示 s[i..j] 是否为回文`
    ));

    // 步骤2：说明状态转移方程
    steps.push(this.createStep(
      input, dp, -1, -1, 'checking', longestStart, longestEnd, [],
      `状态转移方程：dp[i][j] = (s[i] == s[j]) && dp[i+1][j-1]`
    ));

    // 阶段1：初始化所有单字符（长度=1）
    steps.push(this.createStep(
      input, dp, -1, -1, 'checking', longestStart, longestEnd, [],
      `阶段1：初始化长度为1的子串（对角线），单字符一定是回文`
    ));

    for (let i = 0; i < n; i++) {
      // 步骤：选择单元格
      steps.push(this.createStep(
        input, dp, i, i, 'checking', longestStart, longestEnd, [i],
        `检查 dp[${i}][${i}]：子串 "${input[i]}" (位置 ${i})`
      ));

      // 步骤：设置值
      dp[i]![i] = true;
      steps.push(this.createStep(
        input, dp, i, i, 'palindrome', longestStart, longestEnd, [i],
        `dp[${i}][${i}] = true：单字符 "${input[i]}" 一定是回文`
      ));
    }

    // 阶段2：检查长度为2的子串
    if (n >= 2) {
      steps.push(this.createStep(
        input, dp, -1, -1, 'checking', longestStart, longestEnd, [],
        `阶段2：检查长度为2的子串，只需比较两个字符是否相同`
      ));

      for (let i = 0; i < n - 1; i++) {
        const j = i + 1;
        
        // 步骤：选择单元格
        steps.push(this.createStep(
          input, dp, i, j, 'checking', longestStart, longestEnd, [i, j],
          `检查 dp[${i}][${j}]：子串 "${input.slice(i, j + 1)}" (位置 ${i} 到 ${j})`
        ));

        // 步骤：比较字符
        steps.push(this.createStep(
          input, dp, i, j, 'checking', longestStart, longestEnd, [i, j],
          `比较 s[${i}]="${input[i]}" 和 s[${j}]="${input[j]}"`
        ));

        const isPalindrome = input[i] === input[j];
        dp[i]![j] = isPalindrome;

        if (isPalindrome) {
          steps.push(this.createStep(
            input, dp, i, j, 'palindrome', longestStart, longestEnd, [i, j],
            `s[${i}]="${input[i]}" = s[${j}]="${input[j]}"，匹配！dp[${i}][${j}] = true`
          ));

          if (1 > longestEnd - longestStart) {
            longestStart = i;
            longestEnd = j;
            steps.push(this.createStep(
              input, dp, i, j, 'palindrome', longestStart, longestEnd, [i, j],
              `发现更长回文 "${input.slice(i, j + 1)}"（长度 2），更新最长回文`
            ));
          }
        } else {
          steps.push(this.createStep(
            input, dp, i, j, 'not-palindrome', longestStart, longestEnd, [i, j],
            `s[${i}]="${input[i]}" ≠ s[${j}]="${input[j]}"，不匹配，dp[${i}][${j}] = false`
          ));
        }
      }
    }

    // 阶段3：检查长度>=3的子串
    if (n >= 3) {
      steps.push(this.createStep(
        input, dp, -1, -1, 'checking', longestStart, longestEnd, [],
        `阶段3：检查长度≥3的子串，需要首尾相同且内部是回文`
      ));

      for (let len = 3; len <= n; len++) {
        // 步骤：开始新长度
        steps.push(this.createStep(
          input, dp, -1, -1, 'checking', longestStart, longestEnd, [],
          `检查所有长度为 ${len} 的子串`
        ));

        for (let i = 0; i <= n - len; i++) {
          const j = i + len - 1;
          const indices: number[] = [];
          for (let k = i; k <= j; k++) indices.push(k);

          // 步骤：选择单元格
          steps.push(this.createStep(
            input, dp, i, j, 'checking', longestStart, longestEnd, indices,
            `检查 dp[${i}][${j}]：子串 "${input.slice(i, j + 1)}" (位置 ${i} 到 ${j})`
          ));

          // 步骤：检查首尾字符
          steps.push(this.createStep(
            input, dp, i, j, 'checking', longestStart, longestEnd, [i, j],
            `第一步：比较首尾字符 s[${i}]="${input[i]}" 和 s[${j}]="${input[j]}"`
          ));

          if (input[i] !== input[j]) {
            dp[i]![j] = false;
            steps.push(this.createStep(
              input, dp, i, j, 'not-palindrome', longestStart, longestEnd, indices,
              `s[${i}]="${input[i]}" ≠ s[${j}]="${input[j]}"，首尾不同，dp[${i}][${j}] = false`
            ));
            continue;
          }

          // 首尾相同，检查内部
          steps.push(this.createStep(
            input, dp, i, j, 'checking', longestStart, longestEnd, [i, j],
            `s[${i}]="${input[i]}" = s[${j}]="${input[j]}"，首尾相同！`
          ));

          // 步骤：查看内部子串
          const innerIndices: number[] = [];
          for (let k = i + 1; k <= j - 1; k++) innerIndices.push(k);
          
          steps.push(this.createStep(
            input, dp, i + 1, j - 1, 'checking', longestStart, longestEnd, innerIndices,
            `第二步：检查内部 dp[${i + 1}][${j - 1}]，即 "${input.slice(i + 1, j)}" 是否为回文`
          ));

          const innerIsPalindrome = dp[i + 1]![j - 1];
          
          steps.push(this.createStep(
            input, dp, i + 1, j - 1, innerIsPalindrome ? 'palindrome' : 'not-palindrome', 
            longestStart, longestEnd, innerIndices,
            `dp[${i + 1}][${j - 1}] = ${innerIsPalindrome}，内部${innerIsPalindrome ? '是' : '不是'}回文`
          ));

          const isPalindrome = innerIsPalindrome === true;
          dp[i]![j] = isPalindrome;

          if (isPalindrome) {
            steps.push(this.createStep(
              input, dp, i, j, 'palindrome', longestStart, longestEnd, indices,
              `首尾相同 + 内部是回文 → dp[${i}][${j}] = true`
            ));

            if (len - 1 > longestEnd - longestStart) {
              longestStart = i;
              longestEnd = j;
              steps.push(this.createStep(
                input, dp, i, j, 'palindrome', longestStart, longestEnd, indices,
                `发现更长回文 "${input.slice(i, j + 1)}"（长度 ${len}），更新最长回文`
              ));
            }
          } else {
            steps.push(this.createStep(
              input, dp, i, j, 'not-palindrome', longestStart, longestEnd, indices,
              `首尾相同但内部不是回文 → dp[${i}][${j}] = false`
            ));
          }
        }
      }
    }

    // 最终步骤：算法结束
    steps.push(this.createStep(
      input, dp, longestStart, longestEnd, 'palindrome', longestStart, longestEnd,
      Array.from({ length: longestEnd - longestStart + 1 }, (_, k) => longestStart + k),
      `算法结束！最长回文子串是 "${input.slice(longestStart, longestEnd + 1)}"，长度为 ${longestEnd - longestStart + 1}`
    ));

    // 更新所有步骤的 stepNumber 和 totalSteps
    const totalSteps = steps.length;
    for (let i = 0; i < steps.length; i++) {
      steps[i]!.stepNumber = i + 1;
      steps[i]!.totalSteps = totalSteps;
    }

    return steps;
  }

  private createStep(
    input: string,
    dp: (boolean | null)[][],
    row: number,
    col: number,
    cellState: 'checking' | 'palindrome' | 'not-palindrome',
    longestStart: number,
    longestEnd: number,
    highlightedIndices: number[],
    description: string
  ): DPAnimationStep {
    return {
      type: 'dp',
      stepNumber: 0, // 稍后更新
      totalSteps: 0, // 稍后更新
      description,
      highlightedIndices,
      currentLongestPalindrome: {
        start: longestStart,
        end: longestEnd,
        text: input.slice(longestStart, longestEnd + 1),
      },
      dpTable: dp.map(r => [...r]) as boolean[][],
      currentCell: { row: Math.max(0, row), col: Math.max(0, col) },
      cellState,
    };
  }

  getAlgorithmName(): string {
    return '动态规划';
  }

  getAlgorithmType(): 'dp' {
    return 'dp';
  }
}
