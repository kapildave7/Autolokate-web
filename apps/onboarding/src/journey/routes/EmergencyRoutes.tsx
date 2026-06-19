import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import {
  E01RiderPromptScreen,
  E02RiderMobileScreen,
  E03RiderOtpScreen,
  E04RiderNameScreen,
  E05ContactsEmptyScreen,
  E06ContactMobileScreen,
  E07ContactOtpScreen,
  E08ContactNameScreen,
  E09ContactsSummaryScreen,
  E10RidersSummaryScreen,
} from '../../features/emergency/screens/index.js';
import { demoPickerContact } from '../../features/emergency/data/demo-data.js';
import { shouldSimulateRiderPromptLoadFailure } from '../../features/emergency/data/rider-prompt-demo.js';
import {
  canAddEmergencyContact,
  canAddRider,
  getContactsEmptyDescription,
  getEntitledRiderSlots,
  getRiderPromptDescription,
  shouldEnterRiderPrompt,
} from '../../features/emergency/emergency-limits.js';
import {
  isExpiredOtp,
  isValidEmergencyName,
  isValidMobile,
  isValidOtp,
  normalizeMobile,
  clampMobileInput,
} from '../../features/emergency/emergency.validation.js';
import {
  OTP_LENGTH,
  RESEND_COOLDOWN_SECONDS,
} from '../../features/shared-auth/auth-flow/auth-flow.validation.js';
import type { PurchaseCheckoutSession } from '../../features/qr-purchase/types-checkout.js';
import type {
  EmergencyContact,
  EmergencyNameFormState,
  EmergencyRider,
  EmergencyRiderPromptState,
  EmergencySession,
  RelationshipId,
} from '../../features/emergency/types.js';
import { getCompletedPath, getEmergencyFlowBackPath } from '../activation-routing.js';
import { resolveEmergencyFoundationContext } from '../emergency/emergency-foundation.js';
import { emergencyJourneyPaths } from '../emergency/emergency-routing.js';
import { useJourney } from '../JourneyContext.js';

const RIDER_LOAD_MS = 600;
const SAVE_RIDER_MS = 800;
const SAVE_CONTACT_MS = 800;
const VERIFY_OTP_MS = 800;

function EmergencySegmentBootstrap({ children }: { children: ReactNode }) {
  const { setPhase } = useJourney();

  useEffect(() => {
    setPhase('emergency');
  }, [setPhase]);

  return children;
}

function useEmergencySession() {
  const { session, updateSession } = useJourney();
  const emergency = session.emergency ?? {};

  const patchEmergency = useCallback(
    (patch: Partial<EmergencySession>) => {
      updateSession({
        emergency: {
          ...emergency,
          ...patch,
        },
      });
    },
    [emergency, updateSession],
  );

  return { emergency, patchEmergency };
}

function useEmergencyFoundation() {
  const { session } = useJourney();
  return resolveEmergencyFoundationContext(session);
}

function useOnlineState() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

function upsertRider(riders: EmergencyRider[] | undefined, nextRider: EmergencyRider): EmergencyRider[] {
  const existing = riders ?? [];
  const withoutDuplicate = existing.filter((rider) => rider.mobile !== nextRider.mobile);
  return [...withoutDuplicate, nextRider];
}

function LegacyRiderSetupRedirect() {
  return <Navigate to={emergencyJourneyPaths.riderPrompt} replace />;
}

function hasRiderEntitlementInPurchaseSession(
  purchase: PurchaseCheckoutSession | undefined,
): boolean {
  return purchase?.selectedPlanId !== undefined && purchase.riderCount !== undefined;
}

function resolveR0InitialViewState(
  isOnline: boolean,
  loadFailed: boolean,
  purchase: PurchaseCheckoutSession | undefined,
): EmergencyRiderPromptState {
  if (!isOnline) {
    return 'offline';
  }
  if (loadFailed) {
    return 'error';
  }
  if (hasRiderEntitlementInPurchaseSession(purchase)) {
    return 'default';
  }
  return 'loading';
}

