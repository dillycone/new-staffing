# Dialog Component - Quick Reference

## Import
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
```

## Basic Pattern
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Controlled State
```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>...</DialogContent>
</Dialog>
```

## Accessibility Checklist

### ✅ Required
- [ ] Always include `<DialogTitle>` (provides accessible name)
- [ ] Use `asChild` prop on `DialogTrigger` when wrapping a Button
- [ ] Ensure logical tab order in content

### ✅ Recommended
- [ ] Include `<DialogDescription>` (provides context for screen readers)
- [ ] Use semantic HTML for form fields (labels with `htmlFor`)
- [ ] Provide clear, descriptive titles

### ✅ Built-in (automatic)
- [x] Focus trap
- [x] Escape key to close
- [x] Focus return to trigger
- [x] ARIA attributes
- [x] Screen reader announcements
- [x] Background scroll lock

## Common Patterns

### Form Dialog
```tsx
<DialogContent>
  <form onSubmit={handleSubmit}>
    <DialogHeader>
      <DialogTitle>Edit Item</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <label htmlFor="field">Field</label>
      <input id="field" />
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </form>
</DialogContent>
```

### Confirmation Dialog
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Alert Dialog (No Outside Click)
```tsx
<DialogContent onInteractOutside={(e) => e.preventDefault()}>
  <DialogHeader>
    <DialogTitle>Important</DialogTitle>
    <DialogDescription>Please acknowledge this message.</DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <DialogClose asChild>
      <Button>OK</Button>
    </DialogClose>
  </DialogFooter>
</DialogContent>
```

## Props Reference

### Dialog
| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Controlled open state |
| `defaultOpen` | `boolean` | Uncontrolled default state |
| `onOpenChange` | `(open: boolean) => void` | Callback on state change |
| `modal` | `boolean` | Whether it's modal (default: true) |

### DialogTrigger
| Prop | Type | Description |
|------|------|-------------|
| `asChild` | `boolean` | Merge props with child |

### DialogContent
| Prop | Type | Description |
|------|------|-------------|
| `onInteractOutside` | `(e: Event) => void` | Handle outside clicks |
| `onEscapeKeyDown` | `(e: Event) => void` | Handle Escape key |
| Standard div props | - | className, style, etc. |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Next element |
| `Shift+Tab` | Previous element |
| `Escape` | Close dialog |
| `Enter` | Activate button |
| `Space` | Activate button |

## Testing Tips

### Keyboard Test (5 seconds)
1. Open dialog with `Enter`
2. Press `Tab` (should move within dialog)
3. Press `Escape` (should close)
4. Focus should return to trigger

### Screen Reader Test (10 seconds)
1. Navigate to trigger
2. Open dialog
3. Listen for: "Dialog, [Title], [Description]"
4. Navigate elements (all should announce)

## Common Mistakes

### ❌ Missing Title
```tsx
// Bad: No accessible name
<DialogContent>
  <h2>Title</h2>
</DialogContent>
```

```tsx
// Good: Uses DialogTitle
<DialogContent>
  <DialogHeader>
    <DialogTitle>Title</DialogTitle>
  </DialogHeader>
</DialogContent>
```

### ❌ No asChild on Trigger
```tsx
// Bad: Double button wrapping
<DialogTrigger>
  <Button>Open</Button>
</DialogTrigger>
```

```tsx
// Good: Single button element
<DialogTrigger asChild>
  <Button>Open</Button>
</DialogTrigger>
```

### ❌ Missing Label Association
```tsx
// Bad: No label for attribute
<div>Name</div>
<input id="name" />
```

```tsx
// Good: Proper association
<label htmlFor="name">Name</label>
<input id="name" />
```

## Styling

### Custom Width
```tsx
<DialogContent className="sm:max-w-[800px]">
```

### Custom Overlay
```tsx
<DialogOverlay className="bg-red-500/20" />
```

### No Close Button
```tsx
// Remove the close button (not recommended)
<DialogContent className="[&>button]:hidden">
```

## Complete Example

```tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ExampleDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Name:", name);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-md border px-3 py-2"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

## Resources

- **Full Documentation**: `/components/ui/dialog-accessibility.md`
- **Interactive Examples**: `/components/ui/dialog-examples.tsx`
- **Radix UI Docs**: https://www.radix-ui.com/docs/primitives/components/dialog
- **ARIA Pattern**: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Dialog won't close | Check `onOpenChange` prop is set |
| Focus not trapped | Ensure content has focusable elements |
| Screen reader silent | Add `DialogTitle` and `DialogDescription` |
| Escape not working | Check for `onEscapeKeyDown` preventDefault |
| Styling not applying | Use `className` on components |
| Background scrolling | Should work automatically via Radix |

---

**Need more help?** See the full documentation in `dialog-accessibility.md`
