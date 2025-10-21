"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useWorkflow } from '@/contexts/workflow-context';
import { getScoringProfiles } from '@/lib/scoring-profiles';
import { ScoringProfile } from '@/types/scoring';
import { cn } from '@/lib/utils';

export default function ProfileSelectorModal() {
  const {
    profileSelectorModalOpen,
    setProfileSelectorModalOpen,
    uploadedFiles,
    setSelectedProfile,
    setUploadModalOpen,
    setScoringProgressModalOpen,
  } = useWorkflow();

  const profiles = getScoringProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState<string>(profiles[0]?.id || '');

  const handleBack = () => {
    setProfileSelectorModalOpen(false);
    setUploadModalOpen(true);
  };

  const handleScoreResumes = () => {
    const profileData = profiles.find((p: { id: string }) => p.id === selectedProfileId);
    if (profileData) {
      setSelectedProfile(profileData as ScoringProfile);
      setProfileSelectorModalOpen(false);
      setScoringProgressModalOpen(true);
    }
  };

  const formatWeights = (profile: { weights: ScoringProfile['weights'] }) => {
    const weights = profile.weights;
    return `Tech ${Math.round(weights.technical * 100)}% | Exp ${Math.round(weights.experience * 100)}% | Impact ${Math.round(weights.impact * 100)}% | Portfolio ${Math.round(weights.portfolio * 100)}% | Foundation ${Math.round(weights.foundation * 100)}%`;
  };

  return (
    <Dialog open={profileSelectorModalOpen} onOpenChange={setProfileSelectorModalOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Select Scoring Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose a profile for {uploadedFiles.length} resume{uploadedFiles.length !== 1 ? 's' : ''}:
          </p>

          <RadioGroup value={selectedProfileId} onValueChange={setSelectedProfileId}>
            <div className="space-y-3">
              {profiles.map((profile) => {
                const isRecommended = profile.isDefault;
                const isSelected = selectedProfileId === profile.id;

                return (
                  <div
                    key={profile.id}
                    className={cn(
                      "border rounded-lg p-4 transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setSelectedProfileId(profile.id)}
                  >
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value={profile.id}
                        id={profile.id}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={profile.id}
                            className="text-base font-semibold cursor-pointer"
                          >
                            {profile.name}
                          </label>
                          {isRecommended && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-md">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {profile.description}
                        </p>
                        <p className="text-xs text-muted-foreground/80 font-mono">
                          {formatWeights(profile)}
                        </p>
                        <div className="flex justify-end pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement preview rubric modal
                              alert('Preview rubric feature coming soon!');
                            }}
                          >
                            Preview Rubric
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
             ← Back
          </Button>
          <Button
            onClick={handleScoreResumes}
            disabled={!selectedProfileId}
          >
            Score Resumes →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
