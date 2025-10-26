export interface Permission {
  _id: string;
  name: string;
  description?: string;
}

export interface Role {
  _id: string;
  name: string;
  permissions: string[]; // hoặc Permission[]
}

// User (with sensitive info)
export interface User {
  _id: string;
  email: string;
  username: string;
  password?: string;
  roleId: string; // Role._id
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}