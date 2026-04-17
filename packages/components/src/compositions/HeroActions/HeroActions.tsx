import { TextContentTitle } from "../../primitives/TextContentTitle";
import type { HeroActionsProps } from "./HeroActions.types";
import styles from "./HeroActions.module.css";

/**
 * HeroActions — a hero section with centered title, subtitle,
 * and an action area for buttons.
 */
export function HeroActions({
  title,
  subtitle,
  children,
  className,
  ...props
}: HeroActionsProps) {
  const classes = [styles["heroActions"], className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} aria-label={title} {...props}>
      <TextContentTitle
        title={title}
        {...(subtitle !== undefined ? { subtitle } : {})}
        align="center"
      />
      {children && <div className={styles["actions"]}>{children}</div>}
    </section>
  );
}
