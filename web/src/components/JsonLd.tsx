/** Dane strukturalne dla Google (JSON-LD) – niewidoczne dla odwiedzających; „<” zamieniane, żeby treść nie zamknęła znacznika */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
