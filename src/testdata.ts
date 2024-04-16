import {
  PartitionType,
  PartitionSubTypeApp,
  PartitionSubTypeData,
  PartitionFlags,
} from './constants';

import PartitionRecord from './PartitionRecord';

export const SAMPLE_PARTITION_RECORD : PartitionRecord = {
  name: 'nvs',
  type: PartitionType.data,
  subType: PartitionSubTypeData.nvs,
  offset: 0x9000,
  size: 0x5000,
  flags: [PartitionFlags.encrypted],
  lock: false,
};

export const APP_3M_FAT_9M_16MB : Array<PartitionRecord> = [
  {
    name: 'nvs',
    type: PartitionType.data,
    subType: PartitionSubTypeData.nvs,
    offset: 0x9000,
    size: 0x5000,
    flags: [],
    lock: false,
  },
  {
    name: 'otadata',
    type: PartitionType.data,
    subType: PartitionSubTypeData.ota,
    offset: 0xe000,
    size: 0x2000,
    flags: [],
    lock: false,
  },
  {
    name: 'app0',
    type: PartitionType.app,
    subType: PartitionSubTypeApp.ota_0,
    offset: 0x10000,
    size: 0x300000,
    flags: [],
    lock: false,
  },
  {
    name: 'app1',
    type: PartitionType.app,
    subType: PartitionSubTypeApp.ota_1,
    offset: 0x310000,
    size: 0x300000,
    flags: [],
    lock: false,
  },
  {
    name: 'ffat',
    type: PartitionType.data,
    subType: PartitionSubTypeData.fat,
    offset: 0x610000,
    size: 0x9E0000,
    flags: [],
    lock: false,
  },
  {
    name: 'coredump',
    type: PartitionType.data,
    subType: PartitionSubTypeData.coredump,
    offset: 0xFF0000,
    size: 0x10000,
    flags: [],
    lock: false,
  },
];

export const APP_3M_FAT_9M_16MB_STR = `# Name,   Type, SubType, Offset,  Size, Flags
nvs,      data, nvs,     0x9000,  0x5000,
otadata,  data, ota,     0xe000,  0x2000,
app0,     app,  ota_0,   0x10000, 0x300000,
app1,     app,  ota_1,   0x310000,0x300000,
ffat,     data, fat,     0x610000,0x9E0000,
coredump, data, coredump,0xFF0000,0x10000,
# to create/use ffat, see https://github.com/marcmerlin/esp32_fatfsimage
`;

export const VALID_ROW = 'nvs,      data, nvs,     0x9000,  0x5000, encrypted:readonly';
export const VALID_ROW_RESULT = [
  ['name', 'nvs'],
  ['type', PartitionType.data],
  ['subType', PartitionSubTypeData.nvs],
  ['offset', 0x9000],
  ['size', 0x5000],
  ['lock', false],
  ['flags', [1, 2]],
];

export const VALID_ROW_NO_FLAGS = 'nvs,      data, nvs,     0x9000,  0x5000, ';
export const VALID_ROW_RESULT_NO_FLAGS = [
  ['name', 'nvs'],
  ['type', PartitionType.data],
  ['subType', PartitionSubTypeData.nvs],
  ['offset', 0x9000],
  ['size', 0x5000],
  ['lock', false],
  ['flags', []],
];

export const VALID_ROW_NO_FLAGS_NO_OFFSET = 'nvs,      data, nvs, ,  0x5000, ';
export const VALID_ROW_RESULT_NO_FLAGS_NO_OFFSET = [
  ['name', 'nvs'],
  ['type', PartitionType.data],
  ['subType', PartitionSubTypeData.nvs],
  ['offset', 0],
  ['size', 0x5000],
  ['lock', false],
  ['flags', []],
];

export const CSV_AR = [
  '# Name,   Type, SubType, Offset,  Size, Flags',
  'nvs,      data, nvs,     0x9000,  0x5000,',
  'otadata,  data, ota,     0xe000,  0x2000,encrypted',
  'app0,     app,  ota_0,   0x10000, 0x140000,encrypted:readonly',
  'app1,     app,  ota_1,   0x150000,0x140000,readonly',
  'spiffs,   data, spiffs,  0x290000,0x160000,',
  'coredump, data, coredump,0x3F0000,0x10000,',
];
