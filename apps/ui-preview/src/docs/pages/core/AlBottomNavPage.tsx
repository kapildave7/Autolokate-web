import { useState } from 'react';
import { AlIcon } from '@autolokate/icons';
import { AlBottomNav } from '@autolokate/ui';

import {
  CoreComponentShowcase,
  type ShowcaseState,
} from '../../components/CoreComponentShowcase.js';

const navItems = [
  { id: 'home', label: 'Home', icon: <AlIcon name="house" size={20} aria-hidden /> },
  { id: 'services', label: 'Services', icon: <AlIcon name="store" size={20} aria-hidden /> },
  { id: 'community', label: 'Community', icon: <AlIcon name="users" size={20} aria-hidden /> },
  { id: 'profile', label: 'Profile', icon: <AlIcon name="circle-user" size={20} aria-hidden /> },
];

function BottomNavStatePreview({ state }: { state: ShowcaseState }) {
  const [active, setActive] = useState('home');
  const disabled = state === 'disabled';

  return (
    <AlBottomNav
      items={navItems.map((item) => ({
        ...item,
        active: item.id === active,
        onClick: disabled
          ? undefined
          : () => {
              setActive(item.id);
            },
      }))}
      style={disabled ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
    />
  );
}

function renderBottomNavState(state: ShowcaseState) {
  return <BottomNavStatePreview state={state} />;
}

export function AlBottomNavPage() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <CoreComponentShowcase
      name="AlBottomNav"
      description="Four-tab mobile shell navigation for consumer home."
      whenToUse="Primary app navigation on mobile surfaces."
      whenNotToUse="Desktop sidebar navigation or modal flows."
      overview={
        <p>
          Home · Services · Community · Profile tabs matching Figma AlBottomNav with house, store,
          users, and circle-user icons.
        </p>
      }
      variants={
        <AlBottomNav
          items={navItems.map((item, index) => ({
            ...item,
            active: index === 0,
          }))}
        />
      }
      renderStatePreview={renderBottomNavState}
      accessibility={
        <p>
          Each tab exposes a visible label. Icon-only tabs must include an accessible name via{' '}
          <code>aria-label</code> on the control or visible text beneath the icon.
        </p>
      }
      usage={
        <AlBottomNav
          items={navItems.map((item) => ({
            ...item,
            active: item.id === activeTab,
            onClick: () => {
              setActiveTab(item.id);
            },
          }))}
        />
      }
      code={`import { AlBottomNav } from '@autolokate/ui';
import { AlIcon } from '@autolokate/icons';

<AlBottomNav
  items={[
    { id: 'home', label: 'Home', icon: <AlIcon name="house" size={20} />, active: true },
    { id: 'profile', label: 'Profile', icon: <AlIcon name="circle-user" size={20} /> },
  ]}
/>`}
      props={[
        { name: 'items', type: 'AlBottomNavItem[]', description: 'Tab definitions with icon and handler.' },
        { name: 'items[].active', type: 'boolean', description: 'Current tab state.' },
        { name: 'items[].onClick', type: '() => void', description: 'Tab selection handler.' },
      ]}
    />
  );
}
