import type { HTMLAttributes, ReactNode } from "react";

export interface TextLinkListProps extends HTMLAttributes<HTMLElement> {
  /** Column heading — rendered as a bold label above the links. */
  title?: string | undefined;
  /** Whether to show the title. Defaults to true when title is provided. */
  hasTitle?: boolean | undefined;
  /** Visual density: "default" or "compact". */
  density?: "default" | "compact" | undefined;
  /** Link items rendered as children. */
  children: ReactNode;
}
