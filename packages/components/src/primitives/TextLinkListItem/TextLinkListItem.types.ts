import type { HTMLAttributes } from "react";

export interface TextLinkListItemProps extends HTMLAttributes<HTMLElement> {
  /** Link label text */
  label: string;
  /** URL destination */
  href?: string;
}
