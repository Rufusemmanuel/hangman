import type { Connector } from "wagmi";
import { Attribution } from "ox/erc8021";

const DEFAULT_BUILDER_CODE = "bc_hc57dxi9";

function getBuilderCode() {
  const code = import.meta.env.VITE_BASE_BUILDER_CODE;
  if (typeof code === "string" && code.trim().length > 0) {
    return code.trim();
  }
  return DEFAULT_BUILDER_CODE;
}

export function getBuilderDataSuffixHex(): `0x${string}` {
  const builderCode = getBuilderCode();
  const suffix = Attribution.toDataSuffix({ codes: [builderCode] }) as
    | `0x${string}`
    | { value: `0x${string}` };
  const hex = typeof suffix === "string" ? suffix : suffix?.value;
  const normalized = hex?.startsWith("0x") ? hex : (`0x${hex ?? ""}` as const);
  return normalized;
}

export function getBuilderCapabilities() {
  return {
    dataSuffix: getBuilderDataSuffixHex(),
  } as const;
}

export function appendDataSuffix(data: `0x${string}`, suffix: `0x${string}`): `0x${string}` {
  return `${data}${suffix.replace(/^0x/, "")}` as `0x${string}`;
}

export async function walletSupportsDataSuffix(connector?: Connector, chainId: number = 8453) {
  try {
    if (!connector?.getProvider) return false;
    const provider = await connector.getProvider();
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
