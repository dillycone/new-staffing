"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkflow } from '@/contexts/workflow-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScoreResult, Verdict } from '@/types/scoring';
import { ArrowLeft, Download, TrendingUp, Award, AlertCircle, CheckCircle2 } from 'lucide-react';

function getVerdictConfig(verdict: Verdict): {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
} {
  switch (verdict) {
    case 'strong_match':
      return {
        label: 'Strong Match',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-200',
        icon: <Award className="h-5 w-5 text-green-600" />,
      };
    case 'good_match':
      return {
        label: 'Good Match',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-200',
        icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
      };
    case 'moderate_match':
      return {
        label: 'Moderate Match',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50 border-yellow-200',
        icon: <TrendingUp className="h-5 w-5 text-yellow-600" />,
      };
    case 'weak_match':
      return {
        label: 'Weak Match',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50 border-orange-200',
        icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
      };
    case 'insufficient_data':
      return {
        label: 'Insufficient Data',
        color: 'text-gray-700',
        bgColor: 'bg-gray-50 border-gray-200',
        icon: <AlertCircle className="h-5 w-5 text-gray-600" />,
      };
  }
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 55) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

function ScoreCard({ result }: { result: ScoreResult }) {
  const verdictConfig = getVerdictConfig(result.verdict);
  const scoreColor = getScoreColor(result.overallScore);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{result.candidateName}</CardTitle>
            <CardDescription className="mt-1">
              Profile: {result.profileUsed}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${scoreColor}`}>
              {result.overallScore}
            </div>
            <div className="text-sm text-muted-foreground">/ 100</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Verdict Badge */}
        <div className={`flex items-center gap-2 p-3 rounded-md border ${verdictConfig.bgColor}`}>
          {verdictConfig.icon}
          <span className={`font-medium ${verdictConfig.color}`}>
            {verdictConfig.label}
          </span>
        </div>

        {/* Category Scores */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Category Breakdown</h4>
          <div className="space-y-2">
            {Object.entries(result.categoryScores).map(([category, data]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm capitalize">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-10 text-right">
                    {Math.round(data.score)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reasoning */}
        {result.reasoning && (
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Reasoning</h4>
            <p className="text-sm">{result.reasoning}</p>
          </div>
        )}

        {/* Strengths */}
        {result.strengths.length > 0 && (
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Strengths</h4>
            <ul className="text-sm space-y-1">
              {result.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-600 flex-shrink-0">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Concerns */}
        {result.concerns.length > 0 && (
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Concerns</h4>
            <ul className="text-sm space-y-1">
              {result.concerns.map((concern, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-orange-600 flex-shrink-0">!</span>
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Recommendations</h4>
            <ul className="text-sm space-y-1">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 flex-shrink-0">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResultsPage() {
  const { scoringResults, selectedProfile } = useWorkflow();
  const router = useRouter();

  // Redirect if no results
  useEffect(() => {
    if (!scoringResults || scoringResults.length === 0) {
      router.push('/');
    }
  }, [scoringResults, router]);

  if (!scoringResults || scoringResults.length === 0) {
    return null; // Will redirect
  }

  // Sort results by score (highest first)
  const sortedResults = [...scoringResults].sort((a, b) => b.overallScore - a.overallScore);

  // Calculate statistics
  const averageScore = scoringResults.reduce((sum, r) => sum + r.overallScore, 0) / scoringResults.length;
  const strongMatches = scoringResults.filter(r => r.verdict === 'strong_match').length;
  const goodMatches = scoringResults.filter(r => r.verdict === 'good_match').length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Scoring Results</h1>
              <p className="text-muted-foreground mt-2">
                Profile: {selectedProfile?.name || 'Unknown'} • {scoringResults.length} candidate{scoringResults.length !== 1 ? 's' : ''} scored
              </p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(averageScore)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Strong Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{strongMatches}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Good Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{goodMatches}</div>
            </CardContent>
          </Card>
        </div>

        {/* Results Grid */}
        <div className="space-y-6">
          {sortedResults.map((result) => (
            <ScoreCard key={result.id} result={result} />
          ))}
        </div>
      </div>
    </main>
  );
}
