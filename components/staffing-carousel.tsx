"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderUp, ClipboardList, PlusCircle } from "lucide-react";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
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
  },
  {
    id: 2,
    title: "Select Scoring Profile",
    description: "Choose from existing scoring profiles to evaluate candidates",
    icon: ClipboardList,
    iconColor: "text-green-600",
    gradientFrom: "from-green-50",
    gradientTo: "to-green-100",
  },
  {
    id: 3,
    title: "Create Scoring Profile",
    description: "Define custom criteria and weights for candidate evaluation",
    icon: PlusCircle,
    iconColor: "text-purple-600",
    gradientFrom: "from-purple-50",
    gradientTo: "to-purple-100",
  },
];

export default function StaffingCarousel() {
  return (
    <div className="w-full max-w-5xl mx-auto px-12 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Staffing Workflow
        </h2>
        <p className="text-muted-foreground">
          Follow these steps to streamline your candidate evaluation process
        </p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <CarouselItem key={step.id} className="md:basis-3/4 lg:basis-2/3">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2">
                  <CardHeader className={`bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} rounded-t-lg`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
                            <Icon className={`h-6 w-6 ${step.iconColor}`} />
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                            <span className="text-sm font-bold text-gray-700">
                              {step.id}
                            </span>
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-2">
                          {step.title}
                        </CardTitle>
                        <CardDescription className="text-base text-gray-700">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
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
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      <div className="mt-6 flex justify-center gap-2">
        {workflowSteps.map((step) => (
          <div
            key={step.id}
            className="h-2 w-2 rounded-full bg-gray-300 transition-all duration-300"
            aria-label={`Step ${step.id}`}
          />
        ))}
      </div>
    </div>
  );
}
