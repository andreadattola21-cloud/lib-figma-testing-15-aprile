import { Header, Button } from "@ds/components";
import styles from "../App.module.css";

const figmaLogoUrl =
  "https://www.figma.com/api/mcp/asset/afa50485-b938-415d-b399-49cad6f1518d";

const figmaLogo = (
  <img
    src={figmaLogoUrl}
    alt="Figma"
    width={23}
    height={35}
    style={{ display: "block" }}
  />
);

const navItems = [
  { label: "Products", href: "#", isActive: true },
  { label: "Solutions", href: "#" },
  { label: "Community", href: "#" },
  { label: "Resources", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Contact", href: "#" },
];

export function HeaderShowcase() {
  return (
    <section className={styles["section"]}>
      <h2 className={styles["sectionTitle"]}>Header</h2>
      <p className={styles["sectionDescription"]}>
        Site-wide header composition with logo, navigation pill list, and
        action buttons. Navigation items support an active state with a
        highlighted pill background.
      </p>

      <div className={styles["showcase"]}>
        <div className={styles["showcaseLabel"]}>Default (with auth)</div>
        <div style={{ padding: 0 }}>
          <Header
            logo={figmaLogo}
            navItems={navItems}
            actions={
              <>
                <Button variant="secondary" size="sm">
                  Sign in
                </Button>
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </>
            }
          />
        </div>
      </div>

      <div className={styles["showcase"]} style={{ marginTop: 24 }}>
        <div className={styles["showcaseLabel"]}>Minimal (nav only)</div>
        <div style={{ padding: 0 }}>
          <Header
            navItems={[
              { label: "Home", href: "#", isActive: true },
              { label: "About", href: "#" },
              { label: "Blog", href: "#" },
            ]}
          />
        </div>
      </div>

      <div className={styles["showcase"]} style={{ marginTop: 24 }}>
        <div className={styles["showcaseLabel"]}>Logo + actions only</div>
        <div style={{ padding: 0 }}>
          <Header
            logo={figmaLogo}
            actions={
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            }
          />
        </div>
      </div>
    </section>
  );
}
