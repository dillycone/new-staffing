"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ScoreResult } from "@/types/scoring";
import { mockScoreResults } from "@/lib/mock-data";
import { CandidateCard } from "@/components/candidate-card";
import { ScoreDetailModal } from "@/components/score-detail-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Upload,
  RotateCcw,
  Download,
  Filter,
  ArrowUpDown,
} from "lucide-react";

type SortOption = "score-desc" | "score-asc" | "name-asc" | "name-desc";
type FilterOption = "all" | "exceptional" | "strong" | "potential" | "marginal" | "pass";

function ResultsContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") || "default";

  // In a real app, fetch results based on sessionId
  // For now, use mock data
  const [results] = useState<ScoreResult[]>(mockScoreResults);
  const [selectedResult, setSelectedResult] = useState<ScoreResult | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("score-desc");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  // Get profile name from first result
  const profileName = results[0]?.profileUsed || "Unknown Profile";

  // Format timestamp
  const completedAt = results[0]?.scoredAt
    ? new Date(results[0].scoredAt)
    : new Date();
  const timeAgo = getTimeAgo(completedAt);

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = results;

    // Apply filter
    if (filterBy !== "all") {
      filtered = results.filter((r) => r.verdict === filterBy);
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return b.totalScore - a.totalScore;
        case "score-asc":
          return a.totalScore - b.totalScore;
        case "name-asc":
          return a.extractedData.name.localeCompare(b.extractedData.name);
        case "name-desc":
          return b.extractedData.name.localeCompare(a.extractedData.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [results, sortBy, filterBy]);

  const handleViewDetails = (result: ScoreResult) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const handleSchedule = (result: ScoreResult) => {
    // Placeholder for scheduling functionality
    alert(`Schedule interview with ${result.extractedData.name}`);
  };

  // Stats
  const stats = useMemo(() => {
    const exceptional = results.filter((r) => r.verdict === "exceptional").length;
    const strong = results.filter((r) => r.verdict === "strong").length;
    const potential = results.filter((r) => r.verdict === "potential").length;
    const avgScore =
      results.reduce((sum, r) => sum + r.totalScore, 0) / results.length;

    return { exceptional, strong, potential, avgScore };
  }, [results]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Upload
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Scoring Results
              </h1>
              <p className="text-muted-foreground">
                Profile: <strong>{profileName}</strong>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload More
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Different Profile
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {results.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Total Resumes
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-500">
                {stats.exceptional}
              </div>
              <div className="text-xs text-muted-foreground">Exceptional</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-500">
                {stats.strong}
              </div>
              <div className="text-xs text-muted-foreground">Strong</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {Math.round(stats.avgScore)}
              </div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Sort */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Filter & Sort
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Filter */}
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Candidates ({results.length})</option>
                  <option value="exceptional">
                    Exceptional ({stats.exceptional})
                  </option>
                  <option value="strong">Strong ({stats.strong})</option>
                  <option value="potential">
                    Potential ({stats.potential})
                  </option>
                  <option value="marginal">Marginal</option>
                  <option value="pass">Pass</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 flex-1">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="score-desc">Score: High to Low</option>
                  <option value="score-asc">Score: Low to High</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meta info */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredAndSortedResults.length} of {results.length}{" "}
          candidates • Completed: {timeAgo}
        </div>

        {/* Results List */}
        {filteredAndSortedResults.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                No candidates match the selected filter.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedResults.map((result) => (
              <CandidateCard
                key={result.candidateId}
                result={result}
                onViewDetails={() => handleViewDetails(result)}
                onSchedule={() => handleSchedule(result)}
              />
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <ScoreDetailModal
          result={selectedResult}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </main>
  );
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

// Wrap in Suspense to handle useSearchParams
export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
