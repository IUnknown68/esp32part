import {
  PARTITION_TABLE_SIZE,
  OFFSET_PART_TABLE,
  PartitionType,
  PartitionSubType,
  PartitionSubTypeApp,
  PartitionSubTypeData,
} from './constants';

import {
  getOffsetAlignment,
} from './tools';

/**
 * Validates a partition in respect of its position in a partition table.
 * Adjusts auto offsets and makes sure partition doesn't overlap.
 * @param  {PartitionRecord} record Partition record to validate.
 * @param  {number=0}     offsetMin Minimal offset the partition can have.
 * @return {number}                 New minimal offset considering auto-offsets,
 *                                  partition size and block alignment.
 */
export function validatePartitionPosition(
  record : PartitionRecord,
  offsetMin : number = 0,
) : number {
  if (record.offset && record.offset < offsetMin) {
    throw new RangeError('Partition overlaps.');
  }

  if (!record.offset) {
    const padTo = getOffsetAlignment(record.type);
    const rest = offsetMin % padTo;
    // eslint-disable-next-line no-param-reassign
    record.offset = (rest)
      ? offsetMin + padTo - rest
      : offsetMin;
  }
  if (record.size <= 0) {
    // Since negative sizes are undocumented, exclude it here for now.
    throw new RangeError('Negative sizes are not supported.');
    // record.size = -record.size - record.offset;
  }

  return record.offset + record.size;
}

/**
 * Validates a partition table and makes sure all partition offsets and sizes
 * are correct and resolved.
 * @param  {PartitionTable} table `Array` of `PartitionRecords` to check.
 * @param  {number=OFFSET_PART_TABLE} offsetPartitionTable Start offset.
 * @return {number}               Overall size all partitions use together including
 *                                padding and partition table, i.e. the flash size
 *                                required.
 */
export function validatePartitionTable(
  table : PartitionTable,
  offsetPartitionTable : number = OFFSET_PART_TABLE,
) : number {
  return table.reduce(
    (tableEnd, record) => validatePartitionPosition(record, tableEnd),
    offsetPartitionTable + PARTITION_TABLE_SIZE,
  );
}

/**
 * Checks if `type` is a valid partition type.
 * @param  {PartitionType | number} type Type to check.
 * @return {boolean}                `true` if `type` is a valid type.
 */
export function isValidType(type : PartitionType | number) : boolean {
  return (Number.isInteger(type) && type >= 0 && type <= 0xfe);
}

/**
 * Checks if `subType` is a valid partition subtype for `type`.
 * @param  {PartitionSubType | number} subType Subtype to check.
 * @param  {PartitionType | number}    type    Type to check `subType` against.
 * @return {boolean}                           `true` if `subType` is valid and
 *                                             can be combined with `type`.
 */
export function isValidSubType(
  subType : PartitionSubType | number,
  type : PartitionType | number = -1,
) : boolean {
  switch (type) {
    case PartitionType.app:
      return Object.values(PartitionSubTypeApp).includes(subType);
    case PartitionType.data:
      return Object.values(PartitionSubTypeData).includes(subType);
    default:
      return (Number.isInteger(subType) && subType >= 0 && subType <= 0xfe);
  }
}
