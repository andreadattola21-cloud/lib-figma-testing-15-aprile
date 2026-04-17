import type { ButtonGroupProps } from "./ButtonGroup.types";
import styles from "./ButtonGroup.module.css";

/**
 * ButtonGroup — lays out action buttons in a horizontal row.
 *
 * Use `align="justify"` to stretch buttons equally within the group.
 */
export function ButtonGroup({
  align = "justify",
  children,
  className,
  ...props
}: ButtonGroupProps) {
  const classes = [
    styles["buttonGroup"],
    styles[`align-${align}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div role="group" className={classes} {...props}>
      {children}
    </div>
  );
}
