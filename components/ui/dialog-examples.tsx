"use client";

/**
 * Dialog Component - Accessibility Examples
 *
 * This file demonstrates all accessibility features of the Dialog component.
 * Each example showcases best practices for accessible dialog implementation.
 */

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

/**
 * Example 1: Basic Accessible Dialog
 *
 * Accessibility Features Demonstrated:
 * - Focus trap: Focus stays within dialog when open
 * - Escape key: Press Escape to close
 * - ARIA attributes: role="dialog", aria-modal="true"
 * - Accessible name: Via DialogTitle (aria-labelledby)
 * - Accessible description: Via DialogDescription (aria-describedby)
 */
export function BasicAccessibleDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome Dialog</DialogTitle>
          <DialogDescription>
            This dialog demonstrates all core accessibility features including
            focus trap, escape key handling, and proper ARIA attributes.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Try these keyboard interactions:
          </p>
          <ul className="mt-2 space-y-2 text-sm">
            <li>• Press <kbd className="px-1 border rounded">Tab</kbd> to navigate between buttons</li>
            <li>• Press <kbd className="px-1 border rounded">Shift+Tab</kbd> to navigate backward</li>
            <li>• Press <kbd className="px-1 border rounded">Escape</kbd> to close the dialog</li>
            <li>• Notice you cannot tab outside the dialog (focus trap)</li>
          </ul>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Example 2: Form Dialog with Proper Labels
 *
 * Accessibility Features Demonstrated:
 * - Proper label association (htmlFor + id)
 * - Logical focus order
 * - Screen reader friendly form structure
 * - Focus moves to first input when dialog opens
 */
export function FormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. All fields are properly labeled
            for screen readers.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="name"
              className="text-right text-sm font-medium"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Enter your name"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="email"
              className="text-right text-sm font-medium"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Enter your email"
            />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Example 3: Confirmation Dialog (Destructive Action)
 *
 * Accessibility Features Demonstrated:
 * - Clear action description for screen readers
 * - Semantic button variants (destructive styling)
 * - Focus on safe action (Cancel) by default
 * - Warning context in description
 */
export function ConfirmationDialog() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsDeleting(false);
    // Handle actual deletion
  };

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
            account and remove all your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Example 4: Controlled Dialog with External State
 *
 * Accessibility Features Demonstrated:
 * - Programmatic control while maintaining accessibility
 * - Focus management preserved with controlled state
 * - Proper cleanup on close
 */
export function ControlledDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ task: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    setOpen(false);
    setFormData({ task: "" }); // Reset form
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Task</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task. The dialog state is controlled by the parent
              component while maintaining full accessibility.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="task" className="text-sm font-medium">
                  Task Description
                </label>
                <input
                  id="task"
                  type="text"
                  value={formData.task}
                  onChange={(e) =>
                    setFormData({ ...formData, task: e.target.value })
                  }
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="What needs to be done?"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Example 5: Alert Dialog (No Dismiss on Outside Click)
 *
 * Accessibility Features Demonstrated:
 * - Forces user acknowledgment (modal: true)
 * - Cannot close by clicking outside
 * - Can still close with Escape key
 * - Clear, focused message for screen readers
 */
export function AlertDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show Alert</Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Important Notice</DialogTitle>
          <DialogDescription>
            Your session is about to expire. Please save your work.
            This dialog requires acknowledgment and cannot be dismissed by
            clicking outside.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>I Understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Example 6: Multi-Step Dialog
 *
 * Accessibility Features Demonstrated:
 * - Maintains focus trap across steps
 * - Screen reader announces step changes
 * - Logical navigation flow
 * - Progress indication for screen readers
 */
