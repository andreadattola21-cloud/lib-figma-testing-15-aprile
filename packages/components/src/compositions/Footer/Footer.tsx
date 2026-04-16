import type { FooterProps } from "./Footer.types";
import styles from "./Footer.module.css";

/**
 * Footer — site-wide footer composition.
 *
 * Displays a branding area (logo + social links) alongside
 * multiple columns of navigation links.
 */
export function Footer({
  logo,
  socialLinks = [],
  columns = [],
  className,
  ...props
}: FooterProps) {
  const classes = [styles["footer"], className].filter(Boolean).join(" ");

  return (
    <footer className={classes} {...props}>
      {(logo || socialLinks.length > 0) && (
        <div className={styles["branding"]}>
          {logo && <div className={styles["logo"]}>{logo}</div>}
          {socialLinks.length > 0 && (
            <nav
              aria-label="Social media links"
              className={styles["socialLinks"]}
            >
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={styles["socialLink"]}
                  aria-label={link.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.icon}
                </a>
              ))}
            </nav>
          )}
        </div>
      )}
      {columns.length > 0 && (
        <div className={styles["columns"]}>
          {columns.map((column) => (
            <div key={column.title} className={styles["column"]}>
              <h3 className={styles["columnTitle"]}>{column.title}</h3>
              <ul className={styles["columnLinks"]}>
                {column.links.map((link) => (
                  <li key={link.label} className={styles["columnLinkItem"]}>
                    <a
                      href={link.href ?? "#"}
                      className={styles["columnLink"]}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </footer>
  );
}
