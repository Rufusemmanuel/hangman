import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector';
import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { base } from 'wagmi/chains';

export const config = createConfig({
  connectors: [miniAppConnector(), injected()],
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});
