"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ProfileBuilder } from "@/components/profile-builder";
import { ScoringProfile } from "@/types/scoring";

export default function NewProfilePage() {
  const router = useRouter();

  const handleSave = (profile: ScoringProfile) => {
    // Save to localStorage for now (later this would be an API call)
    const existingProfiles = getStoredProfiles();
    const updatedProfiles = [...existingProfiles, profile];
    localStorage.setItem('scoring-profiles', JSON.stringify(updatedProfiles));

    // Show success message (you could use a toast notification here)
    console.log('Profile saved:', profile);

    // Navigate back to home or profiles page
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <ProfileBuilder onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  );
}

// Helper function to get stored profiles
function getStoredProfiles(): ScoringProfile[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('scoring-profiles');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading profiles:', error);
    return [];
  }
}
