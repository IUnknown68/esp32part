import {
  PartitionType,
  PartitionSubTypeApp,
  PartitionSubTypeData,
  PartitionFlags,
} from './constants';

import PartitionRecord from './PartitionRecord';

const EXPECTED_COLUMNS = 6;
const NUMBER_REGEX = /(0x)?([a-f0-9]+)([a-z]?)/i;

//------------------------------------------------------------------------------
export function parseEnum<T>(
  value: string,
  enumType: Record<string, string | number>,
): T {
  try {
    return parseNumber(value.toString()) as T;
  } catch (err) {
    const index = Object.keys(enumType).indexOf(value);
    if (!(index >= 0)) {
      throw new TypeError(`Invalid enumerable: ${value}.`);
    }
    return Object.values(enumType)[index] as T;
  }
}

//------------------------------------------------------------------------------
export function parseType(value: string) : PartitionType {
  return parseEnum(value, PartitionType);
}

//------------------------------------------------------------------------------
export function parseSubtypeApp(value: string) : PartitionSubTypeApp {
  return parseEnum(value, PartitionSubTypeApp);
}

//------------------------------------------------------------------------------
export function parseSubtypeData(value: string) : PartitionSubTypeData {
  return parseEnum(value, PartitionSubTypeData);
}

//------------------------------------------------------------------------------
export function parseFlag(value: string) : PartitionFlags {
  return parseEnum(value, PartitionFlags);
}

//------------------------------------------------------------------------------
export function parseNumber(value: string) : number {
  const m = NUMBER_REGEX.exec(value);
  if (!m) {
    throw new TypeError('Not a parsable number.');
  }
  // istanbul ignore next
  const [, prefix, matchedValue, suffix = ''] = m;
  const num = parseInt(matchedValue, prefix ? 16 : 10);
  if (Number.isNaN(num)) {
    throw new TypeError('Parse number failed.');
  }
  switch (suffix.toLowerCase()) {
    case 'm':
      return num * 1024 * 1024;
    case 'k':
      return num * 1024;
    case '':
      return num;
    default:
      throw new TypeError('Parse number: Invalid suffix.');
  }
}

//------------------------------------------------------------------------------
export function csvRowToPartition(line : string) : PartitionRecord | null {
  const trimmed = line.trim();
  if (trimmed[0] === '#') {
    return null;
  }

  const data = line
    .split(/\s*,\s*/)
    .map((value) => value.trim());
  if (data.length === 1 && !data[0]) {
    // empty line, just ignore
    return null;
  }

  if (data.length !== EXPECTED_COLUMNS) {
    throw new Error(`Invalid csv row: Expected ${EXPECTED_COLUMNS} columns.`);
  }

  const size = parseNumber(data[4]);
  if (!size) {
    throw new RangeError('Size must not be 0.');
  }

  const type = parseType(data[1]);
  const subType = (type === PartitionType.app)
    ? parseSubtypeApp(data[2])
    : parseSubtypeData(data[2]);

  const flags = data[5]
    ? data[5].split(/:/).map(parseFlag)
    : [];

  // offset can be 0, PartitionManager will set it.
  const offset = data[3] ? parseNumber(data[3]) : 0;

  return {
    name: data[0],
    type,
    subType,
    offset,
    size,
    flags,
    autoOffset: !offset,
  };
}

//------------------------------------------------------------------------------
export function csvToPartitionList(value : string) : any {
  return value.split(/\r?\n/)
    .map(csvRowToPartition)
    .filter((line) => !!line);
}
