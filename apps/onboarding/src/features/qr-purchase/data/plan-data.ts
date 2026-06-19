export const safePlan = {
  name: 'Safe',
  price: '₹499/yr',
  features: ['Crash detection', '1 emergency contact', 'Basic roadside assist'],
} as const;

export const securePlan = {
  name: 'Secure',
  price: '₹999/yr',
  badge: 'MOST POPULAR',
  includesLabel: 'Includes everything in Safe',
  features: [
    'Automatic crash detection',
    'Ambulance + ₹3,000 cover',
    '3 contacts + AI calling',
    '₹1L accidental · ₹1k/day hospital',
    'Driver score & leaderboard',
  ],
  addon: { label: 'Rider cover · up to 2 · add-on' },
} as const;

export const checkoutLines = [
  { label: 'Secure plan', value: '₹999' },
  { label: 'Rider cover (2)', value: '₹199' },
  { label: 'GST (18%)', value: '₹216' },
] as const;

export const checkoutTotal = '₹1,414';
