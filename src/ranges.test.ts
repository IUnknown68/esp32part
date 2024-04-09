// For aligning the range strings
/* eslint-disable no-multi-spaces */
import {
  overlaps,
  isContainedIn,
  Range,
} from './ranges';

function minIndex(a : number, b : number) : number {
  if (a === -1 && b === -1) {
    throw new Error('Missing rangeStart');
  }
  // Well...
  // eslint-disable-next-line no-nested-ternary
  return (b === -1)
    ? a
    : (a === -1)
      ? b
      : Math.min(a, b);
}

function rangeStart(c : string, str : string) : number {
  // Accounts for lower index possibly being -1 (not found).
  return minIndex(str.indexOf(c), str.indexOf('█'));
}

function rangeEnd(c : string, str : string) : number {
  // No problem with -1 here, since this uses max().
  return Math.max(str.lastIndexOf(c), str.lastIndexOf('█'));
}

function parseRangeString(str : string) : [Range, Range] {
  const ranges = [
    { offset: rangeStart('▀', str), size: 0 },
    { offset: rangeStart('▄', str), size: 0 },
  ];
  ranges[0].size = rangeEnd('▀', str) - ranges[0].offset + 1;
  ranges[1].size = rangeEnd('▄', str) - ranges[1].offset + 1;
  return ranges as [Range, Range];
}

describe('ranges: overlaps(test, target)', () => {
  it.each([
    [false, '▀▀ ▄▄'],

    [false, '▀▀▄▄'],

    [true,  '▀█▄'],

    [true,  '██'],

    [true,  '▄█▀'],

    [false, '▄▄▀▀'],

    [false, '▄▄ ▀▀'],

    [true, '▄██▄'],

    [true, '▀██▀'],
  ])('returns %p for %s', (expected, str) => {
    expect(overlaps(...parseRangeString(str))).toBe(expected);
  });
});

describe('ranges: isContainedIn(test, target)', () => {
  it.each([
    [false, '▀▀ ▄▄'],

    [false, '▀▀▄▄'],

    [false, '▀█▄'],

    [true,  '██'],

    [true,  '██▄'],

    [true,  '▄██'],

    [false, '▄▄█▀'],

    [false, '▄█▀'],

    [false, '▄▄▀▀'],

    [false, '▄▄ ▀▀'],

    [true, '▄██▄'],

    [false, '▀██▀'],
  ])('returns %p for %s', (expected, str) => {
    expect(isContainedIn(...parseRangeString(str))).toBe(expected);
  });
});