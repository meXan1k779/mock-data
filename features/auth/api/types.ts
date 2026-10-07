export interface ApiError {
  data?: {
    message: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    nickname: string;
    email: string;
    role: string;
    Content: number;
    description: string;
    views: number;
    votes: number;
    iconUrl: string | null;
    aboutYou: string;
    phoneNumber: string;
    birthDate: string;
    gender: string;
    city: string;
    avatarUrl: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  id: string;
  nickname: string;
  email: string;
  role: string;
  Content: number;
  description: string;
  views: number;
  votes: number;
  iconUrl: string | null;
  aboutYou: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  city: string;
  avatarUrl: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface NewPasswordRequest {
  email: string;
  hash: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UserUpdate {
  nickname?: string;
  aboutYou?: string;
  experience?: string;
  phoneNumber?: string;
  birthDate?: string;
  gender?: string;
  city?: string;
  accessToken?: string;
}
