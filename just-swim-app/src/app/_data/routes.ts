const SIGNIN_ROUTE = {
  root: '/',
  signin: '/signin',
  signup: '/signup',
  type: '/signup/type',
  profile: '/signup/profile',
  complete: '/signup/complete',
};

const SCHEDULE_ROUTE = {
  root: '/schedule',
};

export const ROUTES = {
  ONBOARDING: { ...SIGNIN_ROUTE },
  SCHEDULE: { ...SCHEDULE_ROUTE },
};
