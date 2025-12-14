import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector';
import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { base } from 'wagmi/chains';

export const BASE_CHAIN = base;

export const config = createConfig({
  chains: [BASE_CHAIN],
  connectors: [miniAppConnector(), injected({ chains: [BASE_CHAIN] })],
  transports: {
    [BASE_CHAIN.id]: http(),
  },
});
