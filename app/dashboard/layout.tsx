import AuthGuard from "@/components/AuthGuard";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <AuthGuard>
        <div className="text-center justify-center">{children}</div>
      </AuthGuard>
    </section>
  );
}
