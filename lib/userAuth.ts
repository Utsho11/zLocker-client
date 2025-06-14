import { cookies } from "next/headers";

import { verifyToken } from "@/utils/verifyToken";

export const getLoggedInUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // console.log(token);

  if (!token) return null;
  try {
    const user = verifyToken(token);

    return user;
  } catch (error) {
    return null;
  }
};
