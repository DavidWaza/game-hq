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
  banner: string;
  sub_banner: string[];
  video_banner: string;
  sub_video: string[];
  theme_settings: string
};
export type TypeSingleTournament = {
  amount: string;
  game_id: string;
  description: string;
  id: string;
  match_time: string;
  match_date: string;
  number_of_participants: number;
  user_id: number;
  created_at: string | null;
  updated_at: string | null;
};
