import { useMemo, useState, type ReactElement } from 'react';
import { setThemeMode } from '@autolokate/design-system';
import { AlButton, AlHeading, AlStack, AlText } from '@autolokate/ui';

import type { PrepaidScreenState } from '../features/qr-prepaid/types.js';
import { PR01PrepaidEntryScreen } from '../features/qr-prepaid/screens/pr01-prepaid-entry/index.js';
import { PR02ActivationCodeScreen } from '../features/qr-prepaid/screens/pr02-activation-code/index.js';
import { PR03CodeValidationScreen } from '../features/qr-prepaid/screens/pr03-code-validation/index.js';
import { QrScanScreen } from '../features/qr-activation/screens/index.js';
import { demoMobileDisplay, demoOtp } from '../features/shared-auth/data/demo-data.js';
import {
  A1MobileScreen,
  A2OtpScreen,
  A3VehicleOwnerScreen,
  S0SplashScreen,
} from '../features/shared-auth/screens/index.js';
import { L1PrivacyPolicyScreen } from '../features/shared-legal/screens/l1-privacy-policy/index.js';
import { L2TermsConditionsScreen } from '../features/shared-legal/screens/l2-terms-conditions/index.js';
import type { AuthMobileState, AuthOtpState } from '../features/shared-auth/types.js';
import { R01VehicleNumberScreen } from '../features/purchase-activation/screens/r01-vehicle-number/index.js';
import { R02VehicleDetailsScreen } from '../features/purchase-activation/screens/r02-vehicle-details/index.js';
import { R05AccountCreationScreen } from '../features/purchase-activation/screens/r05-account-creation/index.js';
import { R06LegalConsentScreen } from '../features/purchase-activation/screens/r06-legal-consent/index.js';
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
} from '../features/emergency/screens/index.js';
import type { PurchaseScreenState } from '../features/qr-purchase/types.js';
import { P01PlanSelectionScreen } from '../features/qr-purchase/screens/p01-plan-selection/index.js';
import { P02PlanDetailsScreen } from '../features/qr-purchase/screens/p02-plan-details/index.js';
import { P03RiderSelectionScreen } from '../features/qr-purchase/screens/p03-rider-selection/index.js';
import { P04CheckoutSummaryScreen } from '../features/qr-purchase/screens/p04-checkout-summary/index.js';
import { P05PaymentProcessingScreen } from '../features/qr-purchase/screens/p05-payment-processing/index.js';
import { P06PaymentSuccessScreen } from '../features/qr-purchase/screens/p06-payment-success/index.js';
import { R03VehicleNumberScreen } from '../features/qr-purchase/screens/r03-vehicle-number/index.js';
import { R04FetchingVehicleScreen } from '../features/qr-purchase/screens/r04-fetching-vehicle/index.js';
import { R04bFetchFailedScreen } from '../features/qr-purchase/screens/r04b-fetch-failed/index.js';
import { R05ConfirmVehicleScreen } from '../features/qr-purchase/screens/r05-confirm-vehicle/index.js';
import { R08OrderSummaryScreen } from '../features/qr-purchase/screens/r08-order-summary/index.js';
import { R08bPromoAppliedScreen } from '../features/qr-purchase/screens/r08b-promo-applied/index.js';
import { R06ChoosePlanScreen } from '../features/qr-purchase/screens/r06-choose-plan/index.js';
import { DEFAULT_PURCHASE_PLAN_ID } from '../features/qr-purchase/data/purchase-plans.js';
import type { PurchasePlanId } from '../features/qr-purchase/types-checkout.js';
import { R07RiderCoverScreen } from '../features/qr-purchase/screens/r07-rider-cover/index.js';
import { R09ProcessingPaymentScreen } from '../features/qr-purchase/screens/r09-processing-payment/index.js';
import { R10PaymentSuccessScreen } from '../features/qr-purchase/screens/r10-payment-success/index.js';
import { R10bPaymentFailedScreen } from '../features/qr-purchase/screens/r10b-payment-failed/index.js';
import { R14PermissionsScreen } from '../features/qr-purchase/screens/r14-permissions/index.js';
import { R15ActivationCompleteScreen } from '../features/qr-purchase/screens/r15-activation-complete/index.js';
import { DEFAULT_PURCHASE_PERMISSIONS } from '../features/qr-purchase/types-checkout.js';
import type { PurchaseVehiclePlateState } from '../features/qr-purchase/types-vehicle.js';
import { demoPlate } from '../features/purchase-activation/data/demo-data.js';
import type { ScreenViewState } from '../types/flow.js';

