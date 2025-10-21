# Results Dashboard - UI Mockups

## 1. Results Page Layout

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                         STAFFING WORKFLOW                                 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  ← Back to Upload                                                        ║
║                                                                           ║
║  SCORING RESULTS                      [Upload More] [Try Different Profile]║
║  Profile: Front-End Developer                              [Export PDF]  ║
║                                                                           ║
╟───────────────────────────────────────────────────────────────────────────╢
║                                                                           ║
║  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                    ║
║  │    3    │  │    1    │  │    1    │  │   74    │                    ║
║  │  Total  │  │Exception│  │ Strong  │  │   Avg   │                    ║
║  │ Resumes │  │   🟢    │  │   🟡    │  │  Score  │                    ║
║  └─────────┘  └─────────┘  └─────────┘  └─────────┘                    ║
║                                                                           ║
╟───────────────────────────────────────────────────────────────────────────╢
║                                                                           ║
║  Filter & Sort                                                           ║
║  ┌──────────────────────────────┐  ┌──────────────────────────────┐    ║
║  │ 🔍 All Candidates (3)      ▼│  │ ⬍⬍ Score: High to Low      ▼│    ║
║  └──────────────────────────────┘  └──────────────────────────────┘    ║
║                                                                           ║
╟───────────────────────────────────────────────────────────────────────────╢
║                                                                           ║
║  Showing 3 of 3 candidates • Completed: Just now                        ║
║                                                                           ║
║  ┌───────────────────────────────────────────────────────────────────┐  ║
║  │ 🟢 Bob Johnson                              95/100  Exceptional   │  ║
║  │    bob.johnson@email.com                                          │  ║
║  │    ████████████████████████████████████░                          │  ║
║  │    8 years • Tech Giant • GitHub                                  │  ║
║  │                                   [View Details] [Schedule]       │  ║
║  └───────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
║  ┌───────────────────────────────────────────────────────────────────┐  ║
║  │ 🟡 John Doe                                 74/100  Strong        │  ║
║  │    john.doe@email.com                                             │  ║
║  │    █████████████████████████░░░░░░░░░                             │  ║
║  │    5 years • Acme Corp • GitHub                                   │  ║
║  │                                   [View Details] [Schedule]       │  ║
║  └───────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
║  ┌───────────────────────────────────────────────────────────────────┐  ║
║  │ 🟠 Jane Smith                               58/100  Potential     │  ║
║  │    jane.smith@email.com                                           │  ║
║  │    ████████████████░░░░░░░░░░░░░░░░░░░                            │  ║
║  │    2 years • Digital Agency • GitHub                              │  ║
║  │                                   [View Details] [Schedule]       │  ║
║  └───────────────────────────────────────────────────────────────────┘  ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

## 2. Score Detail Modal (Opened from "View Details")

```
═══════════════════════════════════════════════════════════════════════════
                    SCORE REPORT: john_doe.pdf                         [×]
═══════════════════════════════════════════════════════════════════════════

                                 🟡
                                 74
                                /100

                            Strong Candidate
                    ████████████████████░░░░░░░

              Recommended Action: Phone Screen

───────────────────────────────────────────────────────────────────────────

DETAILED BREAKDOWN

▼ Technical Skills                                        28/35    80%
  ███████████████████████████████████████░░░░░

  ▶ React + TypeScript + Hooks                            7/7    100%
    ████████████████████████████████████████████
    Matched: React, TypeScript, Hooks, Custom Hooks

  ▶ JavaScript/TypeScript                                 6/8     75%
    ████████████████████████████████████░░░
    Matched: ES6+, TypeScript, Async/Await

  ▶ CSS & Styling                                         5/5    100%
    ████████████████████████████████████████████
    Matched: Tailwind CSS, CSS Modules, Styled Components

▼ Experience Quality                                     22/25    88%
  ████████████████████████████████████████░

▼ Impact Indicators                                      12/20    60%
  ██████████████████████████░░░░░░░░░░░░

▼ Portfolio & Links                                       8/15    53%
  ██████████████████████░░░░░░░░░░░░░░░░

▼ Foundation                                              4/5     80%
  ███████████████████████████████████████░

───────────────────────────────────────────────────────────────────────────

✓ KEY STRENGTHS

  ✓ Strong TypeScript + React expertise with 5+ years experience
  ✓ Quantified impact: 45% improvement in load time, 60% bug reduction
  ✓ Solid CS degree and professional progression
  ✓ Modern tech stack including Tailwind, Jest, Next.js

───────────────────────────────────────────────────────────────────────────

⚠ AREAS TO PROBE

  ⚠ Limited testing scope - only unit testing with Jest
  ⚠ No E2E testing frameworks mentioned
  ⚠ Portfolio presence could be stronger
  ⚠ Limited open source contributions

───────────────────────────────────────────────────────────────────────────

EXTRACTED DATA

💼 Experience (6.5 years)              🎓 Education

   Senior Front-End Developer             B.S. Computer Science
   Acme Corp • 5 years                    State University

   Front-End Developer
   Tech Startup • 1.5 years

Technical Skills                       🔗 Links

[React] [TypeScript] [JavaScript]      GitHub ↗
[HTML] [CSS] [Tailwind] [Jest]         Portfolio ↗
+2 more                                LinkedIn ↗

───────────────────────────────────────────────────────────────────────────

[✓ Approve for Interview]  [✗ Reject]  [💾 Save for Review]

═══════════════════════════════════════════════════════════════════════════
```

