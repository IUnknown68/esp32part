//------------------------------------------------------------------------------
interface PartitionRecord {
  name: string;
  type: PartitionType | number;
  subType: PartitionSubTypeApp | PartitionSubTypeData;
  offset: number;
  size: number;
  flags: Array<PartitionFlags>;
  autoOffset: boolean,
}

//------------------------------------------------------------------------------
export type PartitionTable = Array<PartitionRecord>;

//------------------------------------------------------------------------------
export function clonePartitionRecord(record: PartitionRecord) : PartitionRecord {
  return {
    ...record,
    flags: [...record.flags],
  };
}

export default PartitionRecord;
