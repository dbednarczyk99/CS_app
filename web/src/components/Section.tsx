// Półprzezroczysty panel sekcji na tle zdjęcia, z nagłówkiem i białą linią
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto my-6 max-w-[90%] bg-panel">
      <header className="py-8 text-center">
        <h2 className="text-3xl md:text-4xl">{title}</h2>
        <div className="bar mt-3" />
      </header>
      <div className="mx-auto max-w-[90%] pb-10">{children}</div>
    </section>
  );
}
