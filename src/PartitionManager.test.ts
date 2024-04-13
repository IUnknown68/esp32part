import 'jest-extended';

import {
  FlashSize,
  PartitionType,
  PARTITION_TABLE_SIZE,
  OFFSET_PART_TABLE,
} from './constants';

import PartitionManager, {
  getOffsetAlignment,
  validatePartitionTable,
} from './PartitionManager';

import {
  clonePartitionRecord,
} from './PartitionRecord';

import {
  SAMPLE_PARTITION_RECORD,
  APP_3M_FAT_9M_16MB,
  APP_3M_FAT_9M_16MB_STR,
} from './testdata';

describe('PartitionManager', () => {
  it('can be constructed without arguments', () => {
    const testee = new PartitionManager();
    expect(testee).toBeTruthy();
  });

  it('can be constructed without a maxSize', () => {
    const testee = new PartitionManager([]);
    expect(testee).toBeTruthy();
  });

  it('will have the correct maxSize', () => {
    const testee = new PartitionManager(APP_3M_FAT_9M_16MB, FlashSize.MiB16);
    expect(testee.maxSize).toBe(FlashSize.MiB16);
  });

  it('throws when the overall size of partitions exceed maxSize.', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new PartitionManager(APP_3M_FAT_9M_16MB, FlashSize.MiB1);
    }).toThrow();
  });

  describe('has a static fromCsv(), that', () => {
    it('returns a new PartitionManager.', () => {
      const testee = PartitionManager.fromCsv(APP_3M_FAT_9M_16MB_STR);
      expect(testee).toBeInstanceOf(PartitionManager);
    });

    it('throws when the overall size of partitions exceed maxSize.', () => {
      expect(() => {
        PartitionManager.fromCsv(APP_3M_FAT_9M_16MB_STR, FlashSize.MiB1);
      }).toThrow();
    });
  });

  describe('has a function addPartition()', () => {
    it('that adds a partition at the end, if no index is provided', () => {
      const testee = new PartitionManager();
      testee.addPartition(clonePartitionRecord(SAMPLE_PARTITION_RECORD));
      expect(testee.table.length).toBe(1);
    });

    it('that inserts a partition at the given index', () => {
      const testee = new PartitionManager(APP_3M_FAT_9M_16MB);
      const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record.offset = 0;
      record.name = 'foo';

      const insertAt = 5;
      testee.table[insertAt].offset = 0;
      testee.addPartition(record, insertAt);

      expect(testee.table.length).toBe(APP_3M_FAT_9M_16MB.length + 1);
      expect(testee.table[insertAt - 1].name).toBe(APP_3M_FAT_9M_16MB[insertAt - 1].name);
      expect(testee.table[insertAt].name).toBe(record.name);
      expect(testee.table[insertAt + 1].name).toBe(APP_3M_FAT_9M_16MB[insertAt].name);
    });
  });

  it('throws when the overall size of partitions exceed maxSize.', () => {
    expect(() => {
      const testee = new PartitionManager([], FlashSize.MiB1);
      const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record.size = FlashSize.MiB2;
      testee.addPartition(record);
    }).toThrow();
  });
});

describe('getOffsetAlignment()', () => {
  it('returns the proper alignment for PartitionType.app.', () => {
    expect(getOffsetAlignment(PartitionType.app)).toBe(0x10000);
  });
  it('returns the proper alignment for PartitionType.data.', () => {
    expect(getOffsetAlignment(PartitionType.data)).toBe(0x1000);
  });
});

describe('validatePartitionTable()', () => {
  describe('throws an error, when', () => {
    it('a record overlaps with the offset', () => {
      const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record.offset = OFFSET_PART_TABLE + PARTITION_TABLE_SIZE - 1;
      expect(() => {
        validatePartitionTable([record]);
      }).toThrow();
    });

    it('a record overlaps with the offset passed', () => {
      const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record.offset = 2 + PARTITION_TABLE_SIZE - 1;
      expect(() => {
        validatePartitionTable([record], 2);
      }).toThrow();
    });

    it('a record overlaps with the previous record', () => {
      const record1 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      const record2 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record2.offset = record1.offset + record1.size - 1;
      expect(() => {
        validatePartitionTable([record1, record2]);
      }).toThrow();
    });

    it('a record has a size <= 0', () => {
      const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record.size = 0;
      expect(() => {
        validatePartitionTable([record]);
      }).toThrow();
      record.size = -1;
      expect(() => {
        validatePartitionTable([record]);
      }).toThrow();
    });
  });

  describe('does not throw, when', () => {
    it('a record starts at the offset', () => {
      const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record.offset = OFFSET_PART_TABLE + PARTITION_TABLE_SIZE;
      expect(() => {
        validatePartitionTable([record]);
      }).not.toThrow();
    });

    it('a record starts at the offset passed', () => {
      const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record.offset = 2 + PARTITION_TABLE_SIZE;
      expect(() => {
        validatePartitionTable([record], 2);
      }).not.toThrow();
    });

    it('records touch', () => {
      const record1 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      const record2 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
      record2.offset = record1.offset + record1.size;
      expect(() => {
        validatePartitionTable([record1, record2]);
      }).not.toThrow();
    });
  });

  it('sets offsets which are 0', () => {
    const record1 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
    const record2 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
    record2.offset = 0;
    validatePartitionTable([record1, record2]);
    expect(record2.offset).toBe(record1.offset + record1.size);
  });

  it('aligns an offset with the next alignment boundary', () => {
    const record1 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
    record1.size = 0x10;
    const record2 = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
    record2.offset = 0;
    validatePartitionTable([record1, record2]);
    expect(record2.offset).toBe(OFFSET_PART_TABLE + PARTITION_TABLE_SIZE + 0x1000);
  });

  it('returns the end of the table', () => {
    const record = clonePartitionRecord(SAMPLE_PARTITION_RECORD);
    record.offset = 0;
    const result = validatePartitionTable([record]);
    expect(result).toBe(OFFSET_PART_TABLE + PARTITION_TABLE_SIZE + record.size);
  });
});
