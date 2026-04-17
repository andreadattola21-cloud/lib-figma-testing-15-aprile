import type { TextContentTitleProps } from "./TextContentTitle.types";
import styles from "./TextContentTitle.module.css";

/**
 * TextContentTitle — displays a hero-style title with an optional subtitle.
 *
 * Supports left, center, and right alignment.
 */
export function TextContentTitle({
  title,
  subtitle,
  align = "center",
  className,
  ...props
}: TextContentTitleProps) {
  const classes = [
    styles["textContentTitle"],
    styles[`align-${align}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      <h1 className={styles["title"]}>{title}</h1>
      {subtitle && <p className={styles["subtitle"]}>{subtitle}</p>}
    </div>
  );
}
