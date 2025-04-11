export type User = {
  id: string;
  username: string;
  email: string;
};
export type DataFromLogin = {
  token: string;
  user: User;
};
export type TypeCategories = {
  id: string;
  name: string;
  category_image: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
  tournaments: [];
};
