export const PAY_TO_PLAY_ADDRESS = '0x70885775f6c85292EFDC0177101042cD221c7e87' as const;

export const PAY_TO_PLAY_ABI = [
  {
    type: 'function',
    name: 'enter',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'ping',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'hasEntered',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ type: 'bool' }],
  },
] as const;
