"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeUpload } from '@/types/resume';
import { ScoringProfile, ScoreResult } from '@/types/scoring';

interface WorkflowContextType {
  // Uploaded files
  uploadedFiles: ResumeUpload[];
  setUploadedFiles: (files: ResumeUpload[]) => void;
  addUploadedFile: (file: ResumeUpload) => void;
  removeUploadedFile: (id: string) => void;
  
  // Selected profile
  selectedProfile: ScoringProfile | null;
  setSelectedProfile: (profile: ScoringProfile | null) => void;
  
  // Scoring results
  scoringResults: ScoreResult[];
  setScoringResults: (results: ScoreResult[]) => void;
  addScoringResult: (result: ScoreResult) => void;
  
  // Scoring status
  isScoring: boolean;
  setIsScoring: (status: boolean) => void;
  
  // Modal states
  uploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
  
  profileSelectorModalOpen: boolean;
  setProfileSelectorModalOpen: (open: boolean) => void;
  
  scoringProgressModalOpen: boolean;
  setScoringProgressModalOpen: (open: boolean) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [uploadedFiles, setUploadedFiles] = useState<ResumeUpload[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ScoringProfile | null>(null);
  const [scoringResults, setScoringResults] = useState<ScoreResult[]>([]);
  const [isScoring, setIsScoring] = useState(false);
  
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [profileSelectorModalOpen, setProfileSelectorModalOpen] = useState(false);
  const [scoringProgressModalOpen, setScoringProgressModalOpen] = useState(false);

  const addUploadedFile = (file: ResumeUpload) => {
    setUploadedFiles(prev => [...prev, file]);
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const addScoringResult = (result: ScoreResult) => {
    setScoringResults(prev => [...prev, result]);
  };

  return (
    <WorkflowContext.Provider
      value={{
        uploadedFiles,
        setUploadedFiles,
        addUploadedFile,
        removeUploadedFile,
        selectedProfile,
        setSelectedProfile,
        scoringResults,
        setScoringResults,
        addScoringResult,
        isScoring,
        setIsScoring,
        uploadModalOpen,
        setUploadModalOpen,
        profileSelectorModalOpen,
        setProfileSelectorModalOpen,
        scoringProgressModalOpen,
        setScoringProgressModalOpen,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
