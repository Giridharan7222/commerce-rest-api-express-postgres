export interface UserResponseDto {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateUserDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: 'user' | 'admin';
}
export interface UpdateUserDto {
  email?: string;
  password?: string;
  nfirst_name: string;
  last_name: string;
  role?: 'user' | 'admin';
}
export interface LoginDto {
  email: string;
  password: string;
}
