import {
  PartitionType,
  PartitionSubType,
  PartitionSubTypeApp,
  PartitionSubTypeData,
} from './constants';

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

/*
import {
  AlignmentError,
} from 'src/lib/errors.js';

import {
  BLOCK_ALIGNMENT_DATA,
  BLOCK_ALIGNMENT_APP,
  PARTITION_TYPE,
} from 'src/constants.js';

//------------------------------------------------------------------------------
export function assertValidPartitionOffset(partitionTable, type, offset) {
  if (typeof offset !== 'number') {
    return new TypeError('Offset must be a number.');
  }
  if ((type === PARTITION_TYPE.app) && (offset % BLOCK_ALIGNMENT_APP)) {
    return new AlignmentError(`App-partition must be a aligned to ${BLOCK_ALIGNMENT_APP}.`);
  }
  if ((type === PARTITION_TYPE.data) && (offset % BLOCK_ALIGNMENT_DATA)) {
    return new AlignmentError(`Data-partition must be a aligned to ${BLOCK_ALIGNMENT_DATA}.`);
  }
}

//------------------------------------------------------------------------------
export function assertValidPartitionSize(partitionTable, offset, size) {
  if (typeof offset !== 'number') {
    return new TypeError('Size must be a number.');
  }
  if ((offset + size) >= partitionTable.flashSize) {
    return new TypeError('Partition extends past end of flash.');
  }
}
*/
