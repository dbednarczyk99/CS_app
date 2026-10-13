import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-3xl flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="eyebrow">Błąd 404</p>
      <h1 className="heading mt-4 text-4xl sm:text-5xl">Tego bochenka nie znaleźliśmy</h1>
      <p className="mt-6 text-lg text-stone">Strona mogła zostać przeniesiona albo już nie istnieje.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-gold">
          Strona główna
        </Link>
        <Link href="/oferta" className="btn btn-outline">
          Zobacz ofertę
        </Link>
      </div>
    </section>
  );
}
