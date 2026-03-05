import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative py-12 px-6">
      <div className="absolute inset-0 bg-[hsl(220,25%,4%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/15 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-(family-name:--font-cinzel) font-bold text-xl bg-linear-to-b from-gold-light to-gold-dark bg-clip-text text-transparent">
              WoWnator
            </span>
            <span className="text-amber-100/20 text-xs font-(family-name:--font-cinzel)">
              v2
            </span>
          </div>

          <nav className="flex items-center gap-6 font-(family-name:--font-crimson) text-sm text-amber-100/40">
            <Link
              href="/play"
              className="hover:text-gold transition-colors duration-200"
            >
              Jogar
            </Link>
            <Link
              href="/ranking"
              className="hover:text-gold transition-colors duration-200"
            >
              Ranking
            </Link>
            <Link
              href="/login"
              className="hover:text-gold transition-colors duration-200"
            >
              Entrar
            </Link>
          </nav>

          <p className="text-amber-100/20 text-xs font-(family-name:--font-crimson)">
            Feito por fãs • Não afiliado à Blizzard
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gold/5 text-center">
          <p className="text-amber-100/15 text-xs font-(family-name:--font-crimson)">
            World of Warcraft e Blizzard Entertainment são marcas registradas da
            Blizzard Entertainment, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
