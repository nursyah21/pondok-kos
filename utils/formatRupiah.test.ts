import { it, expect } from 'vitest';
import { formatRupiahIntl } from './formatRupiah';

it('should convert number 10000 to 10,000', () => {
  expect(formatRupiahIntl(10_000, false)).toBe('10,000');  
});

it('should convert string 10000 to 10,000', () => {
  expect(formatRupiahIntl('10000', false)).toBe('10,000');   
});

it('should convert string 10,000 to 10,000', () => {
  expect(formatRupiahIntl('10,000', false)).toBe('10,000');   
});

it('should convert random string (asdas) to 0', () => {
  expect(formatRupiahIntl('asdas', false)).toBe('0');   
});

it('should convert string 1.000 to 1,000 string', () => {
  expect(formatRupiahIntl('1.000', false)).toBe('1,000');
});