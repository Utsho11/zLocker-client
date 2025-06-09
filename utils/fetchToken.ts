// Example: Making a request with token from session (Server Side)
import { getServerSession } from "next-auth";
import axios from "axios";

import { authOptions } from "@/utils/authOptions";

export const fetchWithToken = async (req: any, res: any) => {
  const session = await getServerSession(req, res, authOptions);

  console.log();

  //   const token = session?.user?.accessToken;

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/endpoint`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
