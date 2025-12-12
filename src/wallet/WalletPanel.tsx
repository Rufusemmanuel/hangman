import { useEffect, useMemo, useRef, type FC } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const WalletPanel: FC = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect, connectAsync, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const autoTried = useRef(false);

  const isInFarcaster = typeof window !== 'undefined' && 'farcaster' in window;

  const farcasterConnector = useMemo(
    () => connectors.find((c) => c.name.toLowerCase().includes('farcaster')) ?? connectors[0],
    [connectors],
  );
  const injectedConnector = useMemo(
    () => connectors.find((c) => c.id === 'injected' || c.name.toLowerCase().includes('injected')),
    [connectors],
  );

  useEffect(() => {
    if (autoTried.current) return;
    if (isConnected) return;
    if (status === 'pending') return;
    if (isInFarcaster) return;
    if (!injectedConnector || !injectedConnector.ready) return;
    autoTried.current = true;
    connectAsync({ connector: injectedConnector }).catch(() => {
      /* ignore auto-connect failures */
    });
  }, [connectAsync, injectedConnector, isConnected, isInFarcaster, status]);

  const handleConnect = () => {
    const preferred = farcasterConnector && farcasterConnector.ready ? farcasterConnector : injectedConnector;
    if (!preferred) return;
    connect({ connector: preferred });
  };

  const shortAddress =
    address && address.length > 8 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;

  const noWalletAvailable = !farcasterConnector && !injectedConnector;
  const isConnecting = status === 'pending';

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/70">Wallet</p>
          <p className="text-lg font-semibold">{isConnected ? 'Connected' : 'Not connected'}</p>
        </div>
        <div
          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${
            isConnected
              ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100'
              : 'border-white/10 bg-white/10 text-white/70'
          }`}
        >
          {isConnected ? 'Ready' : 'Offline'}
        </div>
      </div>

      {isConnected && address ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Address</p>
            <p className="font-mono text-sm text-fuchsia-100">{shortAddress}</p>
          </div>
          {disconnect && (
            <button className="btn text-sm" type="button" onClick={() => disconnect()}>
              Disconnect
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            className="btn btn-primary w-full text-base"
            onClick={handleConnect}
            disabled={isConnecting || (!farcasterConnector && !injectedConnector)}
          >
            {isConnecting ? 'Connecting...' : 'Connect wallet'}
          </button>
          {!isConnected && !isConnecting && (!injectedConnector || !injectedConnector.ready) && !isInFarcaster && (
            <p className="text-xs text-white/70">No injected wallet detected. Open MetaMask/Rabby or install one.</p>
          )}
        </div>
      )}

      {status === 'error' && error && <p className="text-xs text-rose-200/90">{error.message}</p>}
      {noWalletAvailable && <p className="text-xs text-white/60">No wallet connectors available.</p>}
    </div>
  );
};

export default WalletPanel;
