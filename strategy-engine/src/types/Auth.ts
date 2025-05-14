export interface IAuthToken {
  token: string;
  expiresIn: number;
  type: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    level: string;
  };
  token: IAuthToken;
} 