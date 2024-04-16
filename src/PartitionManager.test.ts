import 'jest-extended';

import {
  FlashSize,
  PartitionType,
} from './constants';

import {
  PartitionManager,
} from './PartitionManager';

import {
  getOffsetAlignment,
} from './tools';

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
