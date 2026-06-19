/** API route definitions — single source of truth for backend paths. */
export const endpoints = {
  auth: {
    requestOtp: '/auth/otp/request',
    verifyOtp: '/auth/otp/verify',
    refresh: '/auth/session/refresh',
    logout: '/auth/session/logout',
    me: '/auth/me',
  },
  vehicles: {
    list: '/vehicles',
    detail: (vehicleId: string) => `/vehicles/${vehicleId}`,
    create: '/vehicles',
  },
  plans: {
    list: '/plans',
    detail: (planId: string) => `/plans/${planId}`,
  },
} as const;

export type EndpointGroup = keyof typeof endpoints;
