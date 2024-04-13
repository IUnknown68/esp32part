declare const MIN_FLASHSIZE_MIB = 2;
declare const MAX_FLASHSIZE_MIB = 32;
declare const MAX_NAME_LEN = 15;
declare const OFFSET_PART_TABLE = 32768;
declare const MAX_PARTITION_TABLE_LENGTH = 3072;
declare const DEFAULT_PARTITION_SIZE = 4096;
declare const PARTITION_TABLE_SIZE = 4096;
declare const BLOCK_ALIGNMENT_DATA = 4096;
declare const BLOCK_ALIGNMENT_APP = 65536;
declare enum FlashSize {
    MiB1 = 1048576,
    MiB2 = 2097152,
    MiB4 = 4194304,
    MiB8 = 8388608,
    MiB16 = 16777216,
    MiB32 = 33554432,
    MiB64 = 67108864,
    MiB128 = 134217728
}
declare enum PartitionType {
    app = 0,
    data = 1
}
declare enum PartitionSubTypeApp {
    factory = 0,
    ota_0 = 16,
    ota_1 = 17,
    ota_2 = 18,
    ota_3 = 19,
    ota_4 = 20,
    ota_5 = 21,
    ota_6 = 22,
    ota_7 = 23,
    ota_8 = 24,
    ota_9 = 25,
    ota_10 = 26,
    ota_11 = 27,
    ota_12 = 28,
    ota_13 = 29,
    ota_14 = 30,
    ota_15 = 31,
    test = 32
}
declare enum PartitionSubTypeData {
    ota = 0,
    phy = 1,
    nvs = 2,
    coredump = 3,
    nvs_keys = 4,
    efuse_em = 5,
    undefined = 6,
    esphttpd = 128,
    fat = 129,
    spiffs = 130,
    littlefs = 131
}
type PartitionSubType = PartitionSubTypeApp | PartitionSubTypeData | number;
declare enum PartitionFlags {
    encrypted = 1,
    readonly = 2
}

interface PartitionRecord {
    name: string;
    type: PartitionType | number;
    subType: PartitionSubTypeApp | PartitionSubTypeData;
    offset: number;
    size: number;
    flags: Array<PartitionFlags>;
    autoOffset: boolean;
}
declare function parseEnum<T>(value: string, enumType: Record<string, string | number>): T;
declare function parseType(value: string): PartitionType;
declare function parseSubtypeApp(value: string): PartitionSubTypeApp;
declare function parseSubtypeData(value: string): PartitionSubTypeData;
declare function parseFlag(value: string): PartitionFlags;
declare function parseNumber(value: string): number;
declare function csvRowToPartition(line: string): PartitionRecord | null;
declare function csvToPartitionList(value: string): any;

type PartitionRecordAr = Array<PartitionRecord>;
declare class PartitionTable {
    maxSize: FlashSize;
    private table;
    static fromCsv(csv: string, maxSize?: FlashSize): PartitionTable;
    static getOffsetAlignment(type: PartitionType): 4096 | 65536;
    constructor(partitionRecords?: PartitionRecordAr, maxSize?: FlashSize);
    addPartition(record: PartitionRecord, index?: number): void;
    validatePartitionTable(table: PartitionRecordAr, offsetPartitionTable?: number): void;
}

export { BLOCK_ALIGNMENT_APP, BLOCK_ALIGNMENT_DATA, DEFAULT_PARTITION_SIZE, FlashSize, MAX_FLASHSIZE_MIB, MAX_NAME_LEN, MAX_PARTITION_TABLE_LENGTH, MIN_FLASHSIZE_MIB, OFFSET_PART_TABLE, PARTITION_TABLE_SIZE, PartitionFlags, type PartitionRecord, type PartitionSubType, PartitionSubTypeApp, PartitionSubTypeData, PartitionTable, PartitionType, csvRowToPartition, csvToPartitionList, parseEnum, parseFlag, parseNumber, parseSubtypeApp, parseSubtypeData, parseType };
