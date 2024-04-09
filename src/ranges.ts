//------------------------------------------------------------------------------
export interface Range {
  offset: number;
  size: number;
}

//------------------------------------------------------------------------------
export function end(range : Range) : number {
  return range.offset + range.size;
}

//------------------------------------------------------------------------------
export function isContainedIn(rangeTest : Range, rangeTarget : Range) : boolean {
  return (rangeTest.offset >= rangeTarget.offset)
    && (end(rangeTest) <= end(rangeTarget));
}

//------------------------------------------------------------------------------
export function overlaps(rangeTest : Range, rangeTarget : Range) : boolean {
  return (
    ((rangeTest.offset >= rangeTarget.offset) && (rangeTest.offset < end(rangeTarget)))
    || ((rangeTarget.offset >= rangeTest.offset) && (rangeTarget.offset < end(rangeTest)))
  );
}
