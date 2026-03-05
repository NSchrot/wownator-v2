"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const steps = [
  {
    mode: "Personagem",
    title: "Descubra o Campeão",
    icon: "⚔️",
    description:
      "Faça seu palpite e compare atributos como raça, classe, facção e expansão.",
    detail: "Feedback instantâneo por atributo: correto, parcial ou errado.",
    glowColor: "rgba(245,180,60,0.12)",
  },
  {
    mode: "Zona",
    title: "Leia o Território",
    icon: "🗺️",
    description:
      "Use pistas visuais e contexto do mapa para identificar a zona certa.",
    detail: "Cada tentativa afina o caminho até o local exato de Azeroth.",
    glowColor: "rgba(80,200,120,0.12)",
  },
  {
    mode: "Montaria",
    title: "Reconheça pela Silhueta",
    icon: "🐉",
    description:
      "Observe formato, tema e origem para acertar a montaria do dia.",
    detail: "Memória visual e conhecimento de coleção fazem diferença aqui.",
    glowColor: "rgba(160,100,240,0.12)",
  },
  {
    mode: "Habilidade",
    title: "Domine os Ícones",
    icon: "✨",
    description:
      "Identifique habilidades por efeito, classe e identidade visual.",
    detail: "Perfeito para quem conhece specs e kits de combate a fundo.",
    glowColor: "rgba(80,180,255,0.12)",
  },
  {
    mode: "Citação",
    title: "Ouça a Voz de Azeroth",
    icon: "💬",
    description:
      "Descubra quem disse a frase com base no tom, história e contexto.",
    detail: "Lore lovers brilham nesta etapa final.",
    glowColor: "rgba(240,80,100,0.12)",
  },
];

const STEP_VH = 100;
const ANIM_MS = 180;
const MONTARIA_STEP_INDEX = 2;
const MONTARIA_FRAMES_COUNT = 17;
const MONTARIA_FRAMES = Array.from({ length: MONTARIA_FRAMES_COUNT }, (_, index) =>
  `/montaria-frames/${String(index + 1).padStart(4, "0")}.webp`
);
const STEP_WEIGHTS = [3, 3, 6, 4, 3];

function mapRatioToStepProgress(ratio: number) {
  const totalWeight = STEP_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
  const weightedPosition = ratio * totalWeight;

  let accumulated = 0;
  for (let stepIndex = 0; stepIndex < STEP_WEIGHTS.length; stepIndex++) {
    const stepWeight = STEP_WEIGHTS[stepIndex];
    const stepEnd = accumulated + stepWeight;

    if (weightedPosition <= stepEnd || stepIndex === STEP_WEIGHTS.length - 1) {
      const local = (weightedPosition - accumulated) / stepWeight;
      const sub = Math.max(0, Math.min(1, local));
      const continuous = stepIndex + sub;
      return { stepIndex, sub, continuous };
    }

    accumulated = stepEnd;
  }

  return { stepIndex: STEP_WEIGHTS.length - 1, sub: 1, continuous: steps.length };
}

