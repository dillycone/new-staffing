"use client"

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWorkflow } from '@/contexts/workflow-context';
import { ResumeUpload } from '@/types/resume';
import { FolderUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFileDisplay {
  id: string;
  name: string;
  size: number;
  file: File;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword'
];
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.doc'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function UploadModal() {
  const {
    uploadModalOpen,
    setUploadModalOpen,
    setUploadedFiles,
    setProfileSelectorModalOpen
  } = useWorkflow();

  const [files, setFiles] = useState<UploadedFileDisplay[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.includes(extension)) {
      return 'Only PDF and DOCX files are allowed';
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 5MB (${formatFileSize(file.size)})`;
    }

    return null;
  };

  const addFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validatedFiles: UploadedFileDisplay[] = fileArray.map(file => {
      const error = validateFile(file);
      return {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        file,
        error: error || undefined,
      };
    });

    setFiles(prev => [...prev, ...validatedFiles]);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleContinue = () => {
    // Filter out files with errors
    const validFiles = files.filter(f => !f.error);

    // Convert to ResumeUpload format
    const resumeUploads: ResumeUpload[] = validFiles.map(f => ({
      id: f.id,
      file: f.file,
      name: f.name,
      size: f.size,
      status: 'pending',
      uploadedAt: new Date(),
    }));

    setUploadedFiles(resumeUploads);
    setUploadModalOpen(false);
    setProfileSelectorModalOpen(true);

    // Reset for next time
    setFiles([]);
  };

  const handleCancel = () => {
    setFiles([]);
    setUploadModalOpen(false);
  };

  const validFilesCount = files.filter(f => !f.error).length;

  return (
    <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload Resumes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drag and Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FolderUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-base font-medium mb-1">
              Drag & drop resumes here
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOCX (max 5MB each)
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Selected files ({files.length}):
              </p>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {files.map(file => (
                  <div
                    key={file.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-md border",
                      file.error
                        ? "bg-destructive/10 border-destructive/50"
                        : "bg-muted/50 border-border"
                    )}
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="flex items-center gap-2">
                        {!file.error && (
                          <span className="text-green-600 flex-shrink-0">✓</span>
                        )}
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {file.error || formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="flex-shrink-0"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleContinue}
            disabled={validFilesCount === 0}
          >
            Continue to Step 2 
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
