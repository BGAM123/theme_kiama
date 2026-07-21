export interface LoginDTO {
  email: string;
  password: string;
}

export interface TokenDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  lastLoginAt: string | null;
  createdAt: string;
}
