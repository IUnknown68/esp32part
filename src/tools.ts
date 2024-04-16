import {
  BLOCK_ALIGNMENT_APP,
  BLOCK_ALIGNMENT_DATA,
  PartitionType,
} from './constants';

/**
 * Returns the proper alignment for a certain partition type.
 * @param {PartitionType} type [description]
 */
// eslint-disable-next-line import/prefer-default-export
export function getOffsetAlignment(type : PartitionType) {
  return (type === PartitionType.app)
    ? BLOCK_ALIGNMENT_APP
    : BLOCK_ALIGNMENT_DATA;
}
