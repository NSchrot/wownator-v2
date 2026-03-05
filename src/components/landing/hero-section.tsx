"use client";

import { useSyncExternalStore, useCallback, useRef } from "react";
import { Button } from "@/components/ui/warcraftcn/button";
import Image from "next/image";
import Link from "next/link";

const RUNES = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ", "ᛈ", "ᛇ", "ᛉ", "ᛊ"];

const RUNE_DATA = Array.from({ length: 12 }, (_, i) => ({
  rune: RUNES[i % RUNES.length],
  duration: 12 + (((i * 7 + 3) % 8)),
}));

function FloatingRune({ delay, left, duration, rune }: { delay: number; left: string; duration: number; rune: string }) {
  return (
    <span
      className="absolute bottom-0 text-gold/15 text-2xl pointer-events-none animate-float select-none"
      style={{
        left,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {rune}
    </span>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const mounted = useSyncExternalStore(
    useCallback((cb: () => void) => { cb(); return () => {}; }, []),
    () => true,
    () => false
  );

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const element = sectionRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      element.style.setProperty("--hero-mx", `${x * 6}px`);
      element.style.setProperty("--hero-my", `${y * 4}px`);
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const element = sectionRef.current;
    if (!element) return;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      element.style.setProperty("--hero-mx", "0px");
      element.style.setProperty("--hero-my", "0px");
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        ["--hero-mx" as string]: "0px",
        ["--hero-my" as string]: "0px",
      }}
    >
      <div className="hero-bg-intro absolute inset-0 pointer-events-none overflow-hidden">
        <div className="hero-bg-mouse absolute inset-0">
          <video
            className="hero-bg-drift absolute inset-0 h-full w-full object-cover opacity-45"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source
              src="https://res.cloudinary.com/dpebql3aj/video/upload/v1752031983/videoplayback_1_betwh0.webm"
              type="video/webm"
            />
          </video>
        </div>
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-[hsl(220_25%_4%/0.82)] via-[hsl(220_20%_8%/0.72)] to-[hsl(220_20%_6%/0.92)]" />
      
      <div className="hero-glow-pulse absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,rgba(212,168,67,0.08),transparent_70%)]" />
      
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />
      
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {RUNE_DATA.map((data, i) => (
            <FloatingRune
              key={i}
              delay={i * 1.8}
              left={`${5 + i * 8}%`}
              duration={data.duration}
              rune={data.rune}
            />
          ))}
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />

      <div
        className={`relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="relative mb-2 w-96 sm:w-lg lg:w-152">
          <Image
            src="/logo.png"
            alt="WoWnator"
            width={500}
            height={140}
            priority
            className="w-full h-auto drop-shadow-[0_0_40px_rgba(212,168,67,0.25)]"
          />
          <div className="logo-sheen-mask absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 bottom-0 w-1/3 animate-sheen bg-linear-to-r from-transparent via-white/80 to-transparent skew-x-[-20deg]" />
          </div>
        </div>

        <div className="flex items-center gap-4 my-6 w-full max-w-xs">
          <div className="flex-1 h-px bg-linear-to-r from-transparent to-gold/40" />
          <span className="text-gold/60 text-lg">◆</span>
          <div className="flex-1 h-px bg-linear-to-l from-transparent to-gold/40" />
        </div>

        <p className="font-(family-name:--font-crimson) text-xl sm:text-2xl text-amber-100/70 max-w-2xl leading-relaxed mb-4">
          Teste seus conhecimentos sobre o universo de{" "}
          <span className="text-gold font-semibold">World of Warcraft</span>.
          <br />
          Um novo desafio a cada dia. Cinco categorias. Uma obsessão.
        </p>

        <br></br>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/play">
            <Button variant="default" className="text-base px-10 py-5 uppercase tracking-widest filter-saturate-150 hover:saturate-150">
              Jogar Agora
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="default"
              className="text-base px-10 py-5 uppercase tracking-widest filter-[hue-rotate(130deg)_saturate(1.9)_brightness(0.90)] hover:filter-[hue-rotate(130deg)_saturate(2)_brightness(1)]"
            >
              Criar Conta
            </Button>
          </Link>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-44 bg-linear-to-t from-[hsl(220,20%,6%)] via-[hsl(220,20%,6%/0.86)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[hsl(220,20%,6%)] to-transparent blur-md" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/25 to-transparent shadow-[0_-10px_30px_rgba(212,168,67,0.18)]" />
    </section>
  );
}
