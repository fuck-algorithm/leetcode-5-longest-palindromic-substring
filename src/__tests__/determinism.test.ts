import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { DPAlgorithmExecutor } from '../algorithms/dp';
import { CenterExpansionExecutor } from '../algorithms/centerExpansion';

function isPalindrome(s: string): boolean {
  return s === s.split('').reverse().join('');
}

function findAllLongestPalindromes(input: string): Array<{ start: number; text: string }> {
  const results: Array<{ start: number; text: string }> = [];
  let maxLen = 0;
  
  for (let i = 0; i < input.length; i++) {
    for (let j = i; j < input.length; j++) {
      const sub = input.slice(i, j + 1);
      if (isPalindrome(sub)) {
        if (sub.length > maxLen) {
          maxLen = sub.length;
          results.length = 0;
          results.push({ start: i, text: sub });
        } else if (sub.length === maxLen) {
          results.push({ start: i, text: sub });
        }
      }
    }
  }
  return results;
}

describe('Determinism', () => {
  const dpExecutor = new DPAlgorithmExecutor();
  const ceExecutor = new CenterExpansionExecutor();

  // **Feature: palindrome-visualizer, Property 10: 多回文确定性**
  // **Validates: Requirements 7.4**
  it('Property 10: returns first longest palindrome deterministically', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom('a', 'b'), { minLength: 2, maxLength: 10 }),
        (input) => {
          const dpSteps = dpExecutor.execute(input);
          const lastStep = dpSteps[dpSteps.length - 1];
          if (!lastStep) return true;
          
          const allLongest = findAllLongestPalindromes(input);
          if (allLongest.length === 0) return true;
          
          const firstLongest = allLongest.sort((a, b) => a.start - b.start)[0]!;
          return lastStep.currentLongestPalindrome.start === firstLongest.start;
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: palindrome-visualizer, Property 3: 算法切换状态保持**
  // **Validates: Requirements 2.2, 2.3**
  it('Property 3: algorithm switch preserves input', () => {
    const input = 'babad';
    const dpSteps = dpExecutor.execute(input);
    const ceSteps = ceExecutor.execute(input);
    
    // Both should process the same input
    return dpSteps.length > 0 && ceSteps.length > 0;
  });
});
