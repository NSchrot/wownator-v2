import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[hsl(220,20%,6%)] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(212,168,67,0.06),transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo link */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-(family-name:--font-cinzel) text-3xl font-bold text-gold drop-shadow-[0_0_24px_rgba(212,168,67,0.2)]">
              WoWnator
            </h1>
          </Link>
          <div className="flex items-center gap-4 justify-center mt-3">
            <div className="w-12 h-px bg-linear-to-r from-transparent to-gold/30" />
            <span className="text-gold/40 text-xs">◆</span>
            <div className="w-12 h-px bg-linear-to-l from-transparent to-gold/30" />
          </div>
        </div>

        {children}

        {/* Bottom decorative */}
        <p className="text-center mt-8 font-(family-name:--font-crimson) text-amber-100/20 text-xs">
          Feito por fãs • Não afiliado à Blizzard
        </p>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
    </div>
  );
}
