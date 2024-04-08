import {
  PartitionSize,
} from './constants';

class PartitionTable {
  static fromCsv(csv: string, maxSize: PartitionSize = PartitionSize.S128Mb)
    : PartitionTable {
    const table = new PartitionTable(maxSize);
    return table;
  }

  constructor(public maxSize: PartitionSize = PartitionSize.S128Mb) {
  }
}

export default PartitionTable;
