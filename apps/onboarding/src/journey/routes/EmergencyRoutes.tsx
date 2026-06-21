import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AlPermissionSheet } from '@autolokate/ui';

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
import {
  pickDeviceContactWithStatus,
  shouldShowAddFromContactsCTA,
} from '../../utils/device-contact-picker.js';
import { shouldSimulateRiderPromptLoadFailure } from '../../features/emergency/data/rider-prompt-demo.js';
import {
  canAddEmergencyContact,
  canAddRider,
  getContactsSummaryRiderContext,
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

const RIDER_SKIP_CONFIRM_TITLE = 'Continue without adding a rider?';
const RIDER_SKIP_CONFIRM_BODY =
  'You can always add riders later from your vehicle profile. Adding a rider allows another trusted person to receive emergency alerts and access plan benefits.';

function R0Route() {
  const navigate = useNavigate();
  const { selectedFlow, session, setPhase } = useJourney();
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
  const [skipConfirmOpen, setSkipConfirmOpen] = useState(false);

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

    if (hasRiderEntitlementInPurchaseSession(purchase) && loadAttempt === 0) {
      setViewState('default');
      return;
    }

    setViewState('loading');
    const timer = window.setTimeout(() => {
      if (shouldSimulateRiderPromptLoadFailure(planId, riderCount, loadAttempt)) {
        patchEmergency({ riderPromptLoadFailed: true });
        setViewState('error');
        return;
      }
      setViewState('default');
    }, RIDER_LOAD_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    emergency.riderPromptLoadFailed,
    isOnline,
    loadAttempt,
    planId,
    purchase?.riderCount,
    purchase?.selectedPlanId,
    riderCount,
  ]);

  if (!shouldEnterRiderPrompt(planId, riderCount)) {
    return <Navigate to={emergencyJourneyPaths.contactsEmpty} replace />;
  }

  if (emergency.riderSkipped) {
    return <Navigate to={getCompletedPath()} replace />;
  }

  const finishWithoutRider = () => {
    setSkipConfirmOpen(false);
    patchEmergency({ riderSkipped: true, rider: undefined });
    setPhase('completed');
    void navigate(getCompletedPath());
  };

  return (
    <>
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
        if (viewState === 'offline' || viewState === 'loading') {
          return;
        }
        patchEmergency({
          riderSkipped: false,
          rider: emergency.rider ?? { mobile: '', name: '', relation: 'spouse' },
        });
        void navigate(emergencyJourneyPaths.riderMobile);
      }}
      footerSecondaryLabel="Skip for now"
      onFooterSecondary={() => {
        setSkipConfirmOpen(true);
      }}
    />
      <AlPermissionSheet
        open={skipConfirmOpen}
        title={RIDER_SKIP_CONFIRM_TITLE}
        description={RIDER_SKIP_CONFIRM_BODY}
        primaryLabel="Add Rider"
        onPrimary={() => {
          setSkipConfirmOpen(false);
        }}
        secondaryLabel="Continue Without Rider"
        onSecondary={finishWithoutRider}
        onDismiss={() => {
          setSkipConfirmOpen(false);
        }}
      />
    </>
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
  const [otpState, setOtpState] = useState<
    'default' | 'error' | 'verifying' | 'network-error' | 'success'
  >('default');
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

  const verifyOtp = useCallback(
    (code = otp) => {
      if (!isOnline) {
        setOtpState('network-error');
        return;
      }
      if (code.length < OTP_LENGTH) {
        setOtpState('error');
        setOtpErrorKind('wrong');
        return;
      }
      if (isExpiredOtp(code)) {
        setOtpState('error');
        setOtpErrorKind('expired');
        return;
      }
      if (!isValidOtp(code)) {
        setOtpState('error');
        setOtpErrorKind('wrong');
        return;
      }
      setOtpState('verifying');
      window.setTimeout(() => {
        setOtpState('success');
        patchEmergency({
          rider: emergency.rider
            ? { ...emergency.rider, mobile }
            : { mobile, name: '', relation: 'spouse' },
        });
        window.setTimeout(() => {
          void navigate(emergencyJourneyPaths.riderName);
        }, 400);
      }, VERIFY_OTP_MS);
    },
    [emergency.rider, isOnline, mobile, navigate, otp, patchEmergency],
  );

  return (
    <E03RiderOtpScreen
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
            verifyOtp(value);
          }
          return;
        }
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
  const [relation, setRelation] = useState<RelationshipId | undefined>(
    emergency.rider?.relation ?? 'spouse',
  );
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
  const { setPhase } = useJourney();
  const { emergency, patchEmergency } = useEmergencySession();
  const { planId, riderCount } = useEmergencyFoundation();
  const riders = emergency.riders ?? (emergency.rider ? [emergency.rider] : []);
  const contacts = emergency.contacts ?? [];

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
        if (contacts.length > 0) {
          setPhase('completed');
          void navigate(getCompletedPath());
          return;
        }
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
  const showAddFromContacts = shouldShowAddFromContactsCTA();

  const goToManualEntry = useCallback(() => {
    patchEmergency({ contactDraft: { fromPicker: false, otpVerified: false } });
    void navigate(emergencyJourneyPaths.contactMobile);
  }, [navigate, patchEmergency]);

  const applyPickedContact = useCallback(
    (picked: { name: string; mobile: string }) => {
      patchEmergency({
        contactDraft: {
          name: picked.name,
          mobile: picked.mobile,
          fromPicker: true,
          otpVerified: false,
        },
      });
      void navigate(emergencyJourneyPaths.contactMobile);
    },
    [navigate, patchEmergency],
  );

  const handlePickFromContacts = useCallback(() => {
    void (async () => {
      const result = await pickDeviceContactWithStatus();
      if (result.outcome === 'picked') {
        applyPickedContact(result.contact);
        return;
      }
      if (result.outcome === 'cancelled') {
        return;
      }
      goToManualEntry();
    })();
  }, [applyPickedContact, goToManualEntry]);

  if (emergency.riderSkipped) {
    return <Navigate to={getCompletedPath()} replace />;
  }

  return (
    <E05ContactsEmptyScreen
      showAddFromContacts={showAddFromContacts}
      onBack={() => {
        const contactCount = emergency.contacts?.length ?? 0;
        if (selectedFlow === 'purchase' && contactCount === 0) {
          void navigate(getEmergencyFlowBackPath(selectedFlow, session));
          return;
        }
        if (emergency.riderSkipped) {
          void navigate(getCompletedPath());
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
      onContinue={showAddFromContacts ? handlePickFromContacts : goToManualEntry}
      onFooterSecondary={goToManualEntry}
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
  const [otpState, setOtpState] = useState<
    'default' | 'error' | 'verifying' | 'network-error' | 'success'
  >('default');
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

  const verifyOtp = useCallback(
    (code = otp) => {
      if (!isOnline) {
        setOtpState('network-error');
        return;
      }
      if (code.length < OTP_LENGTH) {
        setOtpState('error');
        setOtpErrorKind('wrong');
        return;
      }
      if (isExpiredOtp(code)) {
        setOtpState('error');
        setOtpErrorKind('expired');
        return;
      }
      if (!isValidOtp(code)) {
        setOtpState('error');
        setOtpErrorKind('wrong');
        return;
      }
      setOtpState('verifying');
      window.setTimeout(() => {
        setOtpState('success');
        patchEmergency({
          contactDraft: {
            ...emergency.contactDraft,
            mobile,
            otpVerified: true,
          },
        });
        window.setTimeout(() => {
          void navigate(emergencyJourneyPaths.contactName);
        }, 400);
      }, VERIFY_OTP_MS);
    },
    [emergency.contactDraft, isOnline, mobile, navigate, otp, patchEmergency],
  );

  return (
    <E07ContactOtpScreen
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
            verifyOtp(value);
          }
          return;
        }
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
  const [relation, setRelation] = useState<RelationshipId | undefined>(
    draft?.relation ?? (draft?.fromPicker ? undefined : 'spouse'),
  );
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
            verified: Boolean(draft.otpVerified),
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
  const { planId, riderCount } = useEmergencyFoundation();
  const contacts = emergency.contacts ?? [];
  const riders = emergency.riders ?? (emergency.rider ? [emergency.rider] : []);
  const riderContext = getContactsSummaryRiderContext(
    planId,
    riderCount,
    riders.length,
    emergency.riderSkipped,
  );

  const goToRiderSetup = () => {
    patchEmergency({ riderSkipped: false });
    if (riders.length === 0) {
      void navigate(emergencyJourneyPaths.riderPrompt);
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
  };

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
        if (riderContext.shouldEnterRiderFlowOnContinue) {
          goToRiderSetup();
          return;
        }
        setPhase('completed');
        void navigate(getCompletedPath());
      }}
    />
  );
}

function EmergencyWildcardRedirect() {
  const { session, selectedFlow } = useJourney();
  const emergency = session.emergency ?? {};
  const { planId, riderCount } = resolveEmergencyFoundationContext(session);

  if (emergency.riderSkipped) {
    return <Navigate to={getCompletedPath()} replace />;
  }

  if (selectedFlow === 'purchase' && session.purchase?.paymentStatus === 'success') {
    return <Navigate to={emergencyJourneyPaths.contactsEmpty} replace />;
  }

  if (!shouldEnterRiderPrompt(planId, riderCount)) {
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
