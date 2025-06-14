import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface User {
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  iat: number;
  exp: number;
}
