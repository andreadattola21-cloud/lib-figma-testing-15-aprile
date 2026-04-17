import type { HeaderProps } from "./Header.types";
import styles from "./Header.module.css";

/**
 * Header — site-wide header composition.
 *
 * Displays a logo, horizontal navigation pill list,
 * and an actions area (e.g. auth buttons).
 */
export function Header({
  logo,
  navItems = [],
  actions,
  className,
  ...props
}: HeaderProps) {
  const classes = [styles["header"], className].filter(Boolean).join(" ");

  return (
    <header className={classes} {...props}>
      {logo && <div className={styles["logo"]}>{logo}</div>}

      {navItems.length > 0 && (
        <nav aria-label="Main navigation" className={styles["nav"]}>
          <ul className={styles["navList"]}>
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href ?? "#"}
                  className={[
                    styles["navItem"],
                    item.isActive ? styles["navItemActive"] : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={item.isActive ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {actions && <div className={styles["actions"]}>{actions}</div>}
    </header>
  );
}
