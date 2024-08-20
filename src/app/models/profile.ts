export type ProfileRole = 'manager' | 'user';

export type Profile = {
  name: string;
  email: string;
  role: ProfileRole;
};
