export interface User {
  _id:string;
  id: string;
  firstName?: string;
  lastName: string;
  email: string;
  country: string;
  role: 'user' | 'admin';
  phoneNumber:string;
  mainBalance:string;
  referralCode?: string;

}

export interface VerifyOtp {
  email: string;
  otp: string;
}

export interface ResendOtp {
  email: string;
}

export interface ResendOtpResponse {
  message: string; // match what your API returns
}


export interface LoginCredentials {
  email: string;
  password: string;
}


export interface RegisterCredentials extends Omit<User, '_id'> {
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// types/auth.ts
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}


export interface Referral {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;      
  deposit_count: number; 
  referralStatus: "active" | "inactive" | string; // <- define possible values

  discount: string;       
}

export interface ReferralResponse {
  success: boolean;
  referrals: Referral[];
}


export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  Password: string;
}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
