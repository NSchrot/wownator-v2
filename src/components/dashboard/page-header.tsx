export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-(family-name:--font-cinzel) font-bold text-2xl sm:text-3xl text-amber-100/90">
          {title}
        </h1>
        {subtitle && (
          <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm mt-2">
            {subtitle}
          </p>
        )}

        {/* Decorative divider */}
        <div className="flex items-center gap-3 mt-4">
          <div className="w-12 h-px bg-linear-to-r from-gold/40 to-transparent" />
          <span className="text-gold/30 text-[10px]">◆</span>
          <div className="w-12 h-px bg-linear-to-l from-gold/40 to-transparent" />
        </div>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
