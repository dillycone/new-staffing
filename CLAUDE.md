# Parallel Execution Strategy

During task planning and execution, proactively identify opportunities to leverage concurrent subagents for maximum efficiency. When faced with multi-step work:

1. **Decompose tasks** - Break down complex work into independent, parallelizable subtasks
2. **Evaluate dependencies** - Identify which subtasks have no interdependencies and can run simultaneously
3. **Launch in parallel** - Execute independent subagents concurrently rather than sequentially
4. **Maximize throughput** - Prefer parallel execution patterns over sequential approaches whenever feasible

This applies to research, code exploration, testing, analysis, and other decomposable workflows. Always ask: "Can multiple subagents tackle different aspects of this work simultaneously?"

## Parallel Execution Plan Presentation

When presenting a plan that uses parallel subagents, you MUST explicitly document:

### 1. Subagent Manifest
List each subagent with:
- **Agent ID/Name** - Clear identifier (e.g., "Agent 1: Config Cleanup")
- **Scope** - What files/tasks this agent handles
- **Estimated Complexity** - Simple/Medium/Complex
- **Deliverables** - Specific outputs/changes per agent

### 2. Execution Topology
Clearly show the execution model:
- **Fully Parallel** - All agents run simultaneously with no dependencies
- **Phased Execution** - Agents run in waves (Wave 1 → Wave 2 → Wave 3)
- **Hybrid** - Mix of parallel within phases and sequential between phases
- **Dependency-Driven** - Agents wait for specific upstream outputs

### 3. Dependency Graph
Visualize dependencies using ASCII notation:
- `║` for parallel execution (runs at same time)
- `→` for sequential dependencies (must wait for)
- `├─` for branching relationships
- `└─` for convergence points

Example topology:
```
Wave 1 (Parallel):
  [Agent 1: Delete files]       ║
  [Agent 2: Update config]      ║  ← All independent
  [Agent 3: Modify pipeline]    ║

Wave 2 (Sequential - waits for Wave 1):
  [Agent 4: Update tests]   → (depends on pipeline changes from Agent 3)
```

### 4. Justification
Explain:
- Why parallel is beneficial over sequential
- Expected time savings (e.g., "4 agents in parallel: 4x speedup")
- Coordination points where results merge
- Risk mitigation for conflicts

### 5. Integration Strategy
Describe how agent results combine:
- "All agents complete independently → final build verification"
- "Agents 1 & 2 complete → Agent 3 uses their outputs"
- "No integration needed, purely independent changes"
- "Results merge at artifact validation step"

### 6. Expected Output
Specify what the parallelization delivers:
- Which files are created/modified/deleted by each agent
- Final state after all agents complete
- Validation checkpoints

### Template: Standard Parallel Plan Format

```
## Parallel Execution Plan: [Task Title]

**Subagent Count:** N agents
**Execution Model:** [Fully Parallel | Phased | Hybrid]
**Expected Performance:** [Sequential: Xmin → Parallel: Ymin] = Zx speedup

### Subagent Assignments:

**Agent 1: [Descriptive Name]**
- Files: [List specific files]
- Tasks: [1-3 line summary]
- Complexity: [Simple/Medium/Complex]

**Agent 2: [Descriptive Name]**
- Files: [List specific files]
- Tasks: [1-3 line summary]
- Complexity: [Simple/Medium/Complex]

[... repeat for each agent ...]

### Execution Topology:

[ASCII diagram showing phases and dependencies]

**Parallelization:** [Fully parallel / Phased: Wave 1 → Wave 2]
**Integration Points:** [Where results merge]
**Risk Assessment:** [Potential conflicts and mitigations]
**Validation:** [How success is verified after all agents complete]
```

### Real-World Example: Remove Policy Judge Feature

```
## Parallel Execution Plan: Remove Policy Judge Functionality

**Subagent Count:** 5 agents
**Execution Model:** Single wave, fully parallel
**Expected Performance:** Sequential: 25min → Parallel: 6min = 4.2x speedup

### Subagent Assignments:

**Agent 1: File Deletion**
- Scope: src/agents/, src/tools/, tests/tools/, docs/
- Files: policyJudge.ts, reviewDraft.ts, reviewDraft.test.ts, reviewDraft-usage.md, emitHandlers 2.ts
- Tasks: Delete 5 files
- Complexity: Simple

**Agent 2: Config Cleanup**
- Scope: src/config.ts
- Tasks: Remove MAX_REVIEW_ROUNDS constant, remove GUIDELINES_PATH constant
- Complexity: Simple

**Agent 3: Pipeline Changes**
- Scope: src/pipeline/
- Files: runPipeline.ts, eventHandlers.ts
- Tasks: Remove judge initialization, state tracking, verdict handlers; update buildPipelinePrompt
- Complexity: Complex

**Agent 4: Main Entry Point**
- Scope: src/main.ts, src/main/emitHandlers.ts
- Tasks: Remove guidelinesPath parameter, remove judge event handlers
- Complexity: Medium

**Agent 5: Test Cleanup**
- Scope: tests/
- Files: tests/pipeline/eventHandlers.test.ts
- Tasks: Remove judge-related test cases
- Complexity: Simple

### Execution Topology:

```
[Agent 1]     [Agent 2]     [Agent 3]     [Agent 4]     [Agent 5]
  (Delete)      (Config)     (Pipeline)    (Main)         (Tests)
     ║             ║             ║           ║              ║
     └─────────────┴─────────────┴───────────┴──────────────┘
                        ↓
            All agents complete simultaneously
                        ↓
               Verify imports resolve
                        ↓
               Build & run tests
```

**Parallelization:** Fully parallel (zero dependencies)
**Integration:** Sequential agents complete → single verification phase
**Risks:** None (independent modules), mitigated by build check
**Validation:** No import errors, test suite passes
```

### Key Principles:

1. **Always show agent count explicitly** - Don't bury it in narrative
2. **Use visual topology** - ASCII diagrams beat prose descriptions
3. **Quantify parallelization** - Show expected speedup ratios
4. **List all files touched** - Helps users understand scope
5. **Include complexity ratings** - Helps estimate execution time
6. **Document integration strategy** - How do parallel results merge?
7. **Identify all dependencies** - Even "no dependencies" should be stated
8. **Plan validation upfront** - How will you verify success?

### Anti-Patterns to Avoid:

❌ "I'll use 3 agents to do this task" (no detail on what each does)
❌ "Agents will work in parallel" (no topology shown)
❌ "This will be faster" (no quantification)
❌ "Independent work" (but import conflicts exist)
✅ "5 agents, 4.2x speedup, zero dependencies, fully parallel"
✅ [ASCII topology diagram shown]
✅ "Files affected: X, Y, Z (Agent 1), A, B (Agent 2)"
✅ "Risks: import conflicts mitigated by final build check"
