export interface SignupRequest {
  email: string;
  password: string;
}

export interface UserRoles {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isDriver: boolean;
  isVendor: boolean;
  isVendorFoods: boolean;
  isVendorItems: boolean;
}

export interface UserName {
  first: string;
  last: string;
}

export interface AllNames {
  full: string;
  first: string;
  last: string;
}

export interface User {
  allNames: AllNames;
  __hash: string;
  __type: string;
  id: string;
  username: string;
  email: string;
  password: string;
  roles: UserRoles;
  name: UserName;
  photo: string | null;
  phone: string | null;
  isVerified: boolean;
  authTypes: string[];
  lastSignedInAt: number;
  signedUpAt: number;
  referrer: string | null;
}

export interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
