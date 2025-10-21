"use client";

import { ScoreResult } from "@/types/scoring";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScoreBreakdownComponent } from "@/components/score-breakdown";
import {
  CheckCircle,
  AlertCircle,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Save,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
} from "lucide-react";

interface ScoreDetailModalProps {
  result: ScoreResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScoreDetailModal({
  result,
  open,
  onOpenChange,
}: ScoreDetailModalProps) {
  if (!result) return null;

  const { totalScore, verdict, verdictLabel, verdictEmoji, breakdown } = result;

  const verdictColors: Record<string, string> = {
    exceptional: "bg-green-500",
    strong: "bg-yellow-500",
    potential: "bg-orange-500",
    marginal: "bg-red-400",
    pass: "bg-red-600",
  };

  const progressColor = verdictColors[verdict] || "bg-gray-500";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Score Report: {result.resumeFileName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Score Section */}
          <div className="bg-accent/50 rounded-lg p-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">{verdictEmoji}</span>
              <div>
                <div className="text-5xl font-bold text-foreground">
                  {totalScore}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <Badge
                  variant="outline"
                  className="mt-2 border-current text-base px-4 py-1"
                >
                  {verdictLabel}
                </Badge>
              </div>
            </div>
            <div className="max-w-md mx-auto">
              <Progress
                value={totalScore}
                max={100}
                indicatorClassName={progressColor}
                className="h-3"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Recommended Action: <strong>{result.verdictAction}</strong>
            </p>
          </div>

          {/* Breakdown Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Detailed Breakdown
            </h3>
            <ScoreBreakdownComponent breakdown={breakdown} />
          </div>

          {/* Key Strengths */}
          {result.strengths.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Key Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths.map((strength, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Concerns */}
          {result.concerns.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Areas to Probe
              </h3>
              <ul className="space-y-2">
                {result.concerns.map((concern, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-yellow-500 mt-0.5">⚠</span>
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extracted Data */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Extracted Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Experience */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <Briefcase className="h-4 w-4" />
                  Experience ({result.extractedData.totalYearsExperience} years)
                </h4>
                <div className="space-y-1">
                  {result.extractedData.experience.slice(0, 2).map((exp, idx) => (
                    <div key={idx} className="text-sm text-muted-foreground">
                      <div className="font-medium text-foreground">
                        {exp.role}
                      </div>
                      <div className="text-xs">
                        {exp.company} • {exp.duration || exp.startDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <GraduationCap className="h-4 w-4" />
                  Education
                </h4>
                <div className="space-y-1">
                  {result.extractedData.education.map((edu, idx) => (
                    <div key={idx} className="text-sm text-muted-foreground">
                      <div className="font-medium text-foreground">
                        {edu.degree} {edu.field}
                      </div>
                      <div className="text-xs">{edu.institution}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">
                  Technical Skills
                </h4>
                <div className="flex flex-wrap gap-1">
                  {result.extractedData.keywords.technical
                    .slice(0, 8)
                    .map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  {result.extractedData.keywords.technical.length > 8 && (
                    <Badge variant="outline" className="text-xs">
                      +{result.extractedData.keywords.technical.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <LinkIcon className="h-4 w-4" />
                  Links
                </h4>
                <div className="space-y-1">
                  {result.extractedData.links.github && (
                    <a
                      href={result.extractedData.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      GitHub <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {result.extractedData.links.portfolio && (
                    <a
                      href={result.extractedData.links.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      Portfolio <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {result.extractedData.links.linkedin && (
                    <a
                      href={result.extractedData.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      LinkedIn <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button variant="default" className="flex-1 md:flex-none">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Approve for Interview
            </Button>
            <Button variant="destructive" className="flex-1 md:flex-none">
              <ThumbsDown className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none">
              <Save className="h-4 w-4 mr-2" />
              Save for Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