const demoMobile = demoMobileDisplay;

import '../styles/dev-preview.css';

type SharedDevScreen = {
  id: string;
  label: string;
  group: 'shared';
  render: () => ReactElement;
};

type SharedAuthStateScreen = {
  id: string;
  label: string;
  group: 'shared';
  render: (state: AuthMobileState | AuthOtpState) => ReactElement;
};

type PurchaseVehicleDevScreen = {
  id: 'r03';
  label: string;
  group: 'purchase';
  render: (state: PurchaseVehiclePlateState) => ReactElement;
};

type PurchasePhaseAStatusDevScreen = {
  id: 'r04' | 'r04b' | 'r05';
  label: string;
  group: 'purchase';
  render: () => ReactElement;
};

type PurchaseStatusDevScreen = {
  id: string;
  label: string;
  group: 'purchase';
  render: () => ReactElement;
};

type PurchaseDevScreen = {
  id: string;
  label: string;
  group: 'purchase';
  render: (state: PurchaseScreenState) => ReactElement;
};

type PrepaidDevScreen = {
  id: string;
  label: string;
  group: 'prepaid';
  render: (state: PrepaidScreenState) => ReactElement;
};

export type EmergencyDevState = 'default' | 'error' | 'offline' | 'loading' | 'network-error';

type EmergencyDevScreen = {
  id: string;
  label: string;
  group: 'emergency';
  states: readonly EmergencyDevState[];
  render: (state: EmergencyDevState) => ReactElement;
};

const emergencySummaryContact = {
  name: 'Anita Sharma',
  mobile: demoMobile,
  relation: 'spouse' as const,
  verified: true,
};

const emergencyRider = {
  name: 'Rahul Sharma',
  mobile: demoMobile,
  relation: 'child' as const,
};

const emergencyScreens: EmergencyDevScreen[] = [
  {
    id: 'e01',
    label: 'E01 · R0 Rider prompt',
    group: 'emergency',
    states: ['default', 'loading', 'error', 'offline'],
    render: (state) => (
      <E01RiderPromptScreen
        viewState={
          state === 'loading'
            ? 'loading'
            : state === 'error'
              ? 'error'
              : state === 'offline'
                ? 'offline'
                : 'default'
        }
      />
    ),
  },
  {
    id: 'e02',
    label: 'E02 · R1 Rider mobile',
    group: 'emergency',
    states: ['default', 'error', 'offline'],
    render: (state) => (
      <E02RiderMobileScreen
        mobileState={
          state === 'error' ? 'error' : state === 'offline' ? 'offline' : 'default'
        }
      />
    ),
  },
  {
    id: 'e03',
    label: 'E03 · R2 Rider OTP',
    group: 'emergency',
    states: ['default', 'error', 'loading', 'network-error'],
    render: (state) => (
      <E03RiderOtpScreen
        mobile={demoMobile}
        otpState={
          state === 'loading'
            ? 'verifying'
            : state === 'network-error'
              ? 'network-error'
              : state === 'error'
                ? 'error'
                : 'default'
        }
        otpErrorKind={state === 'error' ? 'wrong' : null}
        resendCooldownSeconds={state === 'default' ? 24 : 0}
      />
    ),
  },
  {
    id: 'e04',
    label: 'E04 · R3 Rider name',
    group: 'emergency',
    states: ['default', 'loading', 'error'],
    render: (state) => (
      <E04RiderNameScreen
        relation="spouse"
        nameValue="Rahul Sharma"
        formState={
          state === 'loading' ? 'submitting' : state === 'error' ? 'error' : 'default'
        }
      />
    ),
  },
  {
    id: 'e05',
    label: 'E05 · E0 Contacts empty',
    group: 'emergency',
    states: ['default'],
    render: () => <E05ContactsEmptyScreen />,
  },
  {
    id: 'e06',
    label: 'E06 · E1 Contact mobile',
    group: 'emergency',
    states: ['default', 'error', 'offline'],
    render: (state) => (
      <E06ContactMobileScreen
        mobileState={
          state === 'error' ? 'error' : state === 'offline' ? 'offline' : 'default'
        }
      />
    ),
  },
  {
    id: 'e07',
    label: 'E07 · E2 Contact OTP',
    group: 'emergency',
    states: ['default', 'error', 'loading', 'network-error'],
    render: (state) => (
      <E07ContactOtpScreen
        mobile={demoMobile}
        otpState={
          state === 'loading'
            ? 'verifying'
            : state === 'network-error'
              ? 'network-error'
              : state === 'error'
                ? 'error'
                : 'default'
        }
        otpErrorKind={state === 'error' ? 'wrong' : null}
        resendCooldownSeconds={state === 'default' ? 24 : 0}
      />
    ),
  },
  {
    id: 'e08',
    label: 'E08 · E3 Contact name',
    group: 'emergency',
    states: ['default', 'error'],
    render: (state) => (
      <E08ContactNameScreen
        relation={state === 'error' ? undefined : 'spouse'}
        nameValue={state === 'error' ? '' : 'Anita Sharma'}
      />
    ),
  },
  {
    id: 'e09',
    label: 'E09 · E5 Contacts summary',
    group: 'emergency',
    states: ['default', 'error'],
    render: (state) => (
      <E09ContactsSummaryScreen
        planId={state === 'error' ? 'shield' : 'secure'}
        contacts={
          state === 'error'
            ? [
                emergencySummaryContact,
                { ...emergencySummaryContact, name: 'Ravi Mehta', mobile: '9876543211' },
                { ...emergencySummaryContact, name: 'Priya Shah', mobile: '9876543212' },
              ]
            : [emergencySummaryContact]
        }
      />
    ),
  },
  {
    id: 'e10',
    label: 'E10 · R4 Riders summary',
    group: 'emergency',
    states: ['default', 'error'],
    render: (state) => (
      <E10RidersSummaryScreen
        planId="secure"
        purchasedRiderSlots={2}
        riders={
          state === 'error'
            ? [emergencyRider, { ...emergencyRider, name: 'Sneha Sharma', mobile: '9876543211' }]
            : [emergencyRider]
        }
      />
    ),
  },
];

