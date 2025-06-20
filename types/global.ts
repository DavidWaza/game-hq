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
  message: string;
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
  gameurl: string | null;
  gametype: 'invite' | 'tournament' | 'both' | null;
  platformtype: string | null;
  maxplayers: number | null | string;
};
export type TypePlayer = {
  id: number;
  name: string;
  status: "ready" | "not ready" | "disconnected";
  captain: boolean;
  isConnected: boolean;
  previousStatus?: "ready" | "not ready";
  socketId?: string;
  online?: boolean;
};
export type TypeChatMessage = {
  id: string;
  sender: string;
  message: string;
  time: string;
  type: "system" | "user";
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
export type TypePrivateWager = {
  id: string;
  game_id: string;
  users: string;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
  users_username: string;
  title: string;
  description: string;
  amount: string;
  match_date: string;
  match_time: string;
  user: User
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
export type TypePaymentMethods = {
  id: string;
  user_id: string;
  name: string;
  display_name: string;
  provider: string;
  settings: null;
  is_active: boolean;
  min_amount: string;
  max_amount: string;
  fee_percentage: string;
  fee_fixed: string;
  created_at: string | null;
  updated_at: string | null;
};
export type TypeTransactionsArray = {
  id: string;
  user_id: string;
  transaction_type_id: string;
  payment_method_id: string;
  reference_number: string;
  amount: string;
  fee: string;
  net_amount: string;
  balance_before: string;
  balance_after: string;
  status: string;
  description: string;
  metadata: null;
  external_transaction_id: null;
  external_reference: null;
  approved_by: null;
  approved_at: null;
  admin_notes: null;
  processed_at: null;
  created_at: null;
  updated_at: null;
  transaction_type: {
    id: string;
    name: string;
    display_name: string;
    is_active: string;
    created_at: string;
    updated_at: null;
  };
  payment_method: {
    id: string;
    user_id: string;
    name: string;
    display_name: string;
    provider: string;
    settings: null;
    is_active: boolean;
    min_amount: string;
    max_amount: string;
    fee_percentage: string;
    fee_fixed: string;
    created_at: null;
    updated_at: null;
  };
  topup_request: {
    id: string;
    user_id: string;
    wallet_transaction_id: string;
    payment_method_id: string;
    amount: string;
    fee: string;
    status: string;
    gateway_transaction_id: string;
    gateway_order_id: null;
    gateway_response: {
      status: boolean;
      message: string;
      data: {
        authorization_url: string;
        access_code: string;
        reference: string;
      };
    };
    payment_url: string;
    bank_reference: null;
    bank_receipt: null;
    expires_at: string;
    completed_at: null;
    created_at: null;
    updated_at: null;
  } | null;
  withdraw_request: null;
};
