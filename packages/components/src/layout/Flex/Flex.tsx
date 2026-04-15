import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import styles from "./Flex.module.css";

type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: FlexWrap;
  gap?: number;
  inline?: boolean;
}

/**
 * Flex — layout primitive that wraps CSS flexbox.
 * Accepts semantic gap values mapped to the --ds-space-* scale.
 */
export function Flex({
  direction = "row",
  align = "start",
  justify = "start",
  wrap = "nowrap",
  gap,
  inline = false,
  children,
  style,
  className,
  ...props
}: FlexProps) {
  const justifyMap: Record<FlexJustify, string> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  };

  const alignMap: Record<FlexAlign, string> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
    baseline: "baseline",
  };

  const inlineStyle: CSSProperties = {
    "--flex-direction": direction,
    "--flex-align": alignMap[align],
    "--flex-justify": justifyMap[justify],
    "--flex-wrap": wrap,
    ...(gap !== undefined ? { "--flex-gap": `var(--ds-space-${gap})` } : {}),
    ...style,
  } as CSSProperties;

  const classes = [
    inline ? styles["flex-inline"] : styles["flex"],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...props} className={classes} style={inlineStyle}>
      {children}
    </div>
  );
}
