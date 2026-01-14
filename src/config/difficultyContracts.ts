import { parseAbi } from 'viem';

export const DIFFICULTY_TX_VALUE = 500_000_000_000n;

export const DIFFICULTY_CONTRACTS = {
  easy: {
    address: '0xb8911EEA5A0c9798365651C48b9A5aeb640c6b62',
    abi: parseAbi(['function easy() payable']),
  },
  medium: {
    address: '0xBE3862325c9BBC710B512Aa0d08bBCEB55267FDa',
    abi: parseAbi(['function medium() payable']),
  },
  hard: {
    address: '0xe75f7f3F1d1fBCeCa9d8C75CD1849552f15CC87C',
    abi: parseAbi(['function hard() payable']),
  },
} as const;
