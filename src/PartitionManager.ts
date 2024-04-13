import {
  OFFSET_PART_TABLE,
  PARTITION_TABLE_SIZE,
  BLOCK_ALIGNMENT_DATA,
  BLOCK_ALIGNMENT_APP,
  FlashSize,
  PartitionType,
} from './constants';

import {
  csvToPartitionList,
} from './csv';

import PartitionRecord, {
  PartitionTable,
  clonePartitionRecord,
} from './PartitionRecord';

const { MiB128 } = FlashSize;

//------------------------------------------------------------------------------
class PartitionManager {
  private table : PartitionTable;

  static fromCsv(csv: string, maxSize: FlashSize = MiB128)
    : PartitionManager {
    return new PartitionManager(csvToPartitionList(csv), maxSize);
  }

  constructor(table : PartitionTable = [], public maxSize: FlashSize = MiB128) {
    const tableEnd = validatePartitionTable([
      ...table.map(clonePartitionRecord),
    ]);
    if (tableEnd > this.maxSize) {
      // eslint-disable-next-line no-bitwise
      throw new RangeError(`Overall size exceeds flash size (${this.maxSize >> 20} MiB).`);
    }
    this.table = table;
  }

  addPartition(record : PartitionRecord, index : number = -1) : void {
    // TODO: Check for existing partition
    const newTable : PartitionTable = ((index > -1)
      ? [
        ...this.table.slice(0, index),
        record,
        ...this.table.slice(index),
      ]
      : [
        ...this.table,
        record,
      ]).map(clonePartitionRecord);

    const tableEnd = validatePartitionTable(newTable);
    if (tableEnd > this.maxSize) {
      // eslint-disable-next-line no-bitwise
      throw new RangeError(`Overall size exceeds flash size (${this.maxSize >> 20} MiB).`);
    }
    this.table = newTable;
  }
}

//------------------------------------------------------------------------------
export function getOffsetAlignment(type : PartitionType) {
  return (type === PartitionType.app)
    ? BLOCK_ALIGNMENT_APP
    : BLOCK_ALIGNMENT_DATA;
}

//------------------------------------------------------------------------------
export function validatePartitionTable(
  table : PartitionTable,
  offsetPartitionTable : number = OFFSET_PART_TABLE,
) : number {
  let tableEnd = offsetPartitionTable + PARTITION_TABLE_SIZE;
  for (const [index, record] of table.entries()) {
    if (record.offset && record.offset < tableEnd) {
      throw new RangeError(`Partition ${index} overlaps.`);
    }

    if (!record.offset) {
      const padTo = getOffsetAlignment(record.type);
      const rest = tableEnd % padTo;
      if (rest) {
        tableEnd += padTo - rest;
      }
      record.offset = tableEnd;
    }
    if (record.size <= 0) {
      // Since negative sizes are undocumented, exclude it here for now.
      throw new RangeError('Negative sizes are not supported.');
      // record.size = -record.size - record.offset;
    }
    tableEnd = record.offset + record.size;
  }
  return tableEnd;
}

export default PartitionManager;
