import 'jest-extended';

import {
  FlashSize,
  PartitionType,
  PartitionSubTypeApp,
  PartitionSubTypeData,
} from './constants';

import {
  PartitionRecord,
} from './csv';

import PartitionManager from './PartitionManager';

const APP_3M_FAT_9M_16MB : Array<PartitionRecord> = [
  {
    name: 'nvs',
    type: PartitionType.data,
    subType: PartitionSubTypeData.nvs,
    offset: 0x9000,
    size: 0x5000,
    flags: [],
    autoOffset: false,
  },
  {
    name: 'otadata',
    type: PartitionType.data,
    subType: PartitionSubTypeData.ota,
    offset: 0xe000,
    size: 0x2000,
    flags: [],
    autoOffset: false,
  },
  {
    name: 'app0',
    type: PartitionType.app,
    subType: PartitionSubTypeApp.ota_0,
    offset: 0x10000,
    size: 0x300000,
    flags: [],
    autoOffset: false,
  },
  {
    name: 'app1',
    type: PartitionType.app,
    subType: PartitionSubTypeApp.ota_1,
    offset: 0x310000,
    size: 0x300000,
    flags: [],
    autoOffset: false,
  },
  {
    name: 'ffat',
    type: PartitionType.data,
    subType: PartitionSubTypeData.fat,
    offset: 0x610000,
    size: 0x9E0000,
    flags: [],
    autoOffset: false,
  },
  {
    name: 'coredump',
    type: PartitionType.data,
    subType: PartitionSubTypeData.coredump,
    offset: 0xFF0000,
    size: 0x10000,
    flags: [],
    autoOffset: false,
  },
];

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
});
