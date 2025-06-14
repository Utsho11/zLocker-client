import { jwtDecode, JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  id?: string;
  image?: string;
  role: string;
  name: string;
  email: string;
  isVerified: boolean;
}

export const verifyToken = (token: string) => {
  return jwtDecode(token) as CustomJwtPayload;
};