const sharedAuthScreens: SharedAuthStateScreen[] = [
  {
    id: 's0',
    label: 'S0 · Splash',
    group: 'shared',
    render: () => <S0SplashScreen />,
  },
  {
    id: 'a1-empty',
    label: 'A1 · Mobile · Empty',
    group: 'shared',
    render: () => <A1MobileScreen mobileState="empty" />,
  },
  {
    id: 'a1-filled',
    label: 'A1 · Mobile · Filled',
    group: 'shared',
    render: () => <A1MobileScreen mobileState="filled" mobileValue="99999 99999" />,
  },
  {
    id: 'a1-ready',
    label: 'A1 · Mobile · Ready',
    group: 'shared',
    render: () => (
      <A1MobileScreen mobileState="ready" mobileValue="99999 99999" consentAccepted />
    ),
  },
  {
    id: 'a1-error',
    label: 'A1 · Mobile · Error',
    group: 'shared',
    render: () => (
      <A1MobileScreen mobileState="error" mobileValue="99999 99999" consentAccepted />
    ),
  },
  {
    id: 'a1-offline',
    label: 'A1 · Mobile · Offline',
    group: 'shared',
    render: () => (
      <A1MobileScreen mobileState="offline" mobileValue="99999 99999" consentAccepted />
    ),
  },
  {
    id: 'a2-default',
    label: 'A2 · OTP · Default',
    group: 'shared',
    render: () => <A2OtpScreen mobile="9999999999" resendCooldownSeconds={24} />,
  },
  {
    id: 'a2-typing',
    label: 'A2 · OTP · Typing',
    group: 'shared',
    render: () => <A2OtpScreen otpState="typing" mobile="9999999999" otpValue="123" />,
  },
  {
    id: 'a2-verifying',
    label: 'A2 · OTP · Verifying',
    group: 'shared',
    render: () => (
      <A2OtpScreen otpState="verifying" mobile="9999999999" otpValue={demoOtp} />
    ),
  },
  {
    id: 'a2-success',
    label: 'A2 · OTP · Success',
    group: 'shared',
    render: () => (
      <A2OtpScreen otpState="success" mobile="9999999999" otpValue={demoOtp} />
    ),
  },
  {
    id: 'a2-error',
    label: 'A2 · OTP · Error',
    group: 'shared',
    render: () => (
      <A2OtpScreen
        otpState="error"
        mobile="9999999999"
        otpValue="111111"
        otpErrorKind="wrong"
        resendCooldownSeconds={0}
      />
    ),
  },
  {
    id: 'a2-network',
    label: 'A2 · OTP · Network error',
    group: 'shared',
    render: () => (
      <A2OtpScreen otpState="network-error" mobile="9999999999" otpValue={demoOtp} />
    ),
  },
  {
    id: 'a2-resend',
    label: 'A2 · OTP · Resend',
    group: 'shared',
    render: () => (
      <A2OtpScreen otpState="resend" mobile="9999999999" otpValue={demoOtp} resendCooldownSeconds={0} />
    ),
  },
  {
    id: 'a2-resend-failed',
    label: 'A2 · OTP · Resend failed',
    group: 'shared',
    render: () => (
      <A2OtpScreen otpState="resend-failed" mobile="9999999999" otpValue={demoOtp} />
    ),
  },
  {
    id: 'a3-empty',
    label: 'A3 · Vehicle owner · Empty',
    group: 'shared',
    render: () => <A3VehicleOwnerScreen />,
  },
  {
    id: 'a3-filled',
    label: 'A3 · Vehicle owner · Filled',
    group: 'shared',
    render: () => <A3VehicleOwnerScreen nameValue="Kapil Sharma" nameState="filled" />,
  },
  {
    id: 'qr-scan',
    label: 'R01 · Scan sticker (pre-auth · not in journey)',
    group: 'shared',
    render: () => <QrScanScreen />,
  },
  {
    id: 'l1',
    label: 'L1 · Privacy Policy',
    group: 'shared',
    render: () => <L1PrivacyPolicyScreen />,
  },
  {
    id: 'l2',
    label: 'L2 · Terms & Conditions',
    group: 'shared',
    render: () => <L2TermsConditionsScreen />,
  },
];

