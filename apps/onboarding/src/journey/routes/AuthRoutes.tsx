import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import { L1PrivacyPolicyScreen } from '../../features/shared-legal/screens/l1-privacy-policy/index.js';
import { L2TermsConditionsScreen } from '../../features/shared-legal/screens/l2-terms-conditions/index.js';
import {
  clampMobileInput,
  formatMobileInput,
  isExpiredOtp,
  isValidMobile,
  isValidOtp,
  normalizeMobile,
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
} from '../../features/shared-auth/auth-flow/auth-flow.validation.js';
import { A1MobileScreen } from '../../features/shared-auth/screens/a1-mobile/index.js';
import { A2OtpScreen } from '../../features/shared-auth/screens/a2-otp/index.js';
import { A3VehicleOwnerScreen } from '../../features/shared-auth/screens/a3-vehicle-owner/index.js';
import type {
  AuthMobileState,
  AuthOtpState,
  AuthVehicleOwnerState,
} from '../../features/shared-auth/types.js';
import { authJourneyPaths } from '../auth/auth-routing.js';
import { journeyPaths } from '../constants.js';
import { useJourney } from '../JourneyContext.js';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function AuthSegmentBootstrap({ children }: { children: ReactNode }) {
  const { setPhase } = useJourney();

  useEffect(() => {
    setPhase('shared-auth');
  }, [setPhase]);

  return children;
}

function MobileRoute() {
  const navigate = useNavigate();
  const { session, updateSession } = useJourney();
  const auth = session.auth ?? {};

  const [mobile, setMobile] = useState(auth.mobileDisplay ?? '');
  const [consent, setConsent] = useState(auth.consentAccepted ?? false);
  const [mobileState, setMobileState] = useState<AuthMobileState>(() =>
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'empty',
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      if (mobileState === 'offline') {
        setMobileState(mobile.trim() ? (consent ? 'ready' : 'filled') : 'empty');
      }
    };
    const handleOffline = () => {
      setMobileState('offline');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [consent, mobile, mobileState]);

  const syncMobileState = useCallback(
    (nextMobile: string, nextConsent: boolean) => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setMobileState('offline');
        return;
      }
      const digits = normalizeMobile(nextMobile);
      if (!digits) {
        setMobileState('empty');
        return;
      }
      setMobileState(nextConsent ? 'ready' : 'filled');
    },
    [],
  );

  const handleContinue = async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setMobileState('offline');
      return;
    }
    if (!isValidMobile(mobile)) {
      setMobileState('error');
      return;
    }
    if (!consent) {
      setMobileState('filled');
      return;
    }
    setSubmitting(true);
    setMobileState('loading');
    await delay(700);
    updateSession({
      auth: {
        ...auth,
        mobile: normalizeMobile(mobile),
        mobileDisplay: formatMobileInput(mobile),
        consentAccepted: consent,
      },
    });
    setSubmitting(false);
    void navigate(authJourneyPaths.otp);
  };

  return (
    <A1MobileScreen
      mobileState={submitting ? 'loading' : mobileState}
      mobileValue={mobile}
      onMobileChange={(value) => {
        const formatted = clampMobileInput(value);
        setMobile(formatted);
        if (mobileState === 'error') {
          syncMobileState(formatted, consent);
          return;
        }
        syncMobileState(formatted, consent);
      }}
      consentAccepted={consent}
      onConsentChange={(accepted) => {
        setConsent(accepted);
        syncMobileState(mobile, accepted);
      }}
      onPrivacyClick={() => {
        void navigate(authJourneyPaths.privacy);
      }}
      onTermsClick={() => {
        void navigate(authJourneyPaths.terms);
      }}
      onBack={() => {
        void navigate(journeyPaths.root);
      }}
      onContinue={() => {
        void handleContinue();
      }}
    />
  );
}

export type AuthRoutesProps = {
  onAuthCompleted?: () => void;
};

