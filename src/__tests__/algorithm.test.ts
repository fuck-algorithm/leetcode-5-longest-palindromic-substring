import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { DPAlgorithmExecutor } from '../algorithms/dp';
import { CenterExpansionExecutor } from '../algorithms/centerExpansion';

const validInputArb = fc.stringOf(
  fc.oneof(
    fc.integer({ min: 48, max: 57 }).map(c => String.fromCharCode(c)),
    fc.integer({ min: 65, max: 90 }).map(c => String.fromCharCode(c)),
    fc.integer({ min: 97, max: 122 }).map(c => String.fromCharCode(c))
  ),
  { minLength: 1, maxLength: 15 }
);

function isPalindrome(s: string): boolean {
  return s === s.split('').reverse().join('');
}

describe('Algorithm Common Properties', () => {
  const dpExecutor = new DPAlgorithmExecutor();
  const ceExecutor = new CenterExpansionExecutor();

  // **Feature: palindrome-visualizer, Property 5: 步骤描述完整性**
  // **Validates: Requirements 3.6, 4.7**
  it('Property 5: every step has non-empty description', () => {
    fc.assert(
      fc.property(validInputArb, (input) => {
        const dpSteps = dpExecutor.execute(input);
        const ceSteps = ceExecutor.execute(input);
        return dpSteps.every(s => s.description.length > 0) && ceSteps.every(s => s.description.length > 0);
      }),
      { numRuns: 100 }
    );
  });

  // **Feature: palindrome-visualizer, Property 6: 最长回文更新单调性**
  // **Validates: Requirements 3.5, 4.6**
  it('Property 6: longest palindrome length is monotonically non-decreasing', () => {
    fc.assert(
      fc.property(validInputArb, (input) => {
        const dpSteps = dpExecutor.execute(input);
        for (let i = 1; i < dpSteps.length; i++) {
          const prev = dpSteps[i - 1]!.currentLongestPalindrome.text.length;
          const curr = dpSteps[i]!.currentLongestPalindrome.text.length;
          if (curr < prev) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  // **Feature: palindrome-visualizer, Property 9: 最终结果正确性**
  // **Validates: Requirements 7.1, 7.3**
  it('Property 9: final result is a valid longest palindrome', () => {
    fc.assert(
      fc.property(validInputArb, (input) => {
        const steps = dpExecutor.execute(input);
        const lastStep = steps[steps.length - 1];
        if (!lastStep) return true;
        
        const result = lastStep.currentLongestPalindrome;
        if (!isPalindrome(result.text)) return false;
        if (!input.includes(result.text)) return false;
        
        // Check it's actually the longest
        for (let i = 0; i < input.length; i++) {
          for (let j = i; j < input.length; j++) {
            const sub = input.slice(i, j + 1);
            if (isPalindrome(sub) && sub.length > result.text.length) return false;
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
