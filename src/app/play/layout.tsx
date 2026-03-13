import Link from "next/link";

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[hsl(220,20%,6%)] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_10%,rgba(212,168,67,0.06),transparent_70%)]" />
      <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="group flex items-center gap-3">
          <h1 className="font-(family-name:--font-cinzel) text-xl font-bold text-gold drop-shadow-[0_0_16px_rgba(212,168,67,0.2)] group-hover:drop-shadow-[0_0_24px_rgba(212,168,67,0.4)] transition-all">
            WoWnator
          </h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="font-(family-name:--font-crimson) text-amber-100/40 text-sm hover:text-amber-100/70 transition-colors"
          >
            Painel
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 pb-12">
        {children}
      </main>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
    </div>
  );
}