function OtpRoute() {
  const navigate = useNavigate();
  const { session, updateSession } = useJourney();
  const auth = session.auth ?? {};
  const mobile = auth.mobile ?? '';

  const [otp, setOtp] = useState('');
  const [otpState, setOtpState] = useState<AuthOtpState>('default');
  const [otpErrorKind, setOtpErrorKind] = useState<'wrong' | 'expired' | null>(null);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resendAttempts, setResendAttempts] = useState(0);

  useEffect(() => {
    if (!mobile) {
      void navigate(authJourneyPaths.mobile, { replace: true });
    }
  }, [mobile, navigate]);

  useEffect(() => {
    if (resendCooldown === 0) {
      return;
    }
    const timer = window.setInterval(() => {
      setResendCooldown((seconds) => Math.max(seconds - 1, 0));
    }, 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, [resendCooldown]);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setOtpState('offline');
    }
  }, []);

  const handleVerify = async (code = otp) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setOtpState('offline');
      return;
    }
    if (code.length < OTP_LENGTH) {
      setOtpState('default');
      return;
    }
    if (isExpiredOtp(code)) {
      setOtpErrorKind('expired');
      setOtpState('error');
      return;
    }
    if (!isValidOtp(code)) {
      setOtpErrorKind('wrong');
      setOtpState('error');
      return;
    }

    setOtpState('verifying');
    await delay(800);

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setOtpState('network-error');
      return;
    }

    setOtpState('success');
    updateSession({ auth: { ...auth, otpVerified: true } });
    await delay(400);
    void navigate(authJourneyPaths.vehicleOwner);
  };

  const handleResend = () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setOtpState('resend-failed');
      return;
    }
    if (resendAttempts >= 1 && typeof navigator !== 'undefined' && !navigator.onLine) {
      setOtpState('resend-failed');
      return;
    }
    setResendAttempts((count) => count + 1);
    setOtp('');
    setOtpErrorKind(null);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    setOtpState('default');
  };

  return (
    <A2OtpScreen
      otpState={otpState}
      mobile={mobile}
      otpValue={otp}
      onOtpChange={(value) => {
        setOtp(value);
        if (value.length === OTP_LENGTH) {
          if (isExpiredOtp(value)) {
            setOtpErrorKind('expired');
            setOtpState('error');
            return;
          }
          if (!isValidOtp(value)) {
            setOtpErrorKind('wrong');
            setOtpState('error');
            return;
          }
          if (otpState !== 'verifying' && otpState !== 'success') {
            void handleVerify(value);
          }
          return;
        }
        if (otpState === 'error' || otpState === 'network-error' || otpState === 'resend-failed') {
          setOtpState(value.length > 0 ? 'typing' : 'default');
          setOtpErrorKind(null);
        } else if (value.length > 0) {
          setOtpState('typing');
        } else {
          setOtpState('default');
        }
      }}
      otpErrorKind={otpErrorKind}
      resendCooldownSeconds={resendCooldown}
      onResendOtp={() => {
        handleResend();
      }}
      onSmsFallback={() => {
        handleResend();
      }}
      onChangeNumber={() => {
        void navigate(authJourneyPaths.mobile);
      }}
      onBack={() => {
        void navigate(authJourneyPaths.mobile);
      }}
      onContinue={() => {
        void handleVerify();
      }}
    />
  );
}

function VehicleOwnerRoute({ onAuthCompleted }: AuthRoutesProps) {
  const navigate = useNavigate();
  const { session, updateSession } = useJourney();
  const auth = session.auth ?? {};

  const [name, setName] = useState(auth.ownerName ?? '');
  const [nameState, setNameState] = useState<AuthVehicleOwnerState>('empty');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!auth.otpVerified || !auth.mobile) {
      void navigate(authJourneyPaths.mobile, { replace: true });
    }
  }, [auth.mobile, auth.otpVerified, navigate]);

  useEffect(() => {
    if (name.trim()) {
      setNameState('filled');
    } else {
      setNameState('empty');
    }
  }, [name]);

  const handleContinue = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameState('empty');
      return;
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setNameState('error');
      return;
    }
    setSubmitting(true);
    setNameState('loading');
    await delay(500);
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setSubmitting(false);
      setNameState('error');
      return;
    }
    updateSession({ auth: { ...auth, ownerName: trimmed } });
    setSubmitting(false);
    onAuthCompleted?.();
  };

  return (
    <A3VehicleOwnerScreen
      nameValue={name}
      nameState={submitting ? 'loading' : nameState}
      onNameChange={(value) => {
        setName(value);
        if (nameState === 'error') {
          setNameState(value.trim() ? 'filled' : 'empty');
        }
      }}
      onBack={() => {
        void navigate(authJourneyPaths.otp);
      }}
      onContinue={() => {
        void handleContinue();
      }}
    />
  );
}

function PrivacyRoute() {
  const navigate = useNavigate();
  return (
    <L1PrivacyPolicyScreen
      onBack={() => {
        void navigate(authJourneyPaths.mobile);
      }}
      onContinue={() => {
        void navigate(authJourneyPaths.mobile);
      }}
    />
  );
}

function TermsRoute() {
  const navigate = useNavigate();
  return (
    <L2TermsConditionsScreen
      onBack={() => {
        void navigate(authJourneyPaths.mobile);
      }}
      onContinue={() => {
        void navigate(authJourneyPaths.mobile);
      }}
    />
  );
}

export function AuthRoutes({ onAuthCompleted }: AuthRoutesProps) {
  return (
    <AuthSegmentBootstrap>
      <Routes>
        <Route index element={<Navigate to="mobile" replace />} />
        <Route path="splash" element={<Navigate to="mobile" replace />} />
        <Route path="mobile" element={<MobileRoute />} />
        <Route path="otp" element={<OtpRoute />} />
        <Route path="vehicle-owner" element={<VehicleOwnerRoute onAuthCompleted={onAuthCompleted} />} />
        <Route path="legal/privacy" element={<PrivacyRoute />} />
        <Route path="legal/terms" element={<TermsRoute />} />
        <Route path="*" element={<Navigate to="mobile" replace />} />
      </Routes>
    </AuthSegmentBootstrap>
  );
}
