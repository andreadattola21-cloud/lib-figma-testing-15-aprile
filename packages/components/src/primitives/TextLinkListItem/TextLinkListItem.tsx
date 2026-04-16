import type { TextLinkListItemProps } from "./TextLinkListItem.types";
import styles from "./TextLinkListItem.module.css";

/**
 * TextLinkListItem — a single text link, typically used inside a TextLinkList.
 *
 * Maps to the Figma "Text Link List Item" component.
 */
export function TextLinkListItem({
  label,
  href = "#",
  className,
  ...props
}: TextLinkListItemProps) {
  const classes = [styles["link"], className].filter(Boolean).join(" ");

  return (
    <a href={href} className={classes} {...props}>
      {label}
    </a>
  );
}
