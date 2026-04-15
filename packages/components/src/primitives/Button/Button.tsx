import type { ButtonProps } from "./Button.types";
import styles from "./Button.module.css";

/**
 * Button — primary interactive primitive.
 *
 * Maps to the Figma "Button" component in the design system library.
 * See packages/code-connect/src/Button.figma.ts for the Figma mapping.
 */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  leadingIcon,
  trailingIcon,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = [
    styles["button"],
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    fullWidth ? styles["fullWidth"] : "",
    isLoading ? styles["loading"] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      {isLoading && <span className={styles["spinner"]} aria-hidden="true" />}
      {!isLoading && leadingIcon && (
        <span className={styles["icon"]} aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
      {!isLoading && trailingIcon && (
        <span className={styles["icon"]} aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  );
}
