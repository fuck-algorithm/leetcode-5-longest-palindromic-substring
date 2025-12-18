import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { DPAlgorithmExecutor } from '../algorithms/dp';
import { DPAnimationStep } from '../types';

const validInputArb = fc.stringOf(
  fc.oneof(
    fc.integer({ min: 48, max: 57 }).map(c => String.fromCharCode(c)),
    fc.integer({ min: 65, max: 90 }).map(c => String.fromCharCode(c)),
    fc.integer({ min: 97, max: 122 }).map(c => String.fromCharCode(c))
  ),
  { minLength: 1, maxLength: 10 }
);

describe('Serialization', () => {
  const executor = new DPAlgorithmExecutor();

  // **Feature: palindrome-visualizer, Property 11: 步骤序列化往返一致性**
  // **Validates: Requirements 8.2, 8.3, 8.4**
  it('Property 11: JSON serialization round-trip preserves step data', () => {
    fc.assert(
      fc.property(validInputArb, (input) => {
        const steps = executor.execute(input);
        for (const step of steps) {
          const serialized = JSON.stringify(step);
          const deserialized = JSON.parse(serialized) as DPAnimationStep;
          
          if (deserialized.stepNumber !== step.stepNumber) return false;
          if (deserialized.totalSteps !== step.totalSteps) return false;
          if (deserialized.description !== step.description) return false;
          if (JSON.stringify(deserialized.highlightedIndices) !== JSON.stringify(step.highlightedIndices)) return false;
          if (deserialized.currentLongestPalindrome.text !== step.currentLongestPalindrome.text) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
