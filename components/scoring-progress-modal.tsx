"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useWorkflow } from '@/contexts/workflow-context';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoringStatus {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed';
  score?: number;
}

function getScoreEmoji(score: number): string {
  if (score >= 85) return '=â'; // Exceptional
  if (score >= 70) return '=á'; // Strong
  if (score >= 55) return '=à'; // Potential
  if (score >= 40) return '=4'; // Marginal
  return '«'; // Pass
}

// Mock scoring function - simulates API call
async function mockScoreResume(fileName: string): Promise<number> {
  // Simulate processing time (1-2 seconds)
  const delay = 1000 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Generate mock score between 40-95
  return Math.floor(40 + Math.random() * 55);
}

export default function ScoringProgressModal() {
  const router = useRouter();
  const {
    scoringProgressModalOpen,
    setScoringProgressModalOpen,
    uploadedFiles,
    selectedProfile,
    setScoringResults,
  } = useWorkflow();

  const [scoringStatuses, setScoringStatuses] = useState<ScoringStatus[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);

  // Initialize scoring statuses when modal opens
  useEffect(() => {
    if (scoringProgressModalOpen && uploadedFiles.length > 0) {
      const statuses: ScoringStatus[] = uploadedFiles.map(file => ({
        id: file.id,
        fileName: file.file.name,
        status: 'pending',
      }));
      setScoringStatuses(statuses);

      // Start scoring process
      scoreAllResumes(statuses);
    }
  }, [scoringProgressModalOpen, uploadedFiles]);

  const scoreAllResumes = async (statuses: ScoringStatus[]) => {
    for (let i = 0; i < statuses.length; i++) {
      const status = statuses[i];

      // Update status to processing
      setScoringStatuses(prev =>
        prev.map(s => s.id === status.id ? { ...s, status: 'processing' } : s)
      );

      // Simulate scoring
      const score = await mockScoreResume(status.fileName);

      // Update status to completed with score
      setScoringStatuses(prev =>
        prev.map(s => s.id === status.id ? { ...s, status: 'completed', score } : s)
      );
    }

    // All completed
    setAllCompleted(true);

    // Auto-navigate to results after 1 second
    setTimeout(() => {
      setScoringProgressModalOpen(false);
      router.push('/results');
    }, 1500);
  };

  const completedCount = scoringStatuses.filter(s => s.status === 'completed').length;
  const totalCount = scoringStatuses.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Dialog open={scoringProgressModalOpen} onOpenChange={setScoringProgressModalOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Scoring Resumes...</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Info */}
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Profile: <span className="text-foreground">{selectedProfile?.name || 'Unknown'}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Resumes: {totalCount} file{totalCount !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Scoring Status List */}
          <div className="space-y-3">
            {scoringStatuses.map((status) => (
              <div
                key={status.id}
                className="flex items-center justify-between p-3 rounded-md border bg-muted/30"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {status.status === 'pending' && (
                    <span className="text-muted-foreground flex-shrink-0">ø</span>
                  )}
                  {status.status === 'processing' && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
                  )}
                  {status.status === 'completed' && (
                    <span className="text-green-600 flex-shrink-0"></span>
                  )}
                  <p className="text-sm font-medium truncate">{status.fileName}</p>
                </div>
                <div className="flex-shrink-0 ml-3">
                  {status.status === 'processing' && (
                    <span className="text-sm text-muted-foreground">Processing...</span>
                  )}
                  {status.status === 'completed' && status.score !== undefined && (
                    <span className="text-sm font-medium">
                      Scored: {status.score}/100 {getScoreEmoji(status.score)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                Progress: {completedCount} of {totalCount}
              </span>
              <span className="text-muted-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Completion Message */}
          {allCompleted && (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm font-medium text-green-700">
                All resumes scored successfully! Navigating to results...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
