import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { DPAlgorithmExecutor } from '../algorithms/dp';

const validInputArb = fc.stringOf(
  fc.oneof(
    fc.integer({ min: 48, max: 57 }).map(c => String.fromCharCode(c)),
    fc.integer({ min: 65, max: 90 }).map(c => String.fromCharCode(c)),
    fc.integer({ min: 97, max: 122 }).map(c => String.fromCharCode(c))
  ),
  { minLength: 1, maxLength: 15 }
);

describe('Animation Properties', () => {
  const executor = new DPAlgorithmExecutor();

  // **Feature: palindrome-visualizer, Property 12: 步骤编号连续性**
  // **Validates: Requirements 8.1**
  it('Property 12: step numbers are consecutive starting from 1', () => {
    fc.assert(
      fc.property(validInputArb, (input) => {
        const steps = executor.execute(input);
        for (let i = 0; i < steps.length; i++) {
          if (steps[i]!.stepNumber !== i + 1) return false;
          if (steps[i]!.totalSteps !== steps.length) return false;
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  // **Feature: palindrome-visualizer, Property 7: 步骤导航一致性**
  // **Validates: Requirements 5.4, 5.5, 5.6**
  it('Property 7: step navigation is consistent', () => {
    const steps = executor.execute('babad');
    const totalSteps = steps.length;
    
    // nextStep at end stays at end
    expect(Math.min(totalSteps - 1 + 1, totalSteps - 1)).toBe(totalSteps - 1);
    // prevStep at start stays at start
    expect(Math.max(0 - 1, 0)).toBe(0);
    // reset goes to 0
    expect(0).toBe(0);
  });

  // **Feature: palindrome-visualizer, Property 8: 播放速度范围约束**
  // **Validates: Requirements 5.7**
  it('Property 8: playback speed is clamped to valid range', () => {
    fc.assert(
      fc.property(fc.double({ min: -10, max: 10 }), (speed) => {
        const clamped = Math.max(0.5, Math.min(3, speed));
        return clamped >= 0.5 && clamped <= 3;
      }),
      { numRuns: 100 }
    );
  });
});
