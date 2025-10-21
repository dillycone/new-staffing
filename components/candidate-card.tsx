"use client";

import { ScoreResult } from "@/types/scoring";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Eye, Calendar } from "lucide-react";

interface CandidateCardProps {
  result: ScoreResult;
  onViewDetails: () => void;
  onSchedule?: () => void;
}

export function CandidateCard({
  result,
  onViewDetails,
  onSchedule,
}: CandidateCardProps) {
  const { extractedData, totalScore, verdict, verdictLabel, verdictEmoji } =
    result;

  // Color mapping for verdict
  const verdictColors: Record<string, string> = {
    exceptional: "bg-green-500",
    strong: "bg-yellow-500",
    potential: "bg-orange-500",
    marginal: "bg-red-400",
    pass: "bg-red-600",
  };

  const progressColor = verdictColors[verdict] || "bg-gray-500";

  // Extract key info
  const yearsExp = extractedData.totalYearsExperience;
  const currentCompany = extractedData.experience[0]?.company;
  const githubLink = extractedData.links.github;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left section - Candidate info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl" aria-label={verdictLabel}>
                {verdictEmoji}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {extractedData.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {extractedData.email}
                </p>
              </div>
            </div>

            {/* Key info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
              {yearsExp && (
                <span>
                  {yearsExp} {yearsExp === 1 ? "year" : "years"} experience
                </span>
              )}
              {currentCompany && (
                <>
                  <span className="text-border">•</span>
                  <span>{currentCompany}</span>
                </>
              )}
              {githubLink && (
                <>
                  <span className="text-border">•</span>
                  <a
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    GitHub
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Middle section - Score */}
          <div className="flex flex-col items-center md:items-end gap-2 min-w-[140px]">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                {totalScore}
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <Badge
              variant="outline"
              className="border-current whitespace-nowrap"
            >
              {verdictLabel}
            </Badge>
            <div className="w-full">
              <Progress
                value={totalScore}
                max={100}
                indicatorClassName={progressColor}
                className="h-2"
              />
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex flex-col gap-2 min-w-[140px]">
            <Button
              onClick={onViewDetails}
              variant="default"
              size="sm"
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            {onSchedule && (
              <Button
                onClick={onSchedule}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
