// src/config/contract.ts

export const PAY_TO_PLAY_ADDRESS =
  (import.meta.env.VITE_PAY_TO_PLAY_ADDRESS as `0x${string}`) ??
  "0x0000000000000000000000000000000000000000";

export const PAY_TO_PLAY_ABI = [
  {
    type: "function",
    name: "enter",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "ping",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "hasEntered",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;
