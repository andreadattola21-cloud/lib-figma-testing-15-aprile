import type { HTMLAttributes, ReactNode } from "react";

export interface HeaderNavItem {
  /** Navigation link label */
  label: string;
  /** Navigation link destination URL */
  href?: string;
  /** Whether this item is the currently active page */
  isActive?: boolean;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  /** Logo element rendered in the left branding area */
  logo?: ReactNode;
  /** Navigation items displayed as pills in the header */
  navItems?: HeaderNavItem[];
  /** Action elements (e.g. auth buttons) rendered on the right */
  actions?: ReactNode;
}
