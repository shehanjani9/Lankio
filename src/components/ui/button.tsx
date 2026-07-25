import { forwardRef, type ButtonHTMLAttributes } from 'react';

// Centralizes the fdprocessedid fix: any browser extension that stamps
// attributes onto <button> elements before React hydrates (autofill/form
// fillers, some password managers) causes a hydration-mismatch warning on
// that element specifically. suppressHydrationWarning only silences
// attribute diffs on the exact node it's set on, so routing every button in
// the app through this one component means new buttons are covered for
// free -- nobody has to remember to add the prop file by file.
export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function Button({ className, children, ...props }, ref) {
    return (
      <button ref={ref} suppressHydrationWarning className={className} {...props}>
        {children}
      </button>
    );
  }
);
