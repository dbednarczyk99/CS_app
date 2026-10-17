import Image from 'next/image';

/** Nagłówek podstrony: zdjęcie w tle, przyciemnienie, tytuł */
export function PageHeader({
  eyebrow,
  title,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  image: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative flex min-h-[46svh] items-end overflow-hidden pt-header pb-12 sm:min-h-[52svh] sm:pb-16">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-slow-zoom object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="heading mt-3 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {children && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-stone">{children}</div>}
      </div>
    </header>
  );
}