## 3. Mobile View (< 768px)

```
┌─────────────────────────────┐
│  ← Back                     │
│                             │
│  SCORING RESULTS            │
│  Profile: Front-End Dev     │
│                             │
│  [Upload More]              │
│  [Try Different Profile]    │
│  [Export PDF]               │
├─────────────────────────────┤
│  ┌───┐  ┌───┐              │
│  │ 3 │  │ 1 │              │
│  │Tot│  │Exc│              │
│  └───┘  └───┘              │
│  ┌───┐  ┌───┐              │
│  │ 1 │  │74 │              │
│  │Str│  │Avg│              │
│  └───┘  └───┘              │
├─────────────────────────────┤
│  Filter & Sort              │
│  ┌─────────────────────┐   │
│  │ All Candidates    ▼ │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ Score: High→Low   ▼ │   │
│  └─────────────────────┘   │
├─────────────────────────────┤
│  Showing 3 candidates       │
│                             │
│  ┌───────────────────────┐ │
│  │ 🟢 Bob Johnson        │ │
│  │ bob@email.com         │ │
│  │                       │ │
│  │   95/100              │ │
│  │ ████████████████████░ │ │
│  │   Exceptional         │ │
│  │                       │ │
│  │ 8 years • Tech Giant  │ │
│  │ GitHub ↗              │ │
│  │                       │ │
│  │ [View Details]        │ │
│  │ [Schedule]            │ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │ 🟡 John Doe           │ │
│  │ john@email.com        │ │
│  │                       │ │
│  │   74/100              │ │
│  │ ██████████████░░░░░░  │ │
│  │   Strong              │ │
│  │                       │ │
│  │ [View Details]        │ │
│  │ [Schedule]            │ │
│  └───────────────────────┘ │
│                             │
└─────────────────────────────┘
```

## 4. Empty State (No Results)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║  ← Back to Upload                                                        ║
║                                                                           ║
║  SCORING RESULTS                                                         ║
║  Profile: Front-End Developer                                            ║
║                                                                           ║
╟───────────────────────────────────────────────────────────────────────────╢
║                                                                           ║
║  ┌─────────────────────────────────────────────────────────────────┐    ║
║  │                                                                  │    ║
║  │                           📭                                     │    ║
║  │                                                                  │    ║
║  │              No candidates match the selected filter.           │    ║
║  │                                                                  │    ║
║  │                     [Clear Filters]                              │    ║
║  │                                                                  │    ║
║  └─────────────────────────────────────────────────────────────────┘    ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

## 5. Candidate Card Breakdown

