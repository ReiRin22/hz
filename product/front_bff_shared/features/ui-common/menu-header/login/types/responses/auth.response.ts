export type LoginResponse = {
  userId: string;
  userName: string;
  role: string;
  token: string;
};

export type LoginErrorResponse = {
  errorCode: 'E004' | 'E500';
  message: string;
};
