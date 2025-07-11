export interface UserRegistration {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}