function R0Route() {
  const navigate = useNavigate();
  const { selectedFlow, session } = useJourney();
  const { emergency, patchEmergency } = useEmergencySession();
  const purchase = session.purchase;
  const { planId, riderCount } = useEmergencyFoundation();
  const isOnline = useOnlineState();
  const entitledSlots = getEntitledRiderSlots(planId, riderCount);
  const [viewState, setViewState] = useState<EmergencyRiderPromptState>(() =>
    resolveR0InitialViewState(
      typeof navigator === 'undefined' ? true : navigator.onLine,
      Boolean(emergency.riderPromptLoadFailed),
      purchase,
    ),
  );
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    if (!shouldEnterRiderPrompt(planId, riderCount)) {
      return;
    }
    if (!isOnline) {
      setViewState('offline');
      return;
    }
    if (emergency.riderPromptLoadFailed) {
      setViewState('error');
      return;
    }

    const entitlementKnown = hasRiderEntitlementInPurchaseSession(purchase);
    if (entitlementKnown && loadAttempt === 0) {
      setViewState('default');
      patchEmergency({ riderPromptLoadFailed: false });
      return;
    }

    setViewState('loading');
    const timer = window.setTimeout(() => {
      if (shouldSimulateRiderPromptLoadFailure(planId, riderCount, loadAttempt)) {
        patchEmergency({ riderPromptLoadFailed: true });
        setViewState('error');
        return;
      }
      patchEmergency({ riderPromptLoadFailed: false });
      setViewState('default');
    }, RIDER_LOAD_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    emergency.riderPromptLoadFailed,
    isOnline,
    loadAttempt,
    patchEmergency,
    planId,
    purchase,
    riderCount,
  ]);

  if (!shouldEnterRiderPrompt(planId, riderCount)) {
    return <Navigate to={emergencyJourneyPaths.contactsEmpty} replace />;
  }

  return (
    <E01RiderPromptScreen
      viewState={viewState}
      description={getRiderPromptDescription(entitledSlots)}
      onBack={() => {
        void navigate(getEmergencyFlowBackPath(selectedFlow, session));
      }}
      onContinue={() => {
        if (viewState === 'error') {
          patchEmergency({ riderPromptLoadFailed: false });
          setLoadAttempt((attempt) => attempt + 1);
          return;
        }
        if (viewState !== 'default') {
          return;
        }
        patchEmergency({ riderSkipped: false });
        void navigate(emergencyJourneyPaths.riderMobile);
      }}
      onFooterSecondary={() => {
        patchEmergency({ riderSkipped: true, rider: undefined });
        void navigate(emergencyJourneyPaths.contactsEmpty);
      }}
    />
  );
}

function R1Route() {
  const navigate = useNavigate();
  const { emergency, patchEmergency } = useEmergencySession();
  const isOnline = useOnlineState();
  const [mobile, setMobile] = useState(emergency.rider?.mobile ?? '');
  const [mobileState, setMobileState] = useState<'default' | 'error' | 'offline'>(
    isOnline ? 'default' : 'offline',
  );

  useEffect(() => {
    setMobileState((current) => {
      if (!isOnline) {
        return 'offline';
      }
      return current === 'offline' ? 'default' : current;
    });
  }, [isOnline]);

  return (
    <E02RiderMobileScreen
      mobileState={mobileState}
      mobileValue={mobile}
      onMobileChange={(value) => {
        setMobile(clampMobileInput(value));
        if (mobileState === 'error') {
          setMobileState('default');
        }
      }}
      onBack={() => {
        void navigate(emergencyJourneyPaths.riderPrompt);
      }}
      onContinue={() => {
        if (!isOnline) {
          setMobileState('offline');
          return;
        }
        if (!isValidMobile(mobile)) {
          setMobileState('error');
          return;
        }
        patchEmergency({
          rider: {
            mobile: normalizeMobile(mobile),
            name: emergency.rider?.name ?? '',
            relation: emergency.rider?.relation ?? 'spouse',
          },
        });
        void navigate(emergencyJourneyPaths.riderOtp);
      }}
    />
  );
}