export function MultiStepDialog() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleClose = () => {
    setStep(1); // Reset on close
  };

  return (
    <Dialog onOpenChange={(open) => !open && handleClose()}>
      <DialogTrigger asChild>
        <Button>Start Setup</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Setup Wizard - Step {step} of {totalSteps}
          </DialogTitle>
          <DialogDescription>
            Complete each step to finish the setup process.
            <span className="sr-only">
              You are on step {step} of {totalSteps}.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {step === 1 && (
            <div>
              <h4 className="mb-2 font-medium">Step 1: Personal Information</h4>
              <input
                type="text"
                placeholder="Name"
                className="w-full rounded-md border px-3 py-2"
                aria-label="Enter your name"
              />
            </div>
          )}
          {step === 2 && (
            <div>
              <h4 className="mb-2 font-medium">Step 2: Contact Details</h4>
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-md border px-3 py-2"
                aria-label="Enter your email address"
              />
            </div>
          )}
          {step === 3 && (
            <div>
              <h4 className="mb-2 font-medium">Step 3: Review</h4>
              <p className="text-sm text-muted-foreground">
                Please review your information before submitting.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              aria-label="Go to previous step"
            >
              Previous
            </Button>
          )}
          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              aria-label="Go to next step"
            >
              Next
            </Button>
          ) : (
            <DialogClose asChild>
              <Button aria-label="Complete setup">Finish</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Example 7: Dialog with Complex Content and Scrolling
 *
 * Accessibility Features Demonstrated:
 * - Scrollable content maintains accessibility
 * - Focus trap works with scrollable areas
 * - Keyboard navigation in scrollable regions
 */
export function ScrollableDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Terms</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read our terms and conditions carefully.
            Use arrow keys or scroll to navigate the content.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto pr-4" style={{ maxHeight: "400px" }}>
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold">1. Introduction</h3>
              <p className="mt-2 text-muted-foreground">
                These terms and conditions outline the rules and regulations
                for the use of our service. This content is scrollable and
                maintains full keyboard accessibility.
              </p>
            </section>
            <section>
              <h3 className="font-semibold">2. User Obligations</h3>
              <p className="mt-2 text-muted-foreground">
                Users must comply with all applicable laws and regulations.
                Focus remains trapped in the dialog even when scrolling.
              </p>
            </section>
            <section>
              <h3 className="font-semibold">3. Privacy Policy</h3>
              <p className="mt-2 text-muted-foreground">
                We respect your privacy and protect your personal data
                according to GDPR standards.
              </p>
            </section>
            {/* More sections for scrolling demo */}
            {Array.from({ length: 5 }).map((_, i) => (
              <section key={i}>
                <h3 className="font-semibold">{i + 4}. Additional Terms</h3>
                <p className="mt-2 text-muted-foreground">
                  Additional terms and conditions section {i + 1}.
                  This demonstrates scrollable content within an accessible dialog.
                </p>
              </section>
            ))}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Decline</Button>
          </DialogClose>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Complete Example Showcase Component
 *
 * Renders all examples for testing and demonstration
 */
export function DialogExamplesShowcase() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Dialog Accessibility Examples</h2>
        <p className="mb-6 text-muted-foreground">
          Each example demonstrates different accessibility features.
          Test with keyboard only and with a screen reader.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold">Basic Accessible Dialog</h3>
          <BasicAccessibleDialog />
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Form Dialog</h3>
          <FormDialog />
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Confirmation Dialog</h3>
          <ConfirmationDialog />
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Controlled Dialog</h3>
          <ControlledDialog />
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Alert Dialog</h3>
          <AlertDialog />
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Multi-Step Dialog</h3>
          <MultiStepDialog />
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Scrollable Dialog</h3>
          <ScrollableDialog />
        </div>
      </div>

      <div className="rounded-lg border bg-muted p-4">
        <h3 className="mb-2 font-semibold">Keyboard Testing Guide</h3>
        <ul className="space-y-1 text-sm">
          <li>✓ <kbd className="px-1 border rounded bg-background">Tab</kbd> - Navigate forward</li>
          <li>✓ <kbd className="px-1 border rounded bg-background">Shift+Tab</kbd> - Navigate backward</li>
          <li>✓ <kbd className="px-1 border rounded bg-background">Escape</kbd> - Close dialog</li>
          <li>✓ <kbd className="px-1 border rounded bg-background">Enter</kbd> - Activate buttons</li>
          <li>✓ <kbd className="px-1 border rounded bg-background">Space</kbd> - Activate buttons</li>
        </ul>
      </div>
    </div>
  );
}
