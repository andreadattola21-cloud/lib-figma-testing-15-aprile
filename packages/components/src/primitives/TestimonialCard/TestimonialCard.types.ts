import type { BlockquoteHTMLAttributes } from "react";

export interface TestimonialCardProps extends BlockquoteHTMLAttributes<HTMLQuoteElement> {
  /** Quote text displayed in the card */
  quote: string;
  /** Author name shown below the quote */
  authorName: string;
  /** Author description or role */
  authorDescription?: string | undefined;
  /** URL for the author avatar image */
  avatarSrc?: string | undefined;
  /** Alt text for the avatar image */
  avatarAlt?: string | undefined;
}