function R2Route() {
  const navigate = useNavigate();
  const { emergency, patchEmergency } = useEmergencySession();
  const mobile = emergency.rider?.mobile ?? '';
  const [otp, setOtp] = useState('');
  const [otpState, setOtpState] = useState<'default' | 'error' | 'verifying' | 'network-error'>(
    'default',
  );
  const [otpErrorKind, setOtpErrorKind] = useState<'wrong' | 'expired' | null>(null);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(RESEND_COOLDOWN_SECONDS);
  const isOnline = useOnlineState();

  useEffect(() => {
    if (resendCooldownSeconds <= 0) {
      return;
    }
    const timer = window.setTimeout(() => {
      setResendCooldownSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => {
      window.clearTimeout(timer);
    };
  }, [resendCooldownSeconds]);

  const verifyOtp = useCallback(() => {
    if (!isOnline) {
      setOtpState('network-error');
      return;
    }
    if (otp.length < OTP_LENGTH) {
      setOtpState('error');
      setOtpErrorKind('wrong');
      return;
    }
    if (isExpiredOtp(otp)) {
      setOtpState('error');
      setOtpErrorKind('expired');
      return;
    }
    if (!isValidOtp(otp)) {
      setOtpState('error');
      setOtpErrorKind('wrong');
      return;
    }
    setOtpState('verifying');
    window.setTimeout(() => {
      patchEmergency({
        rider: emergency.rider
          ? { ...emergency.rider, mobile }
          : { mobile, name: '', relation: 'spouse' },
      });
      void navigate(emergencyJourneyPaths.riderName);
    }, VERIFY_OTP_MS);
  }, [emergency.rider, isOnline, mobile, navigate, otp, patchEmergency]);

  return (
    <E03RiderOtpScreen
      otpState={otpState}
      mobile={mobile}
      otpValue={otp}
      onOtpChange={(value) => {
        setOtp(value);
        if (otpState === 'error' || otpState === 'network-error') {
          setOtpState('default');
          setOtpErrorKind(null);
        }
      }}
      otpErrorKind={otpErrorKind}
      resendCooldownSeconds={resendCooldownSeconds}
      onResendOtp={() => {
        setResendCooldownSeconds(RESEND_COOLDOWN_SECONDS);
        setOtpState('default');
        setOtpErrorKind(null);
      }}
      onChangeNumber={() => {
        void navigate(emergencyJourneyPaths.riderMobile);
      }}
      onBack={() => {
        void navigate(emergencyJourneyPaths.riderMobile);
      }}
      onContinue={verifyOtp}
    />
  );
}

function R3Route() {
  const navigate = useNavigate();
  const { emergency, patchEmergency } = useEmergencySession();
  const isOnline = useOnlineState();
  const [name, setName] = useState(emergency.rider?.name ?? '');
  const [relation, setRelation] = useState<RelationshipId | undefined>(emergency.rider?.relation);
  const [formState, setFormState] = useState<EmergencyNameFormState>('default');

  return (
    <E04RiderNameScreen
      nameValue={name}
      onNameChange={setName}
      relation={relation}
      onRelationChange={setRelation}
      formState={formState}
      onBack={() => {
        void navigate(emergencyJourneyPaths.riderOtp);
      }}
      onContinue={() => {
        const riderMobile = emergency.rider?.mobile;
        if (!isValidEmergencyName(name) || !relation || !riderMobile) {
          return;
        }
        setFormState('submitting');
        window.setTimeout(() => {
          if (!isOnline) {
            setFormState('error');
            return;
          }
          const savedRider: EmergencyRider = {
            mobile: riderMobile,
            name: name.trim(),
            relation,
          };
          patchEmergency({
            rider: savedRider,
            riders: upsertRider(emergency.riders, savedRider),
          });
          void navigate(emergencyJourneyPaths.ridersSummary);
        }, SAVE_RIDER_MS);
      }}
    />
  );
}

function R4Route() {
  const navigate = useNavigate();
  const { emergency, patchEmergency } = useEmergencySession();
  const { planId, riderCount } = useEmergencyFoundation();
  const riders = emergency.riders ?? (emergency.rider ? [emergency.rider] : []);

  if (riders.length === 0) {
    return <Navigate to={emergencyJourneyPaths.riderName} replace />;
  }

  return (
    <E10RidersSummaryScreen
      riders={riders}
      planId={planId}
      purchasedRiderSlots={riderCount}
      onBack={() => {
        void navigate(emergencyJourneyPaths.riderName);
      }}
      onAddAnother={() => {
        if (!canAddRider(riders.length, planId, riderCount)) {
          return;
        }
        patchEmergency({
          rider: {
            mobile: '',
            name: '',
            relation: 'spouse',
          },
        });
        void navigate(emergencyJourneyPaths.riderMobile);
      }}
      onContinue={() => {
        void navigate(emergencyJourneyPaths.contactsEmpty);
      }}
    />
  );
}

function E0Route() {
  const navigate = useNavigate();
  const { selectedFlow, session } = useJourney();
  const { emergency, patchEmergency } = useEmergencySession();
  const { planId, riderCount } = useEmergencyFoundation();

  return (
    <E05ContactsEmptyScreen
      description={getContactsEmptyDescription(planId)}
      onBack={() => {
        if (emergency.riderSkipped) {
          void navigate(getEmergencyFlowBackPath(selectedFlow, session));
          return;
        }
        const riders = emergency.riders ?? (emergency.rider ? [emergency.rider] : []);
        if (riders.length > 0) {
          void navigate(emergencyJourneyPaths.ridersSummary);
          return;
        }
        if (shouldEnterRiderPrompt(planId, riderCount)) {
          void navigate(emergencyJourneyPaths.riderPrompt);
          return;
        }
        void navigate(getEmergencyFlowBackPath(selectedFlow, session));
      }}
      onContinue={() => {
        patchEmergency({
          contactDraft: {
            name: demoPickerContact.name,
            mobile: demoPickerContact.mobile,
            relation: demoPickerContact.relation,
            fromPicker: true,
            otpVerified: true,
          },
        });
        void navigate(emergencyJourneyPaths.contactName);
      }}
      onFooterSecondary={() => {
        patchEmergency({ contactDraft: { fromPicker: false, otpVerified: false } });
        void navigate(emergencyJourneyPaths.contactMobile);
      }}
    />
  );
}

function E1Route() {
  const navigate = useNavigate();
  const { emergency, patchEmergency } = useEmergencySession();
  const isOnline = useOnlineState();
  const [mobile, setMobile] = useState(emergency.contactDraft?.mobile ?? '');
  const [mobileState, setMobileState] = useState<'default' | 'error' | 'offline'>(
    isOnline ? 'default' : 'offline',
  );

  useEffect(() => {
    setMobileState((current) => {
      if (!isOnline) {
        return 'offline';
      }
      return current === 'offline' ? 'default' : current;
    });
  }, [isOnline]);

  return (
    <E06ContactMobileScreen
      mobileState={mobileState}
      mobileValue={mobile}
      onMobileChange={(value) => {
        setMobile(clampMobileInput(value));
        if (mobileState === 'error') {
          setMobileState('default');
        }
      }}
      onBack={() => {
        const backPath =
          (emergency.contacts?.length ?? 0) > 0
            ? emergencyJourneyPaths.contactsSummary
            : emergencyJourneyPaths.contactsEmpty;
        void navigate(backPath);
      }}
      onContinue={() => {
        if (!isOnline) {
          setMobileState('offline');
          return;
        }
        if (!isValidMobile(mobile)) {
          setMobileState('error');
          return;
        }
        patchEmergency({
          contactDraft: {
            ...emergency.contactDraft,
            mobile: normalizeMobile(mobile),
            fromPicker: false,
            otpVerified: false,
          },
        });
        void navigate(emergencyJourneyPaths.contactOtp);
      }}
    />
  );
}

function E2Route() {
  const navigate = useNavigate();
  const { emergency, patchEmergency } = useEmergencySession();
  const mobile = emergency.contactDraft?.mobile ?? '';
  const [otp, setOtp] = useState('');
  const [otpState, setOtpState] = useState<'default' | 'error' | 'verifying' | 'network-error'>(
    'default',
  );
  const [otpErrorKind, setOtpErrorKind] = useState<'wrong' | 'expired' | null>(null);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(RESEND_COOLDOWN_SECONDS);
  const isOnline = useOnlineState();

  useEffect(() => {
    if (resendCooldownSeconds <= 0) {
      return;
    }
    const timer = window.setTimeout(() => {
      setResendCooldownSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => {
      window.clearTimeout(timer);
    };
  }, [resendCooldownSeconds]);

  const verifyOtp = useCallback(() => {
    if (!isOnline) {
      setOtpState('network-error');
      return;
    }
    if (otp.length < OTP_LENGTH) {
      setOtpState('error');
      setOtpErrorKind('wrong');
      return;
    }
    if (isExpiredOtp(otp)) {
      setOtpState('error');
      setOtpErrorKind('expired');
      return;
    }
    if (!isValidOtp(otp)) {
      setOtpState('error');
      setOtpErrorKind('wrong');
      return;
    }
    setOtpState('verifying');
    window.setTimeout(() => {
      patchEmergency({
        contactDraft: {
          ...emergency.contactDraft,
          mobile,
          otpVerified: true,
        },
      });
      void navigate(emergencyJourneyPaths.contactName);
    }, VERIFY_OTP_MS);
  }, [emergency.contactDraft, isOnline, mobile, navigate, otp, patchEmergency]);

  return (
    <E07ContactOtpScreen
      otpState={otpState}
      mobile={mobile}
      otpValue={otp}
      onOtpChange={(value) => {
        setOtp(value);
        if (otpState === 'error' || otpState === 'network-error') {
          setOtpState('default');
          setOtpErrorKind(null);
        }
      }}
      otpErrorKind={otpErrorKind}
      resendCooldownSeconds={resendCooldownSeconds}
      onResendOtp={() => {
        setResendCooldownSeconds(RESEND_COOLDOWN_SECONDS);
        setOtpState('default');
        setOtpErrorKind(null);
      }}
      onChangeNumber={() => {
        void navigate(emergencyJourneyPaths.contactMobile);
      }}
      onBack={() => {
        void navigate(emergencyJourneyPaths.contactMobile);
      }}
      onContinue={verifyOtp}
    />
  );
}

function E3Route() {
  const navigate = useNavigate();
  const { emergency, patchEmergency } = useEmergencySession();
  const isOnline = useOnlineState();
  const draft = emergency.contactDraft;
  const [name, setName] = useState(draft?.name ?? '');
  const [relation, setRelation] = useState<RelationshipId | undefined>(draft?.relation);
  const [formState, setFormState] = useState<EmergencyNameFormState>('default');

  return (
    <E08ContactNameScreen
      nameValue={name}
      onNameChange={(value) => {
        setName(value);
        if (formState === 'error') {
          setFormState('default');
        }
      }}
      relation={relation}
      onRelationChange={setRelation}
      formState={formState}
      onBack={() => {
        if (draft?.fromPicker) {
          void navigate(emergencyJourneyPaths.contactsEmpty);
          return;
        }
        void navigate(emergencyJourneyPaths.contactOtp);
      }}
      onContinue={() => {
        const mobile = draft?.mobile;
        if (!draft || !isValidEmergencyName(name) || !relation || !mobile) {
          return;
        }
        setFormState('submitting');
        window.setTimeout(() => {
          if (!isOnline) {
            setFormState('error');
            return;
          }
          const nextContact: EmergencyContact = {
            name: name.trim(),
            mobile,
            relation,
            verified: Boolean(draft.otpVerified ?? draft.fromPicker),
          };
          const existing = emergency.contacts ?? [];
          patchEmergency({
            contacts: [...existing, nextContact],
            contactDraft: undefined,
          });
          void navigate(emergencyJourneyPaths.contactsSummary);
        }, SAVE_CONTACT_MS);
      }}
    />
  );
}

function E5Route() {
  const navigate = useNavigate();
  const { setPhase } = useJourney();
  const { emergency, patchEmergency } = useEmergencySession();
  const { planId } = useEmergencyFoundation();
  const contacts = emergency.contacts ?? [];

  return (
    <E09ContactsSummaryScreen
      contacts={contacts}
      planId={planId}
      onBack={() => {
        void navigate(emergencyJourneyPaths.contactsEmpty);
      }}
      onAddAnother={() => {
        if (!canAddEmergencyContact(contacts.length, planId)) {
          return;
        }
        patchEmergency({ contactDraft: { fromPicker: false, otpVerified: false } });
        void navigate(emergencyJourneyPaths.contactMobile);
      }}
      onContinue={() => {
        setPhase('completed');
        void navigate(getCompletedPath());
      }}
    />
  );
}

function EmergencyWildcardRedirect() {
  const { session, selectedFlow } = useJourney();

  if (selectedFlow === 'purchase' && session.purchase?.paymentStatus === 'success') {
    return <Navigate to={emergencyJourneyPaths.contactsEmpty} replace />;
  }

  return <Navigate to={emergencyJourneyPaths.riderPrompt} replace />;
}

export function EmergencyRoutes() {
  return (
    <EmergencySegmentBootstrap>
      <Routes>
        <Route path="rider-setup" element={<LegacyRiderSetupRedirect />} />
        <Route path="rider-prompt" element={<R0Route />} />
        <Route path="rider-mobile" element={<R1Route />} />
        <Route path="rider-otp" element={<R2Route />} />
        <Route path="rider-name" element={<R3Route />} />
        <Route path="riders-summary" element={<R4Route />} />
        <Route path="contacts-empty" element={<E0Route />} />
        <Route path="contact-mobile" element={<E1Route />} />
        <Route path="contact-otp" element={<E2Route />} />
        <Route path="contact-name" element={<E3Route />} />
        <Route path="contacts-summary" element={<E5Route />} />
        <Route path="*" element={<EmergencyWildcardRedirect />} />
      </Routes>
    </EmergencySegmentBootstrap>
  );
}
