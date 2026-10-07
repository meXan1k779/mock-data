export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  role: Role;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangeEmailData {
  newEmail: string;
  currentPassword: string;
}

export interface Role {
  admin: 'admin';
  user: 'user';
  moderator: 'moderator';
}