const deprecatedPurchaseScreens: SharedDevScreen[] = [
  {
    id: 'r01',
    label: 'R01 · Vehicle Number (deprecated)',
    group: 'shared',
    render: () => <R01VehicleNumberScreen />,
  },
  {
    id: 'r02',
    label: 'R02 · Vehicle Details (deprecated)',
    group: 'shared',
    render: () => <R02VehicleDetailsScreen />,
  },
  {
    id: 'r05',
    label: 'R05 · Account Creation (deprecated)',
    group: 'shared',
    render: () => <R05AccountCreationScreen />,
  },
  {
    id: 'r06',
    label: 'R06 · Legal Consent (deprecated)',
    group: 'shared',
    render: () => <R06LegalConsentScreen />,
  },
];

const purchasePhaseAScreens: (PurchaseVehicleDevScreen | PurchasePhaseAStatusDevScreen)[] = [
  {
    id: 'r03',
    label: 'R03 · Vehicle number',
    group: 'purchase',
    render: (state) => (
      <R03VehicleNumberScreen
        plateValue={state === 'empty' ? '' : demoPlate}
        plateState={state}
      />
    ),
  },
  {
    id: 'r04',
    label: 'R04 · Fetching details',
    group: 'purchase',
    render: () => <R04FetchingVehicleScreen />,
  },
  {
    id: 'r04b',
    label: 'R04b · Fetch failed',
    group: 'purchase',
    render: () => <R04bFetchFailedScreen />,
  },
  {
    id: 'r05',
    label: 'R05 · Confirm vehicle',
    group: 'purchase',
    render: () => <R05ConfirmVehicleScreen />,
  },
];

const purchasePhaseBScreens: PurchaseStatusDevScreen[] = [
  {
    id: 'r06-plan',
    label: 'R06 · Choose plan',
    group: 'purchase',
    render: () => <></>,
  },
  {
    id: 'r07',
    label: 'R07 · Rider cover',
    group: 'purchase',
    render: () => (
      <R07RiderCoverScreen
        selectedPlanId="secure"
        selectedRiderCount={1}
        onSelectRiderCount={() => undefined}
      />
    ),
  },
  {
    id: 'r08',
    label: 'R08 · Order summary',
    group: 'purchase',
    render: () => <R08OrderSummaryScreen selectedPlanId="secure" riderCount={1} />,
  },
  {
    id: 'r08b',
    label: 'R08b · Promo applied',
    group: 'purchase',
    render: () => (
      <R08bPromoAppliedScreen selectedPlanId="secure" riderCount={1} promoCode="FRIEND50" />
    ),
  },
];