export function HowItWorksSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const glowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ringRefs = useRef<Array<SVGCircleElement | null>>([]);

  const displayedRef = useRef(0);
  const scrollIdxRef = useRef(0);
  const animatingRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const subRef = useRef(0);
  const triggerRef = useRef<((from: number, to: number) => void) | null>(null);

  const [textIdx, setTextIdx] = useState(0);
  const [textSub, setTextSub] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [mountFrameIdx, setMountFrameIdx] = useState(0);


  const triggerTransition = useCallback((fromIdx: number, toIdx: number) => {
    animatingRef.current = true;

    const exitCard = cardRefs.current[fromIdx];
    const enterCard = cardRefs.current[toIdx];
    const exitGlow = glowRefs.current[fromIdx];
    const enterGlow = glowRefs.current[toIdx];

    if (!exitCard || !enterCard) {
      animatingRef.current = false;
      return;
    }

    cleanupRef.current?.();

    exitCard.style.animation = "none";
    void exitCard.offsetWidth;
    exitCard.style.animation = `hiw-card-exit-up ${ANIM_MS}ms ease-out forwards`;

    if (exitGlow) {
      exitGlow.style.transition = `opacity ${ANIM_MS}ms ease-out`;
      exitGlow.style.opacity = "0";
    }

    const onExitEnd = (e: AnimationEvent) => {
      if (e.animationName !== "hiw-card-exit-up") return;
      exitCard.removeEventListener("animationend", onExitEnd);
      exitCard.style.animation = "";
      exitCard.style.opacity = "0";
      exitCard.style.transform = "translateY(60px) scale(0.97)";

      enterCard.style.animation = "none";
      void enterCard.offsetWidth;
      enterCard.style.animation = `hiw-card-enter-up ${ANIM_MS}ms ease-out forwards`;

      if (enterGlow) {
        enterGlow.style.transition = `opacity ${ANIM_MS}ms ease-out`;
        enterGlow.style.opacity = "0.6";
      }

      const onEnterEnd = (e2: AnimationEvent) => {
        if (e2.animationName !== "hiw-card-enter-up") return;
        enterCard.removeEventListener("animationend", onEnterEnd);
        enterCard.style.animation = "";
        enterCard.style.opacity = "1";
        enterCard.style.transform = "translateY(0) scale(1)";

        displayedRef.current = toIdx;
        animatingRef.current = false;

        if (scrollIdxRef.current !== toIdx) {
          triggerRef.current?.(toIdx, scrollIdxRef.current);
        }
      };

      enterCard.addEventListener("animationend", onEnterEnd);
      cleanupRef.current = () => {
        enterCard.removeEventListener("animationend", onEnterEnd);
      };
    };

    exitCard.addEventListener("animationend", onExitEnd);
    cleanupRef.current = () => {
      exitCard.removeEventListener("animationend", onExitEnd);
    };
  }, []);

  useEffect(() => {
    triggerRef.current = triggerTransition;
  }, [triggerTransition]);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = outerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const sectionTop = -rect.top;
      const sectionHeight = el.offsetHeight - window.innerHeight;
      if (sectionHeight <= 0) return;

      const ratio = Math.max(0, Math.min(1, sectionTop / sectionHeight));
      const mapped = mapRatioToStepProgress(ratio);
      const idx = mapped.stepIndex;
      const sub = mapped.sub;
      const continuous = mapped.continuous;

      setTextIdx(idx);
      setTextSub(sub);
      setTotalProgress(ratio * 100);

      const mountProgress =
        idx < MONTARIA_STEP_INDEX ? 0 : idx > MONTARIA_STEP_INDEX ? 1 : sub;
      const nextMountFrame = Math.min(
        MONTARIA_FRAMES_COUNT - 1,
        Math.floor(mountProgress * (MONTARIA_FRAMES_COUNT - 1))
      );
      setMountFrameIdx(nextMountFrame);

      scrollIdxRef.current = idx;
      subRef.current = sub;

      if (idx !== displayedRef.current && !animatingRef.current) {
        triggerTransition(displayedRef.current, idx);
      }

      if (!animatingRef.current) {
        const card = cardRefs.current[displayedRef.current];
        if (card) {
          const float = Math.sin(sub * Math.PI) * 4;
          card.style.transform = `translateY(${float}px) scale(1)`;
        }
      }

      const circumference = 2 * Math.PI * 52;
      const totalP = (continuous / steps.length) * 100;
      const offset = circumference - (totalP / 100) * circumference;
      for (let i = 0; i < steps.length; i++) {
        const ring = ringRefs.current[i];
        if (ring) ring.style.strokeDashoffset = `${offset}`;
      }
    });
  }, [triggerTransition]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
      cleanupRef.current?.();
    };
  }, [handleScroll]);

  useEffect(() => {
    const start = Math.max(0, mountFrameIdx - 2);
    const end = Math.min(MONTARIA_FRAMES_COUNT - 1, mountFrameIdx + 6);
    for (let frame = start; frame <= end; frame++) {
      const image = new window.Image();
      image.src = MONTARIA_FRAMES[frame];
    }
  }, [mountFrameIdx]);

  const textStep = steps[textIdx];
  const circumference = 2 * Math.PI * 52;
  const mountBarProgress = (mountFrameIdx / (MONTARIA_FRAMES_COUNT - 1)) * 100;

  return (
    <>
      <div className="relative h-px">
        <div className="absolute inset-x-0 h-px bg-linear-to-r from-transparent via-gold/15 to-transparent" />
      </div>

      <div
        ref={outerRef}
        style={{ height: `${100 + steps.length * STEP_VH}vh` }}
        className="relative"
      >
        <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
          <div className="absolute inset-0 bg-[hsl(220,20%,6%)]" />

          <div
            className="absolute inset-0 transition-[background] duration-700 ease-out opacity-50"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 55% 50%, ${textStep?.glowColor ?? "transparent"}, transparent 70%)`,
            }}
          />

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="hiw-mote absolute rounded-full bg-gold/20"
                style={{
                  width: `${2 + (i % 3)}px`,
                  height: `${2 + (i % 3)}px`,
                  left: `${15 + i * 14}%`,
                  bottom: `-4px`,
                  animationDuration: `${6 + i * 1.5}s`,
                  animationDelay: `${i * 0.8}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-1 flex-col justify-center px-6 sm:px-10">
            <div className="mx-auto w-full max-w-5xl">
              <div className="mb-10 text-center lg:text-left">
                <p className="font-(family-name:--font-cinzel) text-gold/60 text-sm uppercase tracking-[0.3em] mb-3">
                  Progressão
                </p>
                <h2 className="font-(family-name:--font-cinzel) font-bold text-3xl sm:text-4xl text-amber-100/90">
                  5 Modos. 1 Quiz Diário.
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
                <div>
                  <div className="flex gap-6">
                    <div className="hidden sm:flex flex-col items-center pt-1">
                      {steps.map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div
                            className={`h-3.5 w-3.5 rounded-full border-2 transition-all duration-500 ${
                              i === textIdx
                                ? "border-gold bg-gold shadow-[0_0_12px_rgba(242,201,76,0.5)] scale-125"
                                : i < textIdx
                                  ? "border-gold/50 bg-gold/30"
                                  : "border-gold/15 bg-transparent"
                            }`}
                          />
                          {i < steps.length - 1 && (
                            <div className="relative w-0.5 h-7">
                              <div className="absolute inset-0 bg-gold/10" />
                              <div
                                className="absolute top-0 left-0 w-full bg-gold/50 transition-all duration-200 ease-out"
                                style={{
                                  height:
                                    i < textIdx
                                      ? "100%"
                                      : i === textIdx
                                        ? `${textSub * 100}%`
                                        : "0%",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="min-h-55 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="text-4xl hiw-icon-transition"
                          key={`icon-${textIdx}`}
                        >
                          {textStep?.mode === "Montaria" ? (
                            <Image
                              src={MONTARIA_FRAMES[mountFrameIdx]}
                              alt="Montaria"
                              width={56}
                              height={56}
                              unoptimized
                              className="h-14 w-14 object-contain drop-shadow-lg"
                              draggable={false}
                            />
                          ) : textStep?.mode === "Citação" ? (
                            <span className="inline-flex relative">
                              <Image
                                src="/gnome-head.png"
                                alt="Gnome"
                                width={36}
                                height={36}
                                className="hiw-sway-left drop-shadow-lg relative top-1"
                              />
                              <span className="text-2xl hiw-sway-right inline-block absolute -top-3 -right-4">💬</span>
                            </span>
                          ) : textStep?.mode === "Personagem" ? (
                            <span className="inline-flex items-center relative">
                              <Image
                                src="/gnome-head.png"
                                alt="Gnome"
                                width={40}
                                height={40}
                                className="hiw-sway-right drop-shadow-lg relative"
                              />
                            </span>
                          ) : (
                            textStep?.icon
                          )}
                        </span>
                        <span className="text-xs uppercase tracking-[0.25em] text-gold/55 font-(family-name:--font-cinzel)">
                          {textStep?.mode}
                        </span>
                      </div>

                      <h3
                        className="text-2xl sm:text-3xl xl:text-4xl text-amber-100/95 font-(family-name:--font-cinzel) leading-tight mb-4 hiw-text-transition"
                        key={`t-${textIdx}`}
                      >
                        {textStep?.title}
                      </h3>
                      <p
                        className="text-amber-100/55 font-(family-name:--font-crimson) text-lg leading-relaxed mb-3 hiw-text-transition"
                        key={`d-${textIdx}`}
                      >
                        {textStep?.description}
                      </p>
                      <p
                        className="text-amber-100/35 font-(family-name:--font-crimson) text-sm hiw-text-transition"
                        key={`dt-${textIdx}`}
                      >
                        {textStep?.detail}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 max-w-md">
                    <div className="flex items-center justify-between text-xs text-amber-100/40 font-(family-name:--font-cinzel) mb-2">
                      <span>Etapa {textIdx + 1} de {steps.length}</span>
                      <span>{Math.round(totalProgress)}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-gold/8 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-gold-dark via-gold to-gold-light transition-[width] duration-150 ease-out"
                        style={{ width: `${totalProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="relative">
                    {steps.map((step, i) => (
                      <div key={step.mode} className="absolute inset-0" style={{ zIndex: i }}>
                        <div
                          ref={(el) => { glowRefs.current[i] = el; }}
                          className="absolute -inset-8 rounded-3xl blur-2xl"
                          style={{
                            background: `radial-gradient(circle, ${step.glowColor} 0%, transparent 70%)`,
                            opacity: i === 0 ? 0.6 : 0,
                          }}
                        />
                        <div
                          ref={(el) => { cardRefs.current[i] = el; }}
                          className="relative will-change-transform"
                          style={{
                            opacity: i === 0 ? 1 : 0,
                            transform: i === 0 ? "translateY(0) scale(1)" : "translateY(60px) scale(0.97)",
                          }}
                        >
                          <div className="rounded-2xl border border-gold/20 bg-[hsl(224,24%,10%)]/80 backdrop-blur-sm overflow-hidden">
                            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-gold/40 to-transparent" />
                            <div className="p-10 flex flex-col items-center justify-center min-h-85">
                              <div className={`relative mb-6 ${step.mode === "Montaria" ? "h-40 w-40" : ""}`}>
                                {step.mode !== "Montaria" && (
                                  <svg className="w-32 h-32" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(242,201,76,0.08)" strokeWidth="2" />
                                    <circle
                                      ref={(el) => { ringRefs.current[i] = el; }}
                                      cx="60" cy="60" r="52" fill="none"
                                      stroke="rgba(242,201,76,0.35)" strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeDasharray={circumference}
                                      strokeDashoffset={circumference}
                                      style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
                                    />
                                  </svg>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  {step.mode === "Montaria" ? (
                                    <div className="flex flex-col items-center gap-2">
                                      <Image
                                        src={MONTARIA_FRAMES[mountFrameIdx]}
                                        alt="Montaria"
                                        width={128}
                                        height={128}
                                        unoptimized
                                        className="h-32 w-32 object-contain drop-shadow-lg"
                                        draggable={false}
                                      />
                                      <div className="h-1 w-28 rounded-full bg-gold/12 overflow-hidden">
                                        <div
                                          className="h-full rounded-full bg-linear-to-r from-gold-dark via-gold to-gold-light transition-[width] duration-150 ease-out"
                                          style={{ width: `${mountBarProgress}%` }}
                                        />
                                      </div>
                                    </div>
                                  ) : step.mode === "Citação" ? (
                                    <div className="relative">
                                      <Image
                                        src="/gnome-head.png"
                                        alt="Gnome"
                                        width={48}
                                        height={48}
                                        className="hiw-sway-left drop-shadow-lg relative top-3 -left-3"/>
                                      <span className="text-4xl hiw-sway-right inline-block absolute -top-3 -right-4">💬</span>
                                    </div>
                                  ) : step.mode === "Personagem" ? (
                                    <div className="flex items-center">
                                      <Image
                                        src="/gnome-head.png"
                                        alt="Gnome"
                                        width={56}
                                        height={56}
                                        className="hiw-sway-right drop-shadow-lg top-1 relative right-0.5"
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-6xl">{step.icon}</span>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs uppercase tracking-[0.25em] text-gold/50 font-(family-name:--font-cinzel) text-center">Modo</p>
                              <p className="text-gold font-(family-name:--font-cinzel) text-2xl text-center mt-2">{step.mode}</p>
                              <p className="text-amber-100/45 font-(family-name:--font-crimson) text-center max-w-xs leading-relaxed mt-4">{step.description}</p>
                              <p className="text-amber-100/30 font-(family-name:--font-crimson) text-center text-sm max-w-xs mt-2">{step.detail}</p>
                            </div>
                            <div className="h-0.5 w-full bg-linear-to-r from-transparent via-gold/20 to-transparent" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="invisible pointer-events-none">
                      <div className="rounded-2xl border border-transparent overflow-hidden">
                        <div className="p-10 flex flex-col items-center justify-center min-h-85">
                          <div className="w-32 h-32 mb-6" />
                          <p className="text-xs">&nbsp;</p>
                          <p className="text-2xl mt-2">&nbsp;</p>
                          <p className="mt-4 max-w-xs">&nbsp;<br />&nbsp;</p>
                          <p className="mt-2 text-sm max-w-xs">&nbsp;</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pb-6 flex justify-center">
            <div className="flex flex-col items-center gap-1.5 text-amber-100/25">
              <span className="text-xs font-(family-name:--font-cinzel) tracking-wider">
                {textIdx < steps.length - 1 ? "Continue scrollando" : ""}
              </span>
              {textIdx < steps.length - 1 && (
                <svg
                  className="w-4 h-4 animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-px">
        <div className="absolute inset-x-0 h-px bg-linear-to-r from-transparent via-gold/15 to-transparent" />
      </div>
    </>
  );
}
