"use client";

import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, ClipboardList, FolderUp, PlusCircle } from "lucide-react";

interface WorkflowAction {
  label: string;
  href?: string;
}

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  highlights: string[];
  primaryAction: WorkflowAction;
  secondaryAction?: WorkflowAction;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 1,
    title: "Upload & Score Resumes",
    description: "Drag & drop resumes or folders and select scoring profile",
    icon: FolderUp,
    iconColor: "text-blue-600",
    gradientFrom: "from-blue-50",
    gradientTo: "to-blue-100",
    highlights: [
      "Bulk upload with automatic file parsing",
      "Organize resumes into reusable collections",
      "Keep source documents synced across updates",
    ],
    primaryAction: { label: "Upload resumes", href: "#" },
    secondaryAction: { label: "View upload tips", href: "#" },
  },
  {
    id: 2,
    title: "Select Scoring Profile",
    description: "Apply proven scoring profiles aligned to each role.",
    icon: ClipboardList,
    iconColor: "text-green-600",
    gradientFrom: "from-emerald-50",
    gradientTo: "to-emerald-100",
    highlights: [
      "Match roles to ready-made profile templates",
      "Blend skill, experience, and culture fit weights",
      "Visualize scoring criteria before evaluation",
    ],
    primaryAction: { label: "Choose a profile", href: "#" },
    secondaryAction: { label: "Manage profiles", href: "#" },
  },
  {
    id: 3,
    title: "Create Scoring Profile",
    description: "Design custom criteria tailored to hiring priorities.",
    icon: PlusCircle,
    iconColor: "text-purple-600",
    gradientFrom: "from-purple-50",
    gradientTo: "to-purple-100",
    highlights: [
      "Combine hard and soft-skill scorecards",
      "Preview outcomes against recent candidates",
      "Share profiles across your hiring team",
    ],
    primaryAction: { label: "Create new profile", href: "#" },
    secondaryAction: { label: "Explore templates", href: "#" },
  },
];

