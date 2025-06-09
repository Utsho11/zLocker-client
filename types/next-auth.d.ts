import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;
      image?: string;
      isVerified?: boolean;
      accessToken?: string;
    };
  }

  interface User {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    image?: string;
    isVerified?: boolean;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    image?: string;
    isVerified?: boolean;
    accessToken?: string;
  }
}
