import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/utils/authOptions";
import { verifyToken } from "@/utils/verifyToken";

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get session from next-auth
  const session = await getServerSession(authOptions);

  const token = session?.user?.accessToken;

  // console.log("token from layout:", token);

  // 2. Redirect if no token
  if (!token) {
    redirect("/");
  }

  // 3. Safely verify token
  let user;

  try {
    user = verifyToken(token);
    // console.log(user);
  } catch (error) {
    console.error("Invalid token:", error);
    redirect("/"); // Redirect to login or error page
  }

  // 4. Redirect if not verified
  if (!user?.isVerified) {
    redirect(`/verify-code?email=${user?.email}`);
  }

  // 5. Render protected content
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="text-center justify-center">{children}</div>
    </section>
  );
}
