"use client";

import * as React from "react";
import { ScoringProfile, ScoringRule, CategoryWeights, VerdictThresholds } from "@/types/scoring";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightSlider } from "@/components/weight-slider";
import { CategoryEditor } from "@/components/category-editor";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileBuilderProps {
  initialProfile?: ScoringProfile;
  onSave: (profile: ScoringProfile) => void;
  onCancel: () => void;
}

interface ProfileFormState {
  name: string;
  description: string;
  roleType: string;
  weights: CategoryWeights;
  technicalRules: ScoringRule[];
  experienceRules: ScoringRule[];
  impactRules: ScoringRule[];
  portfolioRules: ScoringRule[];
  foundationRules: ScoringRule[];
  thresholds: VerdictThresholds;
  errors: Record<string, string>;
}

export function ProfileBuilder({
  initialProfile,
  onSave,
  onCancel,
}: ProfileBuilderProps) {
  const [formState, setFormState] = React.useState<ProfileFormState>(() => {
    if (initialProfile) {
      return {
        name: initialProfile.name,
        description: initialProfile.description,
        roleType: initialProfile.roleType,
        weights: initialProfile.weights,
        technicalRules: initialProfile.technicalRules,
        experienceRules: initialProfile.experienceRules,
        impactRules: initialProfile.impactRules,
        portfolioRules: initialProfile.portfolioRules,
        foundationRules: initialProfile.foundationRules,
        thresholds: initialProfile.thresholds,
        errors: {},
      };
    }

    // Default empty profile
    return {
      name: '',
      description: '',
      roleType: '',
      weights: {
        technical: 35,
        experience: 25,
        impact: 20,
        portfolio: 15,
        foundation: 5,
      },
      technicalRules: [
        {
          name: 'Core Framework',
          description: 'React/Vue/Angular expertise',
          maxPoints: 7,
          requiredAny: ['react', 'vue', 'angular'],
          bonusKeywords: [],
        },
        {
          name: 'JavaScript/TypeScript',
          description: 'Modern JS/TS proficiency',
          maxPoints: 8,
          keywords: ['javascript', 'typescript'],
          bonusKeywords: [],
        },
      ],
      experienceRules: [
        {
          name: 'Years of Experience',
          description: 'Total years in development',
          maxPoints: 15,
        },
      ],
      impactRules: [
        {
          name: 'Quantified Metrics',
          description: 'Measurable achievements',
          maxPoints: 8,
        },
      ],
      portfolioRules: [
        {
          name: 'GitHub Presence',
          description: 'GitHub profile with activity',
          maxPoints: 5,
        },
      ],
      foundationRules: [
        {
          name: 'Education',
          description: 'Formal education background',
          maxPoints: 2,
        },
      ],
      thresholds: {
        exceptional: 85,
        strong: 70,
        potential: 55,
        marginal: 40,
      },
      errors: {},
    };
  });

  const totalWeight = React.useMemo(() => {
    return Object.values(formState.weights).reduce((sum, w) => sum + w, 0);
  }, [formState.weights]);

  const handleWeightChange = (category: keyof CategoryWeights, value: number) => {
    setFormState((prev) => ({
      ...prev,
      weights: {
        ...prev.weights,
        [category]: value,
      },
    }));
  };

  const handleThresholdChange = (
    level: keyof VerdictThresholds,
    value: number
  ) => {
    setFormState((prev) => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [level]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate name
    if (!formState.name || formState.name.length < 3) {
      errors.name = 'Profile name must be at least 3 characters';
    }
    if (formState.name.length > 100) {
      errors.name = 'Profile name must be less than 100 characters';
    }

    // Validate weights
    if (Math.abs(totalWeight - 100) > 0.01) {
      errors.weights = `Weights must sum to 100% (currently ${totalWeight.toFixed(1)}%)`;
    }

    // Validate thresholds
    const { exceptional, strong, potential, marginal } = formState.thresholds;
    if (exceptional <= strong) {
      errors.thresholds = 'Exceptional threshold must be greater than strong';
    }
    if (strong <= potential) {
      errors.thresholds = 'Strong threshold must be greater than potential';
    }
    if (potential <= marginal) {
      errors.thresholds = 'Potential threshold must be greater than marginal';
    }
    if (marginal <= 0) {
      errors.thresholds = 'All thresholds must be greater than 0';
    }

    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const profile: ScoringProfile = {
      id: initialProfile?.id || generateProfileId(formState.name),
      name: formState.name,
      description: formState.description,
      roleType: formState.roleType || formState.name,
      weights: {
        technical: formState.weights.technical / 100,
        experience: formState.weights.experience / 100,
        impact: formState.weights.impact / 100,
        portfolio: formState.weights.portfolio / 100,
        foundation: formState.weights.foundation / 100,
      },
      technicalRules: formState.technicalRules,
      experienceRules: formState.experienceRules,
      impactRules: formState.impactRules,
      portfolioRules: formState.portfolioRules,
      foundationRules: formState.foundationRules,
      requiredKeywords: [],
      bonusKeywords: [],
      penaltyKeywords: [],
      companyTiers: {
        tier1: [],
        tier2: [],
        tier3: [],
        tier4: [],
      },
      thresholds: formState.thresholds,
      createdAt: initialProfile?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: 'user',
      isDefault: false,
    };

    onSave(profile);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {initialProfile ? 'Edit' : 'Create'} Scoring Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize scoring criteria for your hiring needs
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Basic details about this scoring profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Profile Name *</Label>
            <Input
              id="name"
              value={formState.name}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Front-End Developer - Custom"
              className={cn(formState.errors.name && 'border-red-500')}
            />
            {formState.errors.name && (
              <p className="text-sm text-red-500">{formState.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formState.description}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe what this profile is for..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roleType">Role Type</Label>
            <Input
              id="roleType"
              value={formState.roleType}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, roleType: e.target.value }))
              }
              placeholder="e.g., Front-End Developer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Weights */}
      <Card>
        <CardHeader>
          <CardTitle>Category Weights</CardTitle>
          <CardDescription>
            Adjust the importance of each category (must sum to 100%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <WeightSlider
            label="Technical Skills"
            value={formState.weights.technical}
            onChange={(value) => handleWeightChange('technical', value)}
            color="bg-blue-600"
          />
          <WeightSlider
            label="Experience Quality"
            value={formState.weights.experience}
            onChange={(value) => handleWeightChange('experience', value)}
            color="bg-green-600"
          />
          <WeightSlider
            label="Impact Indicators"
            value={formState.weights.impact}
            onChange={(value) => handleWeightChange('impact', value)}
            color="bg-purple-600"
          />
          <WeightSlider
            label="Portfolio Links"
            value={formState.weights.portfolio}
            onChange={(value) => handleWeightChange('portfolio', value)}
            color="bg-orange-600"
          />
          <WeightSlider
            label="Foundation"
            value={formState.weights.foundation}
            onChange={(value) => handleWeightChange('foundation', value)}
            color="bg-pink-600"
          />

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total:</span>
              <span
                className={cn(
                  'text-lg font-bold',
                  Math.abs(totalWeight - 100) < 0.01
                    ? 'text-green-600'
                    : 'text-red-600'
                )}
              >
                {totalWeight.toFixed(1)}%{' '}
                {Math.abs(totalWeight - 100) < 0.01 ? '✓' : '✗'}
              </span>
            </div>
            {formState.errors.weights && (
              <p className="text-sm text-red-500 mt-2">{formState.errors.weights}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Scoring Rules</CardTitle>
          <CardDescription>
            Customize keywords and scoring criteria for each category
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <CategoryEditor
            categoryName="Technical Skills"
            weight={formState.weights.technical}
            rules={formState.technicalRules}
            onRulesChange={(rules) =>
              setFormState((prev) => ({ ...prev, technicalRules: rules }))
            }
          />

          <CategoryEditor
            categoryName="Experience Quality"
            weight={formState.weights.experience}
            rules={formState.experienceRules}
            onRulesChange={(rules) =>
              setFormState((prev) => ({ ...prev, experienceRules: rules }))
            }
          />

          <CategoryEditor
            categoryName="Impact Indicators"
            weight={formState.weights.impact}
            rules={formState.impactRules}
            onRulesChange={(rules) =>
              setFormState((prev) => ({ ...prev, impactRules: rules }))
            }
          />

          <CategoryEditor
            categoryName="Portfolio Links"
            weight={formState.weights.portfolio}
            rules={formState.portfolioRules}
            onRulesChange={(rules) =>
              setFormState((prev) => ({ ...prev, portfolioRules: rules }))
            }
          />

          <CategoryEditor
            categoryName="Foundation"
            weight={formState.weights.foundation}
            rules={formState.foundationRules}
            onRulesChange={(rules) =>
              setFormState((prev) => ({ ...prev, foundationRules: rules }))
            }
          />
        </CardContent>
      </Card>

      {/* Decision Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle>Decision Thresholds</CardTitle>
          <CardDescription>
            Set score thresholds for different verdict levels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exceptional">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-500"></span>
                  Exceptional (Fast-track)
                </span>
              </Label>
              <Input
                id="exceptional"
                type="number"
                value={formState.thresholds.exceptional}
                onChange={(e) =>
                  handleThresholdChange('exceptional', Number(e.target.value))
                }
                min={0}
                max={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strong">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                  Strong (Phone Screen)
                </span>
              </Label>
              <Input
                id="strong"
                type="number"
                value={formState.thresholds.strong}
                onChange={(e) =>
                  handleThresholdChange('strong', Number(e.target.value))
                }
                min={0}
                max={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="potential">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                  Potential (Review Portfolio)
                </span>
              </Label>
              <Input
                id="potential"
                type="number"
                value={formState.thresholds.potential}
                onChange={(e) =>
                  handleThresholdChange('potential', Number(e.target.value))
                }
                min={0}
                max={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marginal">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500"></span>
                  Marginal (Pass)
                </span>
              </Label>
              <Input
                id="marginal"
                type="number"
                value={formState.thresholds.marginal}
                onChange={(e) =>
                  handleThresholdChange('marginal', Number(e.target.value))
                }
                min={0}
                max={100}
              />
            </div>
          </div>

          {formState.errors.thresholds && (
            <p className="text-sm text-red-500">{formState.errors.thresholds}</p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <div className="flex gap-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

function generateProfileId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
