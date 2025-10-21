"use client";

import { useState } from "react";
import { ScoreBreakdown, CategoryScore } from "@/types/scoring";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown;
  compact?: boolean;
}

export function ScoreBreakdownComponent({
  breakdown,
  compact = false,
}: ScoreBreakdownProps) {
  return (
    <div className="space-y-4">
      <CategoryScoreDisplay
        category={breakdown.technical}
        compact={compact}
      />
      <CategoryScoreDisplay
        category={breakdown.experience}
        compact={compact}
      />
      <CategoryScoreDisplay category={breakdown.impact} compact={compact} />
      <CategoryScoreDisplay
        category={breakdown.portfolio}
        compact={compact}
      />
      <CategoryScoreDisplay
        category={breakdown.foundation}
        compact={compact}
      />
    </div>
  );
}

interface CategoryScoreDisplayProps {
  category: CategoryScore;
  compact?: boolean;
}

function CategoryScoreDisplay({
  category,
  compact = false,
}: CategoryScoreDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);

  const percentage = category.percentage;
  const progressColor =
    percentage >= 80
      ? "bg-green-500"
      : percentage >= 60
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="space-y-2">
      {/* Category header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left hover:bg-accent/50 rounded-md p-2 transition-colors"
      >
        <div className="flex items-center gap-2 flex-1">
          {compact ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : null}
          <span className="font-medium text-foreground">
            {category.categoryName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">
            {category.score}/{category.maxScore}
          </span>
          <span className="text-xs text-muted-foreground w-12 text-right">
            {percentage}%
          </span>
        </div>
      </button>

      {/* Progress bar */}
      <Progress
        value={percentage}
        max={100}
        indicatorClassName={progressColor}
        className="h-2"
      />

      {/* Subcategories */}
      {isExpanded && !compact && (
        <div className="ml-6 space-y-3 mt-3">
          {category.subcategories.map((sub, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{sub.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">
                    {sub.score}/{sub.maxScore}
                  </span>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {sub.percentage}%
                  </span>
                </div>
              </div>
              <Progress
                value={sub.percentage}
                max={100}
                indicatorClassName={
                  sub.percentage >= 80
                    ? "bg-green-500"
                    : sub.percentage >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }
                className="h-1.5"
              />
              {sub.matched.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Matched: {sub.matched.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
