import type { TextLinkListProps } from "./TextLinkList.types";
import styles from "./TextLinkList.module.css";

/**
 * TextLinkList — a titled column of links, used inside footers and nav areas.
 *
 * Maps to the Figma "Text Link List" component.
 */
export function TextLinkList({
  title,
  hasTitle = true,
  density = "default",
  children,
  className,
  ...props
}: TextLinkListProps) {
  const classes = [styles["root"], className].filter(Boolean).join(" ");

  return (
    <nav className={classes} data-density={density} {...props}>
      {hasTitle && title && (
        <p className={styles["title"]}>{title}</p>
      )}
      <ul className={styles["items"]}>{children}</ul>
    </nav>
  );
}