const purchasePhaseCScreens: PurchaseStatusDevScreen[] = [
  {
    id: 'r09',
    label: 'R09 · Processing payment',
    group: 'purchase',
    render: () => <R09ProcessingPaymentScreen />,
  },
  {
    id: 'r10',
    label: 'R10 · Payment success (terminal)',
    group: 'purchase',
    render: () => <R10PaymentSuccessScreen selectedPlanId="secure" paidAmountInr={1948} />,
  },
  {
    id: 'r10b',
    label: 'R10b · Payment failed',
    group: 'purchase',
    render: () => <R10bPaymentFailedScreen />,
  },
];

/** Archived purchase screens — kept for component preview, not in active journey. */
const archivedPurchaseScreens: PurchaseStatusDevScreen[] = [
  {
    id: 'r14',
    label: 'R14 · Permissions (archived)',
    group: 'purchase',
    render: () => (
      <R14PermissionsScreen
        permissions={{ ...DEFAULT_PURCHASE_PERMISSIONS }}
        onTogglePermission={() => undefined}
      />
    ),
  },
  {
    id: 'r14b',
    label: 'R14b · Permissions · all on (archived)',
    group: 'purchase',
    render: () => (
      <R14PermissionsScreen
        permissions={{ location: true, crashDetection: true, notifications: true }}
        onTogglePermission={() => undefined}
      />
    ),
  },
  {
    id: 'r15',
    label: 'R15 · Activation complete (archived)',
    group: 'purchase',
    render: () => (
      <R15ActivationCompleteScreen selectedPlanId="secure" plate="MH 12 AB 3456" />
    ),
  },
];

const purchaseScreens: PurchaseDevScreen[] = [
  {
    id: 'p01',
    label: 'P01 · Plan Selection',
    group: 'purchase',
    render: (state) => <P01PlanSelectionScreen state={state} />,
  },
  {
    id: 'p02',
    label: 'P02 · Plan Details',
    group: 'purchase',
    render: (state) => <P02PlanDetailsScreen state={state} />,
  },
  {
    id: 'p03',
    label: 'P03 · Rider Selection',
    group: 'purchase',
    render: (state) => <P03RiderSelectionScreen state={state} />,
  },
  {
    id: 'p04',
    label: 'P04 · Checkout Summary',
    group: 'purchase',
    render: (state) => <P04CheckoutSummaryScreen state={state} />,
  },
  {
    id: 'p05',
    label: 'P05 · Payment Processing',
    group: 'purchase',
    render: (state) => <P05PaymentProcessingScreen state={state} />,
  },
  {
    id: 'p06',
    label: 'P06 · Payment Success',
    group: 'purchase',
    render: (state) => <P06PaymentSuccessScreen state={state} />,
  },
];

const prepaidScreens: PrepaidDevScreen[] = [
  {
    id: 'pr01',
    label: 'PR01 · Pre-paid Entry',
    group: 'prepaid',
    render: (state) => <PR01PrepaidEntryScreen state={state} />,
  },
  {
    id: 'pr02',
    label: 'PR02 · Activation Code',
    group: 'prepaid',
    render: (state) => <PR02ActivationCodeScreen state={state} />,
  },
  {
    id: 'pr03',
    label: 'PR03 · Code Validation',
    group: 'prepaid',
    render: (state) => <PR03CodeValidationScreen state={state} />,
  },
];

const sharedStates: ScreenViewState[] = ['default', 'loading', 'error', 'empty', 'success'];
const purchaseVehicleStates: PurchaseVehiclePlateState[] = ['empty', 'filled', 'error', 'loading'];
const purchaseStates: PurchaseScreenState[] = ['default', 'loading', 'error', 'success'];
const r06PlanStates: PurchasePlanId[] = ['safe', 'secure', 'shield', 'shield-plus'];
const prepaidStates: PrepaidScreenState[] = ['default', 'loading', 'error', 'success'];
const emergencyStates: EmergencyDevState[] = ['default', 'error', 'offline', 'loading', 'network-error'];

const viewportWidths = [320, 360, 375, 390, 414] as const;
const THEME_KEY = 'al-onboarding-theme';

