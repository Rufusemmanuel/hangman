import type { Connector } from "wagmi";
import { Attribution } from "ox/erc8021";
import {
  createWalletClient,
  type Chain,
  type Hex,
  type Transport,
  type WalletClient,
  type WalletClientConfig,
} from "viem";

const DEFAULT_BUILDER_CODE = "bc_hc57dxi9";

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

type AttributableTx = {
  data?: Hex;
};

type AttributableCall = AttributableTx & {
  dataSuffix?: Hex;
};

function getBuilderCode() {
  const code = import.meta.env.VITE_BASE_BUILDER_CODE;
  if (typeof code === "string" && code.trim().length > 0) {
    return code.trim();
  }
  return DEFAULT_BUILDER_CODE;
}

export const BUILDER_CODE = getBuilderCode();
export const BUILDER_DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE],
}) as Hex;

export function getBuilderDataSuffixHex(): Hex {
  const builderCode = getBuilderCode();
  const suffix = Attribution.toDataSuffix({ codes: [builderCode] }) as
    | Hex
    | { value: Hex };
  const hex = typeof suffix === "string" ? suffix : suffix?.value;
  const normalized = hex?.startsWith("0x") ? hex : (`0x${hex ?? ""}` as const);
  return normalized;
}

export function getBuilderCapabilities() {
  return {
    dataSuffix: getBuilderDataSuffixHex(),
  } as const;
}

export function appendDataSuffix(data: Hex, suffix: Hex): Hex {
  return `${data}${suffix.replace(/^0x/, "")}` as Hex;
}

function hasBuilderCode(data: Hex) {
  const attribution = Attribution.fromData(data);
  return Boolean(attribution?.codes.includes(BUILDER_CODE));
}

export function withBuilderCode(txData: Hex = "0x"): Hex {
  // ERC-8021 Builder Codes live in transaction calldata. If a transaction is
  // submitted without the suffix, attribution is permanently lost onchain.
  if (hasBuilderCode(txData)) return txData;
  return appendDataSuffix(txData, BUILDER_DATA_SUFFIX);
}

export function withBuilderCodeTransaction<T extends AttributableTx>(tx: T): T & { data: Hex } {
  return {
    ...tx,
    data: withBuilderCode(tx.data),
  };
}

export function withBuilderCodeCall<T extends AttributableCall>(
  call: T,
  walletHandlesDataSuffix: boolean,
): T {
  if (walletHandlesDataSuffix) {
    return {
      ...call,
      dataSuffix: call.dataSuffix ?? BUILDER_DATA_SUFFIX,
    };
  }

  return withBuilderCodeTransaction(call);
}

export function withBuilderCodeCalls<T extends readonly unknown[]>(
  calls: T,
  walletHandlesDataSuffix: boolean,
) {
  return calls.map((call) =>
    withBuilderCodeCall(call as AttributableCall, walletHandlesDataSuffix),
  ) as unknown as T;
}

export function withBuilderCodeCapabilities<T extends { capabilities?: Record<string, unknown> }>(
  tx: T,
  walletHandlesDataSuffix: boolean,
): T {
  if (!walletHandlesDataSuffix) return tx;

  return {
    ...tx,
    capabilities: {
      ...tx.capabilities,
      dataSuffix: { value: BUILDER_DATA_SUFFIX },
    },
  };
}

export function createBuilderWalletClient<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
>(
  parameters: WalletClientConfig<transport, chain> & { dataSuffix?: Hex },
): WalletClient<transport, chain> {
  const client = createWalletClient({
    ...parameters,
    // Keep ERC-8021 attribution on the wallet client setup so callers do not
    // have to remember attribution on each future transaction.
    dataSuffix: parameters.dataSuffix ?? BUILDER_DATA_SUFFIX,
  } as WalletClientConfig<transport, chain> & { dataSuffix: Hex });
  const sendTransaction = client.sendTransaction.bind(client);
  const writeContract = client.writeContract.bind(client);

  return Object.assign(client, {
    sendTransaction: (tx: Parameters<typeof client.sendTransaction>[0]) =>
      sendTransaction(withBuilderCodeTransaction(tx)),
    writeContract: (tx: Parameters<typeof client.writeContract>[0]) =>
      writeContract({ dataSuffix: BUILDER_DATA_SUFFIX, ...tx }),
  });
}

export async function walletSupportsDataSuffix(connector?: Connector, chainId: number = 8453) {
  try {
    if (!connector?.getProvider) return false;
    const provider = (await connector.getProvider()) as Partial<Eip1193Provider>;
    if (!provider?.request) return false;
    const chainHex = `0x${chainId.toString(16)}`;

    const requestWithParams = await provider
      .request?.({
        method: "wallet_getCapabilities",
        params: [{ chainId: chainHex }],
      })
      .catch(() => undefined);

    const requestWithoutParams =
      requestWithParams ??
      (await provider
        .request?.({
          method: "wallet_getCapabilities",
        })
        .catch(() => undefined));

    const capabilities =
      (requestWithParams as any)?.capabilities ??
      (requestWithoutParams as any)?.capabilities ??
      requestWithParams ??
      requestWithoutParams;

    const chainCaps = capabilities?.[chainHex] ?? capabilities?.["0x2105"];
    const dataSuffix = chainCaps?.dataSuffix;

    if (dataSuffix === true) return true;
    if (typeof dataSuffix?.supported === "boolean") return dataSuffix.supported;
    if (typeof dataSuffix?.native === "boolean") return dataSuffix.native;
    return false;
  } catch {
    return false;
  }
}
