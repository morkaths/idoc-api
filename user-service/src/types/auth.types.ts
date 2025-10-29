export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  permissions?: Permission[];
}

// User (with sensitive info)
export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  roles: Role[];
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}