import type { HTMLAttributes } from "react";

export interface TestimonialData {
  /** Quote text */
  quote: string;
  /** Author name */
  authorName: string;
  /** Author description or role */
  authorDescription?: string;
  /** Avatar image URL */
  avatarSrc?: string;
  /** Avatar alt text */
  avatarAlt?: string;
}

export interface CardGridTestimonialsProps extends HTMLAttributes<HTMLElement> {
  /** Section heading text */
  heading: string;
  /** Optional subheading text below the heading */
  subheading?: string;
  /** Array of testimonials to render in the grid */
  testimonials: TestimonialData[];
}