```
┌────────────────────────────────────────────────────────────────────┐
│  Left Section              Middle Section        Right Section     │
│  ┌──────────────┐          ┌──────────┐          ┌─────────────┐  │
│  │ 🟡           │          │   74     │          │ [👁 View   │  │
│  │ John Doe     │          │   /100   │          │   Details] │  │
│  │ john@email   │          │          │          │            │  │
│  │              │          │ Strong   │          │ [📅 Schedule]│
│  │ 5y • Acme    │          │ ████░░░░ │          │            │  │
│  │ • GitHub ↗   │          │          │          │            │  │
│  └──────────────┘          └──────────┘          └─────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

## 6. Color Coding Reference

### Verdict Badges
```
🟢 [Exceptional]  Green    85-100 points
🟡 [Strong]       Yellow   70-84 points
🟠 [Potential]    Orange   55-69 points
🔴 [Marginal]     Red      40-54 points
🔴 [Pass]         Dark Red 0-39 points
```

### Progress Bars
```
Category Score ≥80%:  ████████████████████████░  (Green)
Category Score ≥60%:  ████████████████░░░░░░░░░  (Yellow)
Category Score <60%:  ██████████░░░░░░░░░░░░░░░  (Red)
```

## 7. Interaction Flow

```
User Journey:
├─ 1. Navigate to /results?session=abc123
├─ 2. View list of scored candidates
├─ 3. Apply filters (optional)
│     └─ Filter by: All | Exceptional | Strong | Potential | Marginal | Pass
├─ 4. Sort results (optional)
│     └─ Sort by: Score (High→Low, Low→High) | Name (A→Z, Z→A)
├─ 5. Click "View Details" on a candidate
├─ 6. Modal opens with full breakdown
│     ├─ Review overall score and verdict
│     ├─ Expand categories to see subcategories
│     ├─ Read strengths and concerns
│     ├─ View extracted data (experience, education, skills, links)
│     └─ Take action: Approve | Reject | Save
├─ 7. Close modal (click backdrop or X)
└─ 8. Repeat or use action buttons (Upload More, Export PDF, etc.)
```

## 8. Typography & Spacing

```
Heading Sizes:
  h1 - Page Title:        text-3xl md:text-4xl font-bold
  h2 - Section Titles:    text-lg font-semibold
  h3 - Card Titles:       text-2xl font-semibold
  h4 - Subsection:        text-sm font-medium

Body Text:
  Primary:                text-foreground
  Secondary:              text-muted-foreground
  Small:                  text-xs text-muted-foreground

Spacing:
  Container padding:      px-4 py-8 md:py-12
  Card padding:           p-6
  Section gaps:           space-y-6
  Inline gaps:            gap-4
```

## 9. Accessibility Features

```
Semantic HTML:
  <main>                  - Wraps entire page
  <section>               - Groups related content
  <article>               - Individual candidate cards
  <h1>, <h2>, <h3>       - Proper heading hierarchy
  <button>                - All interactive elements
  <a>                     - External links

ARIA:
  aria-label              - Icon-only buttons
  aria-describedby        - Form controls
  role="dialog"           - Modal overlay
  role="progressbar"      - Progress indicators

Keyboard Navigation:
  Tab                     - Move between interactive elements
  Enter/Space             - Activate buttons
  Esc                     - Close modal
  Focus indicators        - Visible outline on focus
```

## 10. Data Flow Diagram

```
                          ┌──────────────┐
                          │ URL Params   │
                          │ ?session=... │
                          └──────┬───────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Results Page (Client) │
                    │  - useState for data   │
                    │  - useState for modal  │
                    │  - useState for filters│
                    └────────┬───────────────┘
                             │
                   ┌─────────┴──────────┐
                   │                    │
                   ▼                    ▼
          ┌────────────────┐   ┌──────────────┐
          │  Mock Data     │   │  Filters &   │
          │  (lib/mock)    │   │  Sort Logic  │
          └────────┬───────┘   └──────┬───────┘
                   │                  │
                   └─────────┬────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Filtered & Sorted    │
                  │ Results (useMemo)    │
                  └──────────┬───────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
      ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
      │ Candidate   │ │ Candidate   │ │ Candidate   │
      │ Card #1     │ │ Card #2     │ │ Card #3     │
      └──────┬──────┘ └──────┬──────┘ └─────────────┘
             │               │
             │ onClick       │ onClick
             │               │
             └───────┬───────┘
                     │
                     ▼
          ┌────────────────────┐
          │ Score Detail Modal │
          │  - Full breakdown  │
          │  - Strengths       │
          │  - Concerns        │
          │  - Actions         │
          └────────────────────┘
```

## Summary

The UI is designed to be:
- **Scannable** - Quick overview of all candidates at a glance
- **Informative** - Key metrics visible without clicking
- **Interactive** - Filters, sorts, and modal details
- **Responsive** - Works on mobile, tablet, desktop
- **Accessible** - Keyboard navigation, screen readers, semantic HTML
- **Consistent** - Follows existing design system patterns
