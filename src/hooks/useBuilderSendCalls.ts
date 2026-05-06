import { useCallback } from 'react';
import { useSendCalls } from 'wagmi/experimental';
import {
  withBuilderCodeCalls,
  withBuilderCodeCapabilities,
} from '../utils/builderAttribution';

type SendCallsAsync = ReturnType<typeof useSendCalls>['sendCallsAsync'];

export function useBuilderSendCalls(walletHandlesDataSuffix: boolean) {
  const sendCalls = useSendCalls();

  const sendBuilderCallsAsync = useCallback<SendCallsAsync>(
    (variables, options) => {
      // ERC-8021 attribution must be applied before the wallet submits the
      // transaction. A missing Builder Code cannot be recovered after mining.
      const attributedVariables = withBuilderCodeCapabilities(
        {
          ...variables,
          calls: withBuilderCodeCalls(
            variables.calls,
            walletHandlesDataSuffix,
          ),
        },
        walletHandlesDataSuffix,
      ) as typeof variables;

      return sendCalls.sendCallsAsync(attributedVariables as never, options as never);
    },
    [sendCalls.sendCallsAsync, walletHandlesDataSuffix],
  );

  return {
    ...sendCalls,
    sendCallsAsync: sendBuilderCallsAsync,
  };
}
