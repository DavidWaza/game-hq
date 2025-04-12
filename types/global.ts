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
export type TypeGames = {
  category_id: string;
  description: string;
  game_image: string;
  id: string;
  name: string;
  created_at: string | null;
  updated_at: string | null;
};
export type TypeSingleTournament = {
  amount: string;
  bet_on: string;
  game_image: string;
  category_id: string;
  description: string;
  id: string;
  match_time: string;
  number_of_participants: string;
  user_id: number;
  created_at: string | null;
  updated_at: string | null;
};
