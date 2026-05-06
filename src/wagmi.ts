import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector';
import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { base } from 'wagmi/chains';
import { BUILDER_DATA_SUFFIX } from './utils/builderAttribution';

export const BASE_CHAIN = base;

export const walletClientConfig = {
  // Base Builder Codes use ERC-8021 calldata suffixes at the transaction layer.
  // If a transaction is mined without this suffix, attribution is permanently lost.
  dataSuffix: BUILDER_DATA_SUFFIX,
} as const;

export const config = createConfig({
  chains: [BASE_CHAIN],
  connectors: [miniAppConnector(), injected()],
  transports: {
    [BASE_CHAIN.id]: http(),
  },
  ...walletClientConfig,
});
