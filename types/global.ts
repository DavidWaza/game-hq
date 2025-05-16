
export type User = {
  id: number;
  email: string;
  email_verified_at: string | null;
  remember_token: string | null;
  created_at: string | null;
  updated_at: string | null;
  username: string;
  wallet: {
    id: string;
    user_id: string;
    balance: string;
    created_at: string | null;
    updated_at: string | null;
  };
  public_wagers: [];
  private_wagers: [];
};
export type TypeUserSearch = {
  id: number;
  username: string;
  email: string;
  email_verified_at: string;
  remember_token: string;
  created_at: string;
  updated_at: string;
};
export type UserFromAuth = {
  id: string;
  username: string;
  email: string;
};
export type DataFromLogin = {
  token: string;
  user: UserFromAuth;
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
  title: string;
  game: TypeGames,
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

export type CreatedGames = {
  banner: string;
  category_id: string;
  description: string;
  name: string;
  game_image: string;
  id: string;
  records: []
}
export type TypeWallet = {
  banner: string;
  category_id: string;
  description: string;
  name: string;
  game_image: string;
  id: string;
  records: []
}
