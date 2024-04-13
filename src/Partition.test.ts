import 'jest-extended';

import {
  MAX_NAME_LEN,
  DEFAULT_PARTITION_SIZE,
  PartitionType,
  PartitionSubTypeApp,
  PartitionSubTypeData,
  PartitionFlags,
} from './constants';

import {
  PartitionRecord,
} from './csv';

import Partition from './Partition';

const NAME = 'abcdefghijklmnopqrstuvwxyz';

describe("Partition's", () => {
  let testee : Partition;

  beforeEach(() => {
    testee = new Partition('foo');
  });

  it('constructor returns a partition with default values', () => {
    expect(testee.name).toBe('foo');
    expect(testee.type).toBe(PartitionType.app);
    expect(testee.subType).toBe(PartitionSubTypeApp.factory);
    expect(testee.offset).toBe(0);
    expect(testee.size).toBe(DEFAULT_PARTITION_SIZE);
    expect(testee.readonly).toBeFalse();
    expect(testee.encrypted).toBeFalse();
  });

  it('name is truncated after MAX_NAME_LEN chars', () => {
    testee.name = NAME;
    expect(testee.name.length).toBe(MAX_NAME_LEN);
  });

  it('type is settable to one of PartitionType', () => {
    testee.type = PartitionType.data;
    expect(testee.type).toBe(PartitionType.data);
  });

  it('type is settable to an arbitrary number', () => {
    testee.type = 123;
    expect(testee.type).toBe(123);
  });

  it('type, when set to a new value, resets the subType', () => {
    testee.type = PartitionType.data;
    testee.subType = PartitionSubTypeData.efuse_em;
    testee.type = PartitionType.app;
    expect(testee.subType).toBe(0);
  });

  it('type, when set to the same value, leaves the subType unchanged', () => {
    testee.type = PartitionType.data;
    testee.subType = PartitionSubTypeData.efuse_em;
    testee.type = PartitionType.data;
    expect(testee.subType).toBe(PartitionSubTypeData.efuse_em);
  });

  it('setting type throws when type is out of range', () => {
    expect(() => {
      testee.type = 255;
    }).toThrow();
  });

  it('subType is settable to one of PartitionSubTypeApp', () => {
    testee.type = PartitionType.app;
    testee.subType = PartitionSubTypeApp.ota_0;
    expect(testee.subType).toBe(PartitionSubTypeApp.ota_0);
  });

  it('subType is settable to one of PartitionSubTypeData', () => {
    testee.type = PartitionType.data;
    testee.subType = PartitionSubTypeData.efuse_em;
    expect(testee.subType).toBe(PartitionSubTypeData.efuse_em);
  });

  it('subType is settable to an arbitrary number for arbitrary type', () => {
    testee.type = 0x41;
    testee.subType = 123;
    expect(testee.subType).toBe(123);
  });

  it('setting subType throws when subType is out of range', () => {
    expect(() => {
      testee.subType = 255;
    }).toThrow();
  });

  it('encrypted flag can be set', () => {
    testee.encrypted = false;
    testee.encrypted = true;
    expect(testee.encrypted).toBeTrue();
  });

  it('encrypted flag can be reset', () => {
    testee.encrypted = true;
    testee.encrypted = false;
    expect(testee.encrypted).toBeFalse();
  });

  it('readonly flag can be set', () => {
    testee.readonly = false;
    testee.readonly = true;
    expect(testee.readonly).toBeTrue();
  });

  it('readonly flag can be reset', () => {
    testee.readonly = true;
    testee.readonly = false;
    expect(testee.readonly).toBeFalse();
  });

  it('assign sets all data from a PartitionRecord as is', () => {
    const record : PartitionRecord = {
      name: 'foo',
      type: PartitionType.data,
      subType: PartitionSubTypeData.nvs_keys,
      offset: 123,
      size: 234,
      flags: [PartitionFlags.encrypted],
    };
    testee.assign(record);
    expect(testee.name).toBe(record.name);
    expect(testee.type).toBe(record.type);
    expect(testee.subType).toBe(record.subType);
    expect(testee.offset).toBe(record.offset);
    expect(testee.size).toBe(record.size);
    expect(testee.encrypted).toBeTrue();
    expect(testee.readonly).toBeFalse();
  });
});
