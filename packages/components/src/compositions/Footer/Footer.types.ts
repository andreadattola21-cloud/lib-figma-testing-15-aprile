import type { HTMLAttributes, ReactNode } from "react";

export interface FooterLink {
  /** Link text label */
  label: string;
  /** Link destination URL */
  href?: string;
}

export interface FooterColumn {
  /** Column heading text */
  title: string;
  /** List of links in the column */
  links: FooterLink[];
}

export interface FooterSocialLink {
  /** Accessible label for the social link */
  label: string;
  /** URL the social link points to */
  href: string;
  /** Icon element to render */
  icon: ReactNode;
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Logo element rendered in the top-left branding area */
  logo?: ReactNode;
  /** Social media link icons displayed below the logo */
  socialLinks?: FooterSocialLink[];
  /** Link list columns displayed in the footer body */
  columns?: FooterColumn[];
}
