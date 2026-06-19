import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchLandingEntitlement } from './fetch-landing-entitlement.js';
import type { WelcomeViewState } from './types-landing.js';
import type { LandingFetchResult } from './fetch-landing-entitlement.js';

export type UseWelcomeLandingOptions<T> = {
  loadConfig: () => T;
};

export type UseWelcomeLandingResult<T> = {
  viewState: WelcomeViewState;
  config: T | null;
  retry: () => void;
};

export function useWelcomeLanding<T>({
  loadConfig,
}: UseWelcomeLandingOptions<T>): UseWelcomeLandingResult<T> {
  const [searchParams] = useSearchParams();
  const demo = searchParams.get('demo');
  const [viewState, setViewState] = useState<WelcomeViewState>('loading');
  const [config, setConfig] = useState<T | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const loadConfigRef = useRef(loadConfig);

  loadConfigRef.current = loadConfig;

  const retry = useCallback(() => {
    setViewState('loading');
    setConfig(null);
    setLoadAttempt((attempt) => attempt + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (demo === 'loading') {
      setViewState('loading');
      setConfig(null);
      return () => {
        cancelled = true;
      };
    }

    setViewState('loading');
    setConfig(null);

    void fetchLandingEntitlement(() => loadConfigRef.current(), { demo }).then(
      (result: LandingFetchResult<T>) => {
        if (cancelled) {
          return;
        }

        if (!result.ok) {
          setViewState('error');
          return;
        }

        setConfig(result.entitlement);
        setViewState('default');
      },
    );

    return () => {
      cancelled = true;
    };
  }, [demo, loadAttempt]);

  return { viewState, config, retry };
}
