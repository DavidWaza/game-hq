export type User = {
  id: string;
  username: string;
  email: string;
};
export type DataFromLogin = {
  token: string;
  user: User;
};
