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
  if (score >= 85) return '✨'; // Exceptional
  if (score >= 70) return '🟢'; // Strong
  if (score >= 55) return '🟡'; // Potential
  if (score >= 40) return '🟠'; // Marginal
  return '🔴'; // Pass
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
    try {
      // Mark all as processing initially
      setScoringStatuses(prev =>
        prev.map(s => ({ ...s, status: 'processing' }))
      );

      // Prepare FormData with all files
      const formData = new FormData();
      uploadedFiles.forEach(upload => {
        formData.append('files', upload.file);
      });
      formData.append('profileId', selectedProfile?.name || 'default');

      // Call the real scoring API
      const response = await fetch('/api/score', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Scoring failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Store the complete scoring results in context
      setScoringResults(data.results);

      // Update UI with scores from API response
      setScoringStatuses(prev =>
        prev.map((s, index) => ({
          ...s,
          status: 'completed',
          score: data.results[index]?.overallScore || 0,
        }))
      );

      // All completed
      setAllCompleted(true);

      // Auto-navigate to results after 1.5 seconds
      setTimeout(() => {
        setScoringProgressModalOpen(false);
        router.push('/results');
      }, 1500);
    } catch (error) {
      console.error('Scoring error:', error);
      
      // Mark all as failed
      setScoringStatuses(prev =>
        prev.map(s => ({ ...s, status: 'pending' }))
      );
      
      // Show error to user (you could enhance this with a toast notification)
      alert(`Scoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Close modal on error
      setScoringProgressModalOpen(false);
    }
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
                    <span className="text-muted-foreground flex-shrink-0">⏱️</span>
                  )}
                  {status.status === 'processing' && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
                  )}
                  {status.status === 'completed' && (
                    <span className="text-green-600 flex-shrink-0">✓</span>
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
