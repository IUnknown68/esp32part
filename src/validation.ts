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

//------------------------------------------------------------------------------
export function validatePartition(
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

//------------------------------------------------------------------------------
export function validatePartitionTable(
  table : PartitionTable,
  offsetPartitionTable : number = OFFSET_PART_TABLE,
) : number {
  return table.reduce(
    (tableEnd, record) => validatePartition(record, tableEnd),
    offsetPartitionTable + PARTITION_TABLE_SIZE,
  );
}

//------------------------------------------------------------------------------
export function isValidType(type : PartitionType | number) : boolean {
  return (Number.isInteger(type) && type >= 0 && type <= 0xfe);
}

//------------------------------------------------------------------------------
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
