import { TestimonialCard } from "../../primitives/TestimonialCard";
import type { CardGridTestimonialsProps } from "./CardGridTestimonials.types";
import styles from "./CardGridTestimonials.module.css";

/**
 * CardGridTestimonials — a section with heading, subheading, and a
 * responsive grid of testimonial cards.
 *
 * Cards flex-wrap into rows of 3 with a 300px minimum width per card.
 */
export function CardGridTestimonials({
  heading,
  subheading,
  testimonials,
  className,
  ...props
}: CardGridTestimonialsProps) {
  const classes = [styles["section"], className].filter(Boolean).join(" ");

  return (
    <section className={classes} aria-label={heading} {...props}>
      <div className={styles["header"]}>
        <h2 className={styles["heading"]}>{heading}</h2>
        {subheading && (
          <p className={styles["subheading"]}>{subheading}</p>
        )}
      </div>
      <div className={styles["grid"]}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.authorName}-${index}`}
            quote={testimonial.quote}
            authorName={testimonial.authorName}
            authorDescription={testimonial.authorDescription}
            avatarSrc={testimonial.avatarSrc}
            avatarAlt={testimonial.avatarAlt}
            className={styles["gridItem"]}
          />
        ))}
      </div>
    </section>
  );
}
