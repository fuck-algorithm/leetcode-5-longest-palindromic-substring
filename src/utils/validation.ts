import { ValidationResult } from '../types';

const MAX_INPUT_LENGTH = 50;
const VALID_CHAR_REGEX = /^[a-zA-Z0-9]+$/;

export function validateInput(input: string): ValidationResult {
  if (!input || input.length === 0) {
    return { isValid: false, error: '请输入至少一个字符' };
  }

  if (!VALID_CHAR_REGEX.test(input)) {
    return { isValid: false, error: '只允许输入数字和英文字母' };
  }

  if (input.length > MAX_INPUT_LENGTH) {
    return {
      isValid: true,
      sanitizedInput: input.slice(0, MAX_INPUT_LENGTH),
      error: `输入已截断至${MAX_INPUT_LENGTH}个字符`,
    };
  }

  return { isValid: true, sanitizedInput: input };
}

export function truncateInput(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  }
  return input.slice(0, maxLength);
}

export function isValidChar(char: string): boolean {
  return VALID_CHAR_REGEX.test(char);
}
