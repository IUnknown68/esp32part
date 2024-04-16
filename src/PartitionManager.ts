import {
  FlashSize,
} from './constants';

import {
  validatePartitionTable,
} from './validation';

import {
  csvToPartitionList,
} from './csv';

import PartitionRecord, {
  PartitionTable,
  clonePartitionRecord,
} from './PartitionRecord';

const { MiB128 } = FlashSize;

//------------------------------------------------------------------------------
// eslint-disable-next-line import/prefer-default-export
export class PartitionManager {
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
