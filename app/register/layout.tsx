const RegisterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg">{children}</div>
    </section>
  );
};

export default RegisterLayout;
