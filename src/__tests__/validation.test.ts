import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateInput, truncateInput } from '../utils/validation';

describe('Input Validation', () => {
  // **Feature: palindrome-visualizer, Property 1: 输入验证一致性**
  // **Validates: Requirements 1.1, 1.3**
  it('Property 1: validates alphanumeric strings correctly', () => {
    fc.assert(
      fc.property(
        fc.stringOf(
          fc.oneof(
            fc.integer({ min: 48, max: 57 }).map(c => String.fromCharCode(c)),
            fc.integer({ min: 65, max: 90 }).map(c => String.fromCharCode(c)),
            fc.integer({ min: 97, max: 122 }).map(c => String.fromCharCode(c))
          ),
          { minLength: 1, maxLength: 50 }
        ),
        (input) => {
          const result = validateInput(input);
          return result.isValid === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 1: rejects empty strings', () => {
    const result = validateInput('');
    expect(result.isValid).toBe(false);
  });

  it('Property 1: rejects strings with invalid characters', () => {
    fc.assert(
      fc.property(
        fc.stringOf(fc.constantFrom('!', '@', '#', ' ', '中'), { minLength: 1, maxLength: 10 }),
        (input) => {
          const result = validateInput(input);
          return result.isValid === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: palindrome-visualizer, Property 2: 输入截断正确性**
  // **Validates: Requirements 1.4**
  it('Property 2: truncates strings longer than max length', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 51, maxLength: 100 }),
        fc.integer({ min: 1, max: 50 }),
        (input, maxLen) => {
          const result = truncateInput(input, maxLen);
          return result.length === maxLen && input.startsWith(result);
        }
      ),
      { numRuns: 100 }
    );
  });
});
