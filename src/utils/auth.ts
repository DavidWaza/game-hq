import { cookies } from "next/headers";

export const getToken = async () => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("token")?.value;
  } catch {
    return null;
  }
};

export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};
