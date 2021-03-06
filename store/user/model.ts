export interface UserLoginReducerInterface {
  token: string;
  role: string;
  loadingLogin: boolean;
}

export interface UserReducerInterface {
  id: string;
  name: string;
  email: string;
  user: string;
  companyName: string;
  birth: Date;
  profileImage: string;
  token?: string;
  phone?: string;
  address?: string;
  role?: string;

  loadingProfile: boolean;
  loadingLogin: boolean;
}
