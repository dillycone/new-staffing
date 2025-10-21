"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface WeightSliderProps {
  label: string;
  value: number; // 0-100
  max?: number; // Maximum allowed value
  onChange: (value: number) => void;
  color?: string;
  disabled?: boolean;
}

export function WeightSlider({
  label,
  value,
  max = 100,
  onChange,
  color = "bg-blue-600",
  disabled = false,
}: WeightSliderProps) {
  const percentage = Math.round(value);
  const barWidth = `${percentage}%`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm font-semibold text-muted-foreground">
          {percentage}%
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Visual bar showing percentage */}
        <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden relative">
          <div
            className={cn("h-full transition-all duration-200", color)}
            style={{ width: barWidth }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-foreground/80">
              {barWidth}
            </span>
          </div>
        </div>

        {/* Slider control */}
        <div className="w-48">
          <Slider
            value={[value]}
            onValueChange={([newValue]) => onChange(newValue)}
            max={max}
            min={0}
            step={1}
            disabled={disabled}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