export default function Carousel3D() {
  const totalSteps = workflowSteps.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSteps);
  }, [totalSteps]);

  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSteps) % totalSteps);
  }, [totalSteps]);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    };

    const handleMotionPreference = () => {
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };

    handleResize();
    handleMotionPreference();
    window.addEventListener("resize", handleResize);

    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionMediaQuery.addEventListener("change", handleMotionPreference);

    return () => {
      window.removeEventListener("resize", handleResize);
      motionMediaQuery.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  const anglePer = 360 / totalSteps;
  const currentRotation = useMemo(() => activeIndex * anglePer, [activeIndex, anglePer]);
  const translateZ = isMobile ? 335 : 484;
  const transitionDuration = prefersReducedMotion ? 0 : (isMobile ? 0.6 : 0.85);

  const getCardVisualEffects = useCallback(
    (cardRotation: number) => {
      let angleDiff = ((cardRotation - currentRotation) % 360 + 360) % 360;
      if (angleDiff > 180) angleDiff -= 360;

      const distanceFromFront = Math.abs(angleDiff);

      const opacity = distanceFromFront < 90 ? 1 - (distanceFromFront / 90) * 0.35 : 0.4;
      const scale = distanceFromFront < 60 ? 1.04 - (distanceFromFront / 60) * 0.06 : 0.98;
      const brightness = distanceFromFront < 90 ? 100 + (1 - distanceFromFront / 90) * 8 : 92;
      const shadowIntensity = distanceFromFront < 90 ? 1 - (distanceFromFront / 90) * 0.6 : 0.25;

      const boxShadow = `0 ${22 * shadowIntensity}px ${48 * shadowIntensity}px rgba(15, 23, 42, ${0.22 * shadowIntensity})`;
      const zIndex = Math.max(0, Math.round(120 - distanceFromFront));

      return {
        opacity,
        scale,
        brightness,
        boxShadow,
        zIndex,
        isFront: distanceFromFront < 25,
      };
    },
    [currentRotation]
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 pt-0 pb-8">
      <div
        className="relative h-[480px] sm:h-[520px] flex items-center justify-center"
        role="region"
        aria-roledescription="carousel"
        aria-label="Staffing workflow steps"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") handlePrevious();
          if (e.key === "ArrowRight") handleNext();
        }}
      >
        <div
          className="relative w-full h-full"
          style={{
            perspective: "1100px",
            perspectiveOrigin: "center center",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center bottom, rgba(15,23,42,0.08) 0%, transparent 65%)",
            }}
          />

          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${-currentRotation}deg)`,
              transition: `transform ${transitionDuration}s cubic-bezier(0.22, 1, 0.36, 1)`,
              willChange: "transform",
            }}
          >
            {workflowSteps.map((step, i) => {
              const Icon = step.icon;
              const rotation = i * anglePer;
              const effects = getCardVisualEffects(rotation);

              return (
                <div
                  key={step.id}
                  className="absolute top-1/2 left-1/2 w-full max-w-[336px] sm:max-w-[372px]"
                  style={{
                    transform: `translate(-50%, -50%) rotateY(${rotation}deg) translateZ(${translateZ}px) scale(${effects.scale})`,
                    transformStyle: "preserve-3d",
                    opacity: effects.opacity,
                    filter: `brightness(${effects.brightness}%)`,
                    transitionProperty: "transform, opacity, filter",
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                    transitionDuration: `${transitionDuration}s`,
                    zIndex: effects.zIndex,
                    pointerEvents: effects.isFront ? "auto" : "none",
                  }}
                  aria-hidden={!effects.isFront}
                >
                  <Card
                    className={cn(
                      "h-[380px] flex flex-col overflow-hidden border border-border/40 bg-white/90 backdrop-blur",
                      effects.isFront ? "shadow-lifted" : "shadow-soft"
                    )}
                    style={{
                      boxShadow: effects.boxShadow,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <CardHeader
                      className={cn(
                        "relative overflow-hidden rounded-t-2xl border-b border-border/30 px-5 py-4",
                        effects.isFront
                          ? `bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo}`
                          : "bg-[hsl(var(--surface-strong))]"
                      )}
                    >
                      {effects.isFront && (
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.15) 55%, transparent 100%)",
                          }}
                        />
                      )}
                      <div className="relative z-10 flex items-start gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft"
                          style={{
                            boxShadow: effects.isFront
                              ? "0 16px 30px rgba(15,23,42,0.15)"
                              : "0 12px 20px rgba(15,23,42,0.12)",
                          }}
                        >
                          <Icon className={cn("h-6 w-6", step.iconColor)} />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground/80">
                            <span>Step {step.id}</span>
                          </div>
                          <CardTitle className="text-[1.6rem] font-semibold leading-tight text-foreground">
                            {step.title}
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-base text-slate-600">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 px-5 pb-5 pt-3">
                      <div className="space-y-3">
                        {step.highlights.map((highlight) => (
                          <div key={highlight} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                      {effects.isFront && (
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-center">
                          <Button size="lg" className="justify-center px-8" onClick={() => {/* TODO: implement action */}}>
                            {step.primaryAction.label}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-none bg-white/90 shadow-lifted hover:bg-white"
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-none bg-white/90 shadow-lifted hover:bg-white"
        >
          <ArrowRight className="h-6 w-6" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>

      <div className="mt-6 flex justify-center gap-3" role="tablist" aria-label="Carousel pagination">
        {workflowSteps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => handleDotClick(index)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              index === activeIndex ? "w-10 bg-primary" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            role="tab"
            aria-selected={index === activeIndex}
            aria-current={index === activeIndex ? "true" : undefined}
            aria-label={`Go to slide ${index + 1}: ${step.title}`}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {totalSteps}: {workflowSteps[activeIndex].title}
      </p>
    </div>
  );
}
