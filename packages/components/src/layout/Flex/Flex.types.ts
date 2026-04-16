import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Flex direction. @default "row" */
  direction?: FlexDirection;
  /** Cross-axis alignment. @default "start" */
  align?: FlexAlign;
  /** Main-axis alignment. @default "start" */
  justify?: FlexJustify;
  /** Wrap behavior. @default "nowrap" */
  wrap?: FlexWrap;
  /** Gap using --ds-space-* scale (e.g. 200 = 8px, 400 = 16px). */
  gap?: number;
  /** Render as inline-flex. @default false */
  inline?: boolean;
}