const allSharedSidebarScreens = [...sharedAuthScreens, ...deprecatedPurchaseScreens];

const defaultSharedScreen = allSharedSidebarScreens[0] as SharedAuthStateScreen;

export function ScreenDevApp() {
  const [activeScreen, setActiveScreen] = useState('s0');
  const [activeState, setActiveState] = useState<string>('default');
  const [viewportWidth, setViewportWidth] = useState<number>(390);
  const [showChrome, setShowChrome] = useState(true);
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  });

  const toggleTheme = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
    document.documentElement.setAttribute('data-theme', next);
    window.localStorage.setItem(THEME_KEY, next);
    setThemeModeState(next);
  };

  const isPrepaid = activeScreen.startsWith('pr');
  const isEmergency = activeScreen.startsWith('e');
  const isPurchasePhaseA = ['r03', 'r04', 'r04b', 'r05'].includes(activeScreen);
  const isPurchasePhaseB = ['r06-plan', 'r07', 'r08', 'r08b'].includes(activeScreen);
  const isPurchasePhaseC = ['r09', 'r10', 'r10b'].includes(activeScreen);
  const isPurchaseArchived = ['r14', 'r14b', 'r15'].includes(activeScreen);
  const isPurchaseLegacy = activeScreen.startsWith('p') && !isPrepaid;
  const isSharedAuthFrame =
    activeScreen.startsWith('s0') ||
    activeScreen.startsWith('a1') ||
    activeScreen.startsWith('a2') ||
    activeScreen.startsWith('l');
  const sharedAuthEntry = sharedAuthScreens.find((screen) => screen.id === activeScreen);
  const deprecatedEntry = deprecatedPurchaseScreens.find((screen) => screen.id === activeScreen);
  const purchasePhaseAEntry = purchasePhaseAScreens.find((screen) => screen.id === activeScreen);
  const purchasePhaseBEntry = purchasePhaseBScreens.find((screen) => screen.id === activeScreen);
  const purchasePhaseCEntry = purchasePhaseCScreens.find((screen) => screen.id === activeScreen);
  const purchaseArchivedEntry = archivedPurchaseScreens.find((screen) => screen.id === activeScreen);
  const purchaseEntry = purchaseScreens.find((screen) => screen.id === activeScreen);
  const prepaidEntry = prepaidScreens.find((screen) => screen.id === activeScreen);
  const emergencyEntry = emergencyScreens.find((screen) => screen.id === activeScreen);
  const stateOptions = isEmergency
    ? (emergencyEntry?.states ?? emergencyStates)
    : activeScreen === 'r06-plan'
      ? r06PlanStates
    : isPrepaid
      ? prepaidStates
      : isPurchasePhaseA && activeScreen === 'r03'
        ? purchaseVehicleStates
        : isPurchaseLegacy
          ? purchaseStates
          : isSharedAuthFrame
            ? []
            : sharedStates;

  const resolvedSharedState = useMemo((): ScreenViewState => {
    if (sharedStates.includes(activeState as ScreenViewState)) {
      return activeState as ScreenViewState;
    }
    return 'default';
  }, [activeState]);

  const resolvedPurchaseVehicleState = useMemo((): PurchaseVehiclePlateState => {
    if (purchaseVehicleStates.includes(activeState as PurchaseVehiclePlateState)) {
      return activeState as PurchaseVehiclePlateState;
    }
    return 'empty';
  }, [activeState]);

  const resolvedPurchaseState = useMemo((): PurchaseScreenState => {
    if (purchaseStates.includes(activeState as PurchaseScreenState)) {
      return activeState as PurchaseScreenState;
    }
    return 'default';
  }, [activeState]);

  const resolvedPrepaidState = useMemo((): PrepaidScreenState => {
    if (prepaidStates.includes(activeState as PrepaidScreenState)) {
      return activeState as PrepaidScreenState;
    }
    return 'default';
  }, [activeState]);

  const resolvedEmergencyState = useMemo((): EmergencyDevState => {
    if (emergencyStates.includes(activeState as EmergencyDevState)) {
      return activeState as EmergencyDevState;
    }
    return 'default';
  }, [activeState]);

  const resolvedR06PlanId = useMemo((): PurchasePlanId => {
    if (r06PlanStates.includes(activeState as PurchasePlanId)) {
      return activeState as PurchasePlanId;
    }
    return DEFAULT_PURCHASE_PLAN_ID;
  }, [activeState]);

  const activeStateMatches = (state: string) =>
    resolvedSharedState === state ||
    resolvedPurchaseVehicleState === state ||
    resolvedPurchaseState === state ||
    resolvedPrepaidState === state ||
    resolvedEmergencyState === state;

  return (
    <div className="ob-dev">
      {showChrome ? (
        <aside className="ob-dev__panel">
          <AlStack gap="md">
            <AlHeading variant="h3">Onboarding · Dev preview</AlHeading>
            <AlText tone="muted">Shared + Purchase + Prepaid + Emergency — no routing or API</AlText>
            <AlText variant="label">Shared Auth (Figma 91:268)</AlText>
            <AlStack gap="xs">
              {sharedAuthScreens.map((screen) => (
                <AlButton
                  key={screen.id}
                  size="sm"
                  variant={activeScreen === screen.id ? 'primary' : 'secondary'}
                  onClick={() => {
                    setActiveScreen(screen.id);
                    setActiveState('default');
                  }}
                >
                  {screen.label}
                </AlButton>
              ))}
            </AlStack>
            <AlText variant="label">Purchase activation (deprecated)</AlText>
            <AlStack gap="xs">
              {deprecatedPurchaseScreens.map((screen) => (
                <AlButton
                  key={screen.id}
                  size="sm"
                  variant={activeScreen === screen.id ? 'primary' : 'secondary'}
                  onClick={() => {
                    setActiveScreen(screen.id);
                    setActiveState('default');
                  }}
                >
                  {screen.label}
                </AlButton>
              ))}
            </AlStack>
            <AlText variant="label">Purchase · Phase A (R03–R05)</AlText>
            <AlStack gap="xs">
              {purchasePhaseAScreens.map((screen) => (
                <AlButton
                  key={screen.id}
                  size="sm"
                  variant={activeScreen === screen.id ? 'primary' : 'secondary'}
                  onClick={() => {
                    setActiveScreen(screen.id);
                    setActiveState(screen.id === 'r03' ? 'empty' : 'default');
                  }}
                >
                  {screen.label}
                </AlButton>
              ))}
            </AlStack>
            <AlText variant="label">Purchase · Phase B (R06–R08b)</AlText>
            <AlStack gap="xs">
              {purchasePhaseBScreens.map((screen) => (
                <AlButton
                  key={screen.id}
                  size="sm"
                  variant={activeScreen === screen.id ? 'primary' : 'secondary'}
                  onClick={() => {
                    setActiveScreen(screen.id);
                    setActiveState(screen.id === 'r06-plan' ? DEFAULT_PURCHASE_PLAN_ID : 'default');
                  }}
                >
                  {screen.label}
                </AlButton>
              ))}
            </AlStack>
            <AlText variant="label">Purchase · Phase C (R09–R10 · terminal)</AlText>
            <AlStack gap="xs">
              {purchasePhaseCScreens.map((screen) => (
                <AlButton
                  key={screen.id}
                  size="sm"
                  variant={activeScreen === screen.id ? 'primary' : 'secondary'}
                  onClick={() => {
                    setActiveScreen(screen.id);
                    setActiveState('default');
                  }}
                >
                  {screen.label}
                </AlButton>
              ))}
            </AlStack>
            <AlText variant="label">Purchase · Archived (not in journey)</AlText>
            <AlStack gap="xs">
              {archivedPurchaseScreens.map((screen) => (
                <AlButton
                  key={screen.id}
                  size="sm"
                  variant={activeScreen === screen.id ? 'primary' : 'secondary'}
                  onClick={() => {
                    setActiveScreen(screen.id);
                    setActiveState('default');
                  }}
                >
                  {screen.label}
                </AlButton>
              ))}
            </AlStack>
            <AlText variant="label">Purchase (Phase 5 legacy)</AlText>
            <AlStack gap="xs">
              {purchaseScreens.map((screen) => (
                  <AlButton
                    key={screen.id}
                    size="sm"
                    variant={activeScreen === screen.id ? 'primary' : 'secondary'}
                    onClick={() => {
                      setActiveScreen(screen.id);
                      setActiveState('default');
                    }}
                  >
                    {screen.label}
                  </AlButton>
                ))}
            </AlStack>
            <AlText variant="label">Prepaid (Phase 7)</AlText>
            <AlStack gap="xs">
              {prepaidScreens.map((screen) => (
                  <AlButton
                    key={screen.id}
                    size="sm"
                    variant={activeScreen === screen.id ? 'primary' : 'secondary'}
                    onClick={() => {
                      setActiveScreen(screen.id);
                      setActiveState('default');
                    }}
                  >
                    {screen.label}
                  </AlButton>
                ))}
            </AlStack>
            <AlText variant="label">Emergency (Phase 11b)</AlText>
            <AlStack gap="xs">
              {emergencyScreens.map((screen) => (
                <AlButton
                  key={screen.id}
                  size="sm"
                  variant={activeScreen === screen.id ? 'primary' : 'secondary'}
                  onClick={() => {
                    setActiveScreen(screen.id);
                    setActiveState('default');
                  }}
                >
                  {screen.label}
                </AlButton>
              ))}
            </AlStack>
            {stateOptions.length > 0 ? (
              <>
                <AlText variant="label">View state</AlText>
                <div className="ob-dev__state-row">
                  {stateOptions.map((state) => (
                    <AlButton
                      key={state}
                      size="sm"
                      variant={activeStateMatches(state) ? 'primary' : 'secondary'}
                      onClick={() => {
                        setActiveState(state);
                      }}
                    >
                      {state}
                    </AlButton>
                  ))}
                </div>
              </>
            ) : null}
            <AlText variant="label">Viewport width</AlText>
            <div className="ob-dev__state-row">
              {viewportWidths.map((width) => (
                <AlButton
                  key={width}
                  size="sm"
                  variant={viewportWidth === width ? 'primary' : 'secondary'}
                  onClick={() => {
                    setViewportWidth(width);
                  }}
                >
                  {width}
                </AlButton>
              ))}
            </div>
            <AlText variant="label">Theme</AlText>
            <div className="ob-dev__state-row">
              <AlButton
                size="sm"
                variant={themeMode === 'dark' ? 'primary' : 'secondary'}
                onClick={() => {
                  if (themeMode !== 'dark') {
                    toggleTheme();
                  }
                }}
              >
                Dark
              </AlButton>
              <AlButton
                size="sm"
                variant={themeMode === 'light' ? 'primary' : 'secondary'}
                onClick={() => {
                  if (themeMode !== 'light') {
                    toggleTheme();
                  }
                }}
              >
                Light
              </AlButton>
            </div>
            <AlButton
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowChrome(false);
              }}
            >
              Hide panel
            </AlButton>
          </AlStack>
        </aside>
      ) : (
        <button
          type="button"
          className="ob-dev__reopen"
          onClick={() => {
            setShowChrome(true);
          }}
        >
          Show panel
        </button>
      )}
      <div
        className="ob-dev__viewport"
        style={{ ['--ob-dev-viewport-width' as string]: `${String(viewportWidth)}px` }}
      >
        <div className="ob-dev__frame">
          {isEmergency && emergencyEntry
            ? emergencyEntry.render(resolvedEmergencyState)
            : isPrepaid && prepaidEntry
              ? prepaidEntry.render(resolvedPrepaidState)
              : isPurchasePhaseA && purchasePhaseAEntry
                ? purchasePhaseAEntry.id === 'r03'
                  ? purchasePhaseAEntry.render(resolvedPurchaseVehicleState)
                  : purchasePhaseAEntry.render()
                : isPurchasePhaseB && purchasePhaseBEntry
                  ? purchasePhaseBEntry.id === 'r06-plan'
                    ? (
                        <R06ChoosePlanScreen
                          selectedPlanId={resolvedR06PlanId}
                          onSelectPlan={(planId) => {
                            setActiveState(planId);
                          }}
                          showBack={false}
                        />
                      )
                    : purchasePhaseBEntry.render()
                : isPurchasePhaseC && purchasePhaseCEntry
                  ? purchasePhaseCEntry.render()
                : isPurchaseArchived && purchaseArchivedEntry
                  ? purchaseArchivedEntry.render()
                : isPurchaseLegacy && purchaseEntry
                  ? purchaseEntry.render(resolvedPurchaseState)
                : sharedAuthEntry
                  ? sharedAuthEntry.render('default')
                  : deprecatedEntry
                    ? deprecatedEntry.render()
                    : defaultSharedScreen.render('default')}
        </div>
      </div>
    </div>
  );
}
