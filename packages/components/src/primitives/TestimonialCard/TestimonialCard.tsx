import type { TestimonialCardProps } from "./TestimonialCard.types";
import styles from "./TestimonialCard.module.css";

/**
 * TestimonialCard — displays a quote with author attribution.
 *
 * Maps to the Figma "Testimonial Card" component.
 */
export function TestimonialCard({
  quote,
  authorName,
  authorDescription,
  avatarSrc,
  avatarAlt = "",
  className,
  ...props
}: TestimonialCardProps) {
  const classes = [styles["card"], className].filter(Boolean).join(" ");

  return (
    <blockquote className={classes} {...props}>
      <p className={styles["quote"]}>{quote}</p>
      <div className={styles["avatarBlock"]}>
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={avatarAlt}
            className={styles["avatar"]}
          />
        ) : (
          <div
            className={styles["avatarPlaceholder"]}
            role="img"
            aria-label={avatarAlt || authorName}
          />
        )}
        <div className={styles["authorInfo"]}>
          <p className={styles["authorName"]}>{authorName}</p>
          {authorDescription && (
            <p className={styles["authorDescription"]}>
              {authorDescription}
            </p>
          )}
        </div>
      </div>
    </blockquote>
  );
}
