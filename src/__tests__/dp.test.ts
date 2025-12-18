import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { DPAlgorithmExecutor } from '../algorithms/dp';

const validInputArb = fc.stringOf(
  fc.oneof(
    fc.integer({ min: 48, max: 57 }).map(c => String.fromCharCode(c)),
    fc.integer({ min: 65, max: 90 }).map(c => String.fromCharCode(c)),
    fc.integer({ min: 97, max: 122 }).map(c => String.fromCharCode(c))
  ),
  { minLength: 1, maxLength: 20 }
);

describe('DP Algorithm', () => {
  const executor = new DPAlgorithmExecutor();

  // **Feature: palindrome-visualizer, Property 4: DP 表格尺寸正确性**
  // **Validates: Requirements 3.1**
  it('Property 4: DP table has correct dimensions', () => {
    fc.assert(
      fc.property(validInputArb, (input) => {
        const steps = executor.execute(input);
        const n = input.length;
        return steps.every(step => 
          step.dpTable.length === n && step.dpTable.every(row => row.length === n)
        );
      }),
      { numRuns: 100 }
    );
  });

  // **Feature: palindrome-visualizer, Property 14: DP 单元格状态一致性**
  // **Validates: Requirements 3.3**
  it('Property 14: DP cells marked as palindrome are actual palindromes', () => {
    fc.assert(
      fc.property(validInputArb, (input) => {
        const steps = executor.execute(input);
        const lastStep = steps[steps.length - 1];
        if (!lastStep) return true;
        
        for (let i = 0; i < input.length; i++) {
          for (let j = i; j < input.length; j++) {
            const isPalindromeInTable = lastStep.dpTable[i]?.[j] ?? false;
            const substring = input.slice(i, j + 1);
            const isActualPalindrome = substring === substring.split('').reverse().join('');
            if (isPalindromeInTable !== isActualPalindrome) return false;
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
