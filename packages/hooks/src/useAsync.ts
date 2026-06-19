import { useEffect, useRef, useState } from 'react';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export type AsyncState<T> = {
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
};

export type UseAsyncOptions<T> = {
  initialData?: T | null;
};

/**
 * Manage async operation state (loading, success, error).
 * Pass an async function; call `execute` to run it.
 */
export function useAsync<T, TArgs extends unknown[] = []>(
  asyncFn: (...args: TArgs) => Promise<T>,
  options: UseAsyncOptions<T> = {},
): AsyncState<T> & {
  execute: (...args: TArgs) => Promise<T | null>;
  reset: () => void;
} {
  const { initialData = null } = options;
  const asyncFnRef = useRef(asyncFn);

  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: initialData,
    error: null,
  });

  useEffect(() => {
    asyncFnRef.current = asyncFn;
  }, [asyncFn]);

  const execute = async (...args: TArgs): Promise<T | null> => {
    setState((current) => ({ ...current, status: 'loading', error: null }));

    try {
      const data = await asyncFnRef.current(...args);
      setState({ status: 'success', data, error: null });
      return data;
    } catch (error) {
      const normalized = error instanceof Error ? error : new Error(String(error));
      setState({ status: 'error', data: null, error: normalized });
      return null;
    }
  };

  const reset = (): void => {
    setState({ status: 'idle', data: initialData, error: null });
  };

  return { ...state, execute, reset };
}
