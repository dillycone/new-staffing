"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderUp, ClipboardList, PlusCircle, ArrowLeft, ArrowRight } from "lucide-react";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  rotation: number; // degrees for 3D positioning
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 1,
    title: "Upload Resumes/Select Folder",
    description: "Browse and select resume files or folders for processing",
    icon: FolderUp,
    iconColor: "text-blue-600",
    gradientFrom: "from-blue-50",
    gradientTo: "to-blue-100",
    rotation: 0, // front
  },
  {
    id: 2,
    title: "Select Scoring Profile",
    description: "Choose from existing scoring profiles to evaluate candidates",
    icon: ClipboardList,
    iconColor: "text-green-600",
    gradientFrom: "from-green-50",
    gradientTo: "to-green-100",
    rotation: 120, // 120° clockwise
  },
  {
    id: 3,
    title: "Create Scoring Profile",
    description: "Define custom criteria and weights for candidate evaluation",
    icon: PlusCircle,
    iconColor: "text-purple-600",
    gradientFrom: "from-purple-50",
    gradientTo: "to-purple-100",
    rotation: 240, // 240° clockwise
  },
];

export default function Carousel3D() {
  // State management for rotation
  const [currentRotation, setCurrentRotation] = useState(0);

  // Navigation functions
  const handleNext = () => {
    setCurrentRotation((prev) => prev + 120);
  };

  const handlePrevious = () => {
    setCurrentRotation((prev) => prev - 120);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Calculate active step based on rotation
  const normalizedRotation = ((currentRotation % 360) + 360) % 360;
  const activeStepIndex = Math.round(normalizedRotation / 120) % 3;

  // Calculate visual effects for each card based on its angle relative to viewer
  const getCardVisualEffects = (cardRotation: number) => {
    // Normalize the angle difference to [-180, 180]
    let angleDiff = ((cardRotation - currentRotation) % 360 + 360) % 360;
    if (angleDiff > 180) angleDiff -= 360;

    // Calculate distance from front (0 = front, 180 = back)
    const distanceFromFront = Math.abs(angleDiff);

    // Opacity: Full at front, reduced on sides
    const opacity = distanceFromFront < 90
      ? 1.0 - (distanceFromFront / 90) * 0.3  // Front hemisphere: 1.0 to 0.7
      : 0.5;  // Back hemisphere: dimmer

    // Scale: Larger at front, normal on sides
    const scale = distanceFromFront < 60
      ? 1.05 - (distanceFromFront / 60) * 0.05  // 1.05 at front to 1.0
      : 1.0;

    // Brightness filter for lighting effect
    const brightness = distanceFromFront < 90
      ? 100 + (1 - distanceFromFront / 90) * 10  // 110% at front to 100%
      : 90;  // 90% at back

    // Shadow: Stronger at front, lighter on sides
    const shadowIntensity = distanceFromFront < 90
      ? 1 - (distanceFromFront / 90) * 0.6  // 1.0 at front to 0.4
      : 0.2;  // Very light at back

    const boxShadow = `
      0 ${20 * shadowIntensity}px ${40 * shadowIntensity}px rgba(0, 0, 0, ${0.15 * shadowIntensity}),
      0 ${10 * shadowIntensity}px ${20 * shadowIntensity}px rgba(0, 0, 0, ${0.1 * shadowIntensity}),
      0 0 ${60 * shadowIntensity}px rgba(0, 0, 0, ${0.05 * shadowIntensity})
    `;

    // Z-index: Front card on top
    const zIndex = Math.round(100 - distanceFromFront);

    return {
      opacity,
      scale,
      brightness,
      boxShadow,
      zIndex,
      isFront: distanceFromFront < 30,
    };
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Staffing Workflow
        </h2>
        <p className="text-muted-foreground">
          Follow these steps to streamline your candidate evaluation process
        </p>
      </div>

      {/* 3D Carousel Container */}
      <div className="relative h-[500px] sm:h-[600px] flex items-center justify-center">
        {/* Perspective container */}
        <div
          className="relative w-full h-full"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "center center",
          }}
        >
          {/* Ground plane reflection effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center bottom, rgba(0,0,0,0.05) 0%, transparent 60%)",
            }}
          />

          {/* 3D rotating stage */}
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${-currentRotation}deg)`,
              transition: "transform 0.8s ease-in-out",
            }}
          >
            {/* Cards positioned in 3D circle */}
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              const effects = getCardVisualEffects(step.rotation);

              return (
                <div
                  key={step.id}
                  className="absolute top-1/2 left-1/2 w-full max-w-[400px] sm:max-w-[420px]"
                  style={{
                    transform: `translate(-50%, -50%) rotateY(${step.rotation}deg) translateZ(500px) scale(${effects.scale})`,
                    transformStyle: "preserve-3d",
                    opacity: effects.opacity,
                    filter: `brightness(${effects.brightness}%)`,
                    transition: "all 0.8s ease-in-out",
                    zIndex: effects.zIndex,
                  }}
                >
                  <Card
                    className="h-full max-h-[380px] border-2 backdrop-blur-sm overflow-hidden"
                    style={{
                      boxShadow: effects.boxShadow,
                      transition: "box-shadow 0.8s ease-in-out",
                      backgroundColor: effects.isFront ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.98)",
                    }}
                  >
                    <CardHeader className={`bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} rounded-t-lg relative overflow-hidden p-5`}>
                      {/* Subtle shine effect on front card */}
                      {effects.isFront && (
                        <div
                          className="absolute inset-0 opacity-30 pointer-events-none"
                          style={{
                            background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                          }}
                        />
                      )}
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
                              style={{
                                boxShadow: effects.isFront
                                  ? "0 4px 12px rgba(0,0,0,0.15)"
                                  : "0 2px 6px rgba(0,0,0,0.1)",
                                transition: "box-shadow 0.8s ease-in-out",
                              }}
                            >
                              <Icon className={`h-5 w-5 ${step.iconColor}`} />
                            </div>
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
                              <span className="text-xs font-bold text-gray-700">
                                {step.id}
                              </span>
                            </div>
                          </div>
                          <CardTitle className="text-2xl font-bold mb-3 leading-tight">
                            {step.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 leading-relaxed">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          <span>Quick and intuitive setup</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          <span>Seamless workflow integration</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          <span>Optimized for efficiency</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
          aria-label="Previous step"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
          aria-label="Next step"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Step indicators with active highlighting */}
      <div className="mt-6 flex justify-center gap-2">
        {workflowSteps.map((step, index) => (
          <div
            key={step.id}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === activeStepIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={`Step ${step.id}`}
          />
        ))}
      </div>
    </div>
  );
}
