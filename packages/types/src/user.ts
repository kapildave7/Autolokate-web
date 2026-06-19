export type UserId = string;

export type User = {
  id: UserId;
  mobile: string;
  displayName: string | null;
  locale: string;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = Pick<User, 'id' | 'displayName' | 'mobile' | 'locale'>;
