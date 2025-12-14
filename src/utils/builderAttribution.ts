import { Attribution } from "ox/erc8021";

const DEFAULT_BUILDER_CODE = "bc_hc57dxi9";

function getBuilderCode() {
  const code = import.meta.env.VITE_BASE_BUILDER_CODE;
  if (typeof code === "string" && code.trim().length > 0) {
    return code.trim();
  }
  return DEFAULT_BUILDER_CODE;
}

export function getBuilderCapabilities() {
  const builderCode = getBuilderCode();
  return {
    dataSuffix: Attribution.toDataSuffix({ codes: [builderCode] }),
  } as const;
}
