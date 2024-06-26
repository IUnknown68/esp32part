export const MIN_FLASHSIZE_MB = 2;
export const MAX_FLASHSIZE_MB = 32;

export const MAX_NAME_LEN = 15;

export const MAX_PARTITION_TABLE_LENGTH = 0xC00;
// export const MD5_PARTITION_BEGIN = b'\xEB\xEB' + b'\xFF' * 14
export const MIN_PARTITION_SIZE = 0x1000;

export const BLOCK_ALIGNMENT_DATA = 0x1000;
export const BLOCK_ALIGNMENT_APP = 0x10000;

export enum PartitionSize {
  S1Mb = 1 * 1024 * 1024,
  S2Mb = 2 * 1024 * 1024,
  S4Mb = 4 * 1024 * 1024,
  S8Mb = 8 * 1024 * 1024,
  S16Mb = 16 * 1024 * 1024,
  S32Mb = 32 * 1024 * 1024,
  S64Mb = 64 * 1024 * 1024,
  S128Mb = 128 * 1024 * 1024,
}

export enum PartitionType {
  app = 0x00,
  data = 0x01,
}

export enum PartitionSubTypeApp {
  factory = 0x00,
  ota_0 = 0x10,
  ota_1 = 0x11,
  ota_2 = 0x12,
  ota_3 = 0x13,
  ota_4 = 0x14,
  ota_5 = 0x15,
  ota_6 = 0x16,
  ota_7 = 0x17,
  ota_8 = 0x18,
  ota_9 = 0x19,
  ota_10 = 0x1a,
  ota_11 = 0x1b,
  ota_12 = 0x1c,
  ota_13 = 0x1d,
  ota_14 = 0x1e,
  ota_15 = 0x1f,
  test = 0x20,
}

export enum PartitionSubTypeData {
  ota = 0x00,
  phy = 0x01,
  nvs = 0x02,
  coredump = 0x03,
  nvs_keys = 0x04,
  efuse_em = 0x05,
  undefined = 0x06,
  esphttpd = 0x80,
  fat = 0x81,
  spiffs = 0x82,
  littlefs = 0x83,
}

export type PartitionSubType = PartitionSubTypeApp | PartitionSubTypeData | number;

export enum PartitionFlags {
  encrypted = 1,
  readonly = 2,
}
