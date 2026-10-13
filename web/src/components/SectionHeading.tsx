export function SectionHeading({
  eyebrow,
  title,
  children,
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="heading mt-3 text-3xl sm:text-4xl lg:text-5xl">{title}</h2>
      <div className={`mt-5 h-px w-16 bg-gold ${centered ? 'mx-auto' : ''}`} />
      {children && <div className="mt-5 text-lg leading-relaxed text-stone">{children}</div>}
    </div>
  );
}
