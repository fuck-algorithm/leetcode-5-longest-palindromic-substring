import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { CenterExpansionExecutor } from '../algorithms/centerExpansion';

const validInputArb = fc.stringOf(
  fc.oneof(
    fc.integer({ min: 48, max: 57 }).map(c => String.fromCharCode(c)),
    fc.integer({ min: 65, max: 90 }).map(c => String.fromCharCode(c)),
    fc.integer({ min: 97, max: 122 }).map(c => String.fromCharCode(c))
  ),
  { minLength: 1, maxLength: 20 }
);

describe('Center Expansion Algorithm', () => {
  const executor = new CenterExpansionExecutor();

  // **Feature: palindrome-visualizer, Property 13: 中心扩散指针有效性**
  // **Validates: Requirements 4.2, 4.3**
  it('Property 13: pointers are always within valid bounds', () => {
    fc.assert(
      fc.property(validInputArb, (input) => {
        const steps = executor.execute(input);
        const n = input.length;
        return steps.every(step => 
          step.leftPointer >= 0 && 
          step.rightPointer < n && 
          step.rightPointer >= step.leftPointer - 1
        );
      }),
      { numRuns: 100 }
    );
  });
});
