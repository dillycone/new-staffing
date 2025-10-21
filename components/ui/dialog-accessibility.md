# Dialog Component - Accessibility Documentation

## Overview

The Dialog component is built on **Radix UI Dialog** primitives, providing enterprise-grade accessibility features out of the box. This component fully complies with WCAG 2.1 AA standards and WAI-ARIA dialog pattern guidelines.

## Built-in Accessibility Features

### 1. Focus Management
- **Focus Trap**: When the dialog opens, focus is automatically trapped inside the dialog. Users cannot tab to elements outside the modal.
- **Initial Focus**: Focus automatically moves to the first focusable element when the dialog opens.
- **Focus Return**: When the dialog closes, focus returns to the trigger element that opened it.

### 2. Keyboard Navigation
- **Escape Key**: Pressing `Escape` closes the dialog.
- **Tab Navigation**: Users can tab through interactive elements within the dialog. Tab cycles within the dialog only (focus trap).
- **Shift + Tab**: Moves focus backward through interactive elements.

### 3. ARIA Attributes
The component automatically includes proper ARIA attributes:
- `role="dialog"` - Identifies the element as a dialog
- `aria-modal="true"` - Indicates the dialog is modal (blocking interaction with background)
- `aria-labelledby` - Automatically links to `DialogTitle` for accessible name
- `aria-describedby` - Automatically links to `DialogDescription` for additional context

### 4. Screen Reader Support
- Close button includes `sr-only` text: "Close" for screen reader users
- Dialog title is announced when the dialog opens
- Dialog description provides context to screen reader users
- Background content is properly hidden from assistive technologies when dialog is open

## Usage Examples

### Basic Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BasicDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description that provides context about the dialog.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content goes here.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### Dialog with Form

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function FormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Name
            </label>
            <input
              id="name"
              className="col-span-3 rounded border px-3 py-2"
              placeholder="Enter your name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Controlled Dialog

```tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ControlledDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    // Process form data
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Controlled Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Controlled Dialog</DialogTitle>
          <DialogDescription>
            This dialog's state is controlled by a parent component.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content</p>
        </div>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
}
```

### Confirmation Dialog

```tsx
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

export function ConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## Component API

### Dialog (Root)
Props from Radix UI Dialog.Root:
- `open?: boolean` - Controlled open state
- `defaultOpen?: boolean` - Uncontrolled default open state
- `onOpenChange?: (open: boolean) => void` - Callback when open state changes
- `modal?: boolean` - Whether dialog is modal (default: true)

### DialogTrigger
Props from Radix UI Dialog.Trigger:
- `asChild?: boolean` - Merge props with child element instead of wrapping

### DialogContent
Main dialog container with accessibility features.
- Includes automatic close button
- Supports all standard div attributes
- Automatically handles focus trap and ARIA attributes

### DialogHeader
Container for title and description with proper spacing.

### DialogFooter
Container for action buttons with responsive layout.

### DialogTitle
**Required for accessibility**. Provides the accessible name for the dialog.
- Automatically linked via `aria-labelledby`

### DialogDescription
**Recommended for accessibility**. Provides additional context.
- Automatically linked via `aria-describedby`

### DialogClose
Programmatic close trigger. Can wrap buttons to close dialog on click.

## Accessibility Best Practices

### Always Include a Title
```tsx
// ✅ Good - Has accessible name
<DialogContent>
  <DialogHeader>
    <DialogTitle>Settings</DialogTitle>
  </DialogHeader>
</DialogContent>

// ❌ Bad - No accessible name
<DialogContent>
  <div>Settings</div>
</DialogContent>
```

### Provide Descriptions
```tsx
// ✅ Good - Context for screen readers
<DialogHeader>
  <DialogTitle>Delete File</DialogTitle>
  <DialogDescription>
    This action cannot be undone. The file will be permanently deleted.
  </DialogDescription>
</DialogHeader>

// ⚠️ Okay but not ideal - Missing context
<DialogHeader>
  <DialogTitle>Delete File</DialogTitle>
</DialogHeader>
```

### Use Semantic HTML
```tsx
// ✅ Good - Proper label association
<div className="grid gap-4">
  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
</div>

// ❌ Bad - No label association
<div className="grid gap-4">
  <div>Email</div>
  <input type="email" />
</div>
```

### Logical Focus Order
Structure your dialog content in a logical reading order. The focus trap will follow the DOM order.

```tsx
// ✅ Good - Logical order
<DialogContent>
  <DialogHeader>...</DialogHeader>
  <form>
    <input /> {/* First field */}
    <input /> {/* Second field */}
  </form>
  <DialogFooter>
    <Button>Cancel</Button>
    <Button>Submit</Button>
  </DialogFooter>
</DialogContent>
```

## Keyboard Testing Checklist

Test your dialog with keyboard only:

- [ ] Can open dialog with `Enter` or `Space` on trigger
- [ ] Focus moves into dialog when opened
- [ ] Can tab through all interactive elements
- [ ] Cannot tab outside the dialog (focus trap works)
- [ ] Can close with `Escape` key
- [ ] Focus returns to trigger when closed
- [ ] Can activate close button with `Enter` or `Space`
- [ ] Form submissions work with `Enter` key

## Screen Reader Testing Checklist

Test with a screen reader (NVDA, JAWS, VoiceOver):

- [ ] Dialog title is announced when opened
- [ ] Dialog description is announced (if present)
- [ ] All interactive elements have accessible names
- [ ] Background content is hidden/ignored
- [ ] Close button announces "Close"
- [ ] Form fields have proper labels

## Technical Implementation

### Why Radix UI?

Radix UI Dialog was chosen because it provides:
1. **Complete WCAG 2.1 AA compliance** out of the box
2. **WAI-ARIA dialog pattern** implementation
3. **Focus management** (trap, initial focus, return focus)
4. **Keyboard navigation** (Escape, Tab handling)
5. **Screen reader support** (proper ARIA attributes)
6. **Portal rendering** (renders outside DOM hierarchy for proper stacking)
7. **Scroll locking** (prevents background scrolling)
8. **No accessibility bugs** (battle-tested in production by thousands of teams)

### Customization

The component can be customized while maintaining accessibility:

```tsx
// Custom styling
<DialogContent className="max-w-2xl bg-gradient-to-br from-blue-50 to-purple-50">
  {/* content */}
</DialogContent>

// Custom animations (via Tailwind classes already included)
// The component includes data-[state] attributes for animation

// Custom overlay
<DialogOverlay className="bg-red-500/20" />
```

## Migration from Custom Dialog

If you were previously using a custom dialog implementation, migration is straightforward:

```tsx
// Before (custom dialog)
<CustomDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="My Dialog"
>
  <p>Content</p>
</CustomDialog>

// After (Radix UI Dialog)
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>My Dialog</DialogTitle>
    </DialogHeader>
    <p>Content</p>
  </DialogContent>
</Dialog>
```

## Performance

The Dialog component:
- Uses React 19 features (forwardRef, etc.)
- Renders via portal (no DOM tree pollution)
- Only renders when open (controlled by Radix)
- Minimal re-renders (optimized internally by Radix)
- Small bundle size (~5KB gzipped including Radix primitives)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern mobile browsers

## Resources

- [Radix UI Dialog Documentation](https://www.radix-ui.com/docs/primitives/components/dialog)
- [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
