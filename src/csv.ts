import {
  MAX_NAME_LEN,
  PartitionType,
  PartitionSubTypeApp,
  PartitionSubTypeData,
  PartitionFlags,
} from './constants';

import PartitionRecord from './PartitionRecord';

const EXPECTED_COLUMNS = 6;
const NUMBER_REGEX = /(0x)?([a-f0-9]+)([a-z]?)/i;

/**
 * Parses either a string literal or a number into an enum.
 * @type {string}          T        Enum type.
 * @param  {string}        value    String value to parse.
 * @param  {Object}        enumType The enum type as an Object.
 * @return {T}                      A valid enum of type `T`.
 * @throws {TypeError}              If the value can not be parsed as `T`.
 */
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

/**
 * Enum parser for `PartitionType`
 * @param  {string}        value   String value to parse.
 * @return {PartitionType}         A valid enum of type `PartitionType`.
 * @throws {TypeError}             If the value can not be parsed as `PartitionType`.
 */
export function parseType(value: string) : PartitionType {
  return parseEnum(value, PartitionType);
}

/**
 * Enum parser for `PartitionSubTypeApp`
 * @param  {string}        value   String value to parse.
 * @return {PartitionSubTypeApp}   A valid enum of type `PartitionSubTypeApp`.
 * @throws {TypeError}             If the value can not be parsed as `PartitionSubTypeApp`.
 */
export function parseSubtypeApp(value: string) : PartitionSubTypeApp {
  return parseEnum(value, PartitionSubTypeApp);
}

/**
 * Enum parser for `PartitionSubTypeData`
 * @param  {string}        value   String value to parse.
 * @return {PartitionSubTypeData}  A valid enum of type `PartitionSubTypeData`.
 * @throws {TypeError}             If the value can not be parsed as `PartitionSubTypeData`.
 */
export function parseSubtypeData(value: string) : PartitionSubTypeData {
  return parseEnum(value, PartitionSubTypeData);
}

/**
 * Enum parser for `parseFlag`
 * @param  {string}        value   String value to parse.
 * @return {parseFlag}             A valid enum of type `parseFlag`.
 * @throws {TypeError}             If the value can not be parsed as `parseFlag`.
 */
export function parseFlag(value: string) : PartitionFlags {
  return parseEnum(value, PartitionFlags);
}

/**
 * Parses a number as it can appear in a partition table csv. Takes into account
 * suffixes (K, M) and the prefix `0x` for hex numbers.
 * @param  {string} value Value to parse.
 * @return {number}       Parsed number.
 * @throws {TypeError}
 */
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

/**
 * Parses a single csv-row into a `PartitionRecord`. If the line is not a partition
 * (like a comment), returns `null`.
 * Validates the partition record in respect of its independent values (like
 * name, relation of type / subtype etc).
 * @param  {string}          line CSV-String
 * @return {PartitionRecord}      Parsed record. `null` for empty lines or comments.
 * @throws {Error}
 */
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

  // TODO: validate type / subtype

  const flags = data[5]
    ? data[5].split(/:/).map(parseFlag)
    : [];

  // offset can be 0, PartitionManager will set it.
  const offset = data[3] ? parseNumber(data[3]) : 0;

  return {
    name: data[0].slice(0, MAX_NAME_LEN),
    type,
    subType,
    offset,
    size,
    flags,
    lock: false,
  };
}

/**
 * Parses a csv-file into an `Array` of `PartitionRecord`s.
 * @param  {string}          line CSV
 * @return {Array<PartitionRecord>}      Parsed records.
 * @throws {Error}
 */
export function csvToPartitionList(value : string) : any {
  return value.split(/\r?\n/)
    .map(csvRowToPartition)
    .filter((line) => !!line);
}
