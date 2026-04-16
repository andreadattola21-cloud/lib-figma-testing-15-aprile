import { Button, Footer } from "@ds/components";
import styles from "./FullPage.module.css";

/* Figma asset images — exported directly from the design */
const figmaLogoUrl = "https://www.figma.com/api/mcp/asset/133b5a1c-f7a7-4c25-8c21-29490d33de4c";
const xLogoUrl = "https://www.figma.com/api/mcp/asset/85073b0f-c7a3-4ac8-a20d-eb738f9782c6";
const instagramLogoUrl = "https://www.figma.com/api/mcp/asset/db145ac0-769b-4cde-9482-08c1c7352974";
const youtubeLogoUrl = "https://www.figma.com/api/mcp/asset/e9c49ff1-52f1-4506-98cc-9b13a2105e0e";
const linkedinLogoUrl = "https://www.figma.com/api/mcp/asset/931adcd5-5d4b-4a29-8b2f-18867e390ec1";

const figmaLogo = (
  <img src={figmaLogoUrl} alt="Figma" width={23} height={35} style={{ display: "block" }} />
);

const xIcon = (
  <img src={xLogoUrl} alt="" width={24} height={24} style={{ display: "block", width: "100%", height: "100%" }} />
);

const instagramIcon = (
  <img src={instagramLogoUrl} alt="" width={24} height={24} style={{ display: "block", width: "100%", height: "100%" }} />
);

const youtubeIcon = (
  <img src={youtubeLogoUrl} alt="" width={24} height={24} style={{ display: "block", width: "100%", height: "100%" }} />
);

const linkedinIcon = (
  <img src={linkedinLogoUrl} alt="" width={24} height={24} style={{ display: "block", width: "100%", height: "100%" }} />
);

export function FullPage() {
  return (
    <div className={styles["page"]}>
      {/* Hero section */}
      <section className={styles["hero"]}>
        <div className={styles["heroContent"]}>
          <h1 className={styles["heroTitle"]}>
            Design System Preview
          </h1>
          <p className={styles["heroSubtitle"]}>
            A live preview of all components assembled into a realistic page
            layout. This demonstrates how primitives and compositions work
            together.
          </p>
          <div className={styles["heroCta"]}>
            <Button variant="primary" size="lg">
              Get started
            </Button>
            <Button variant="secondary" size="lg">
              Learn more
            </Button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className={styles["features"]}>
        <h2 className={styles["featuresTitle"]}>Components</h2>
        <div className={styles["featureGrid"]}>
          <div className={styles["featureCard"]}>
            <h3 className={styles["featureCardTitle"]}>Button</h3>
            <p className={styles["featureCardText"]}>
              Primary interactive primitive with variants, sizes, and states.
            </p>
            <Button variant="primary" size="sm">Try it</Button>
          </div>
          <div className={styles["featureCard"]}>
            <h3 className={styles["featureCardTitle"]}>Footer</h3>
            <p className={styles["featureCardText"]}>
              Composition with branding, social links, and navigation columns.
            </p>
            <Button variant="secondary" size="sm">View below</Button>
          </div>
          <div className={styles["featureCard"]}>
            <h3 className={styles["featureCardTitle"]}>Flex</h3>
            <p className={styles["featureCardText"]}>
              Layout primitive for CSS flexbox with semantic spacing tokens.
            </p>
            <Button variant="ghost" size="sm">Explore</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        logo={figmaLogo}
        socialLinks={[
          { label: "X (Twitter)", href: "https://twitter.com/figma", icon: xIcon },
          { label: "Instagram", href: "https://instagram.com/figma", icon: instagramIcon },
          { label: "YouTube", href: "https://youtube.com/@figma", icon: youtubeIcon },
          { label: "LinkedIn", href: "https://linkedin.com/company/figma", icon: linkedinIcon },
        ]}
        columns={[
          {
            title: "Use cases",
            links: [
              { label: "UI design", href: "#" },
              { label: "UX design", href: "#" },
              { label: "Wireframing", href: "#" },
              { label: "Diagramming", href: "#" },
              { label: "Brainstorming", href: "#" },
              { label: "Online whiteboard", href: "#" },
              { label: "Team collaboration", href: "#" },
            ],
          },
          {
            title: "Explore",
            links: [
              { label: "Design", href: "#" },
              { label: "Prototyping", href: "#" },
              { label: "Development features", href: "#" },
              { label: "Design systems", href: "#" },
              { label: "Collaboration features", href: "#" },
              { label: "Design process", href: "#" },
              { label: "FigJam", href: "#" },
            ],
          },
          {
            title: "Resources",
            links: [
              { label: "Blog", href: "#" },
              { label: "Best practices", href: "#" },
              { label: "Colors", href: "#" },
              { label: "Color wheel", href: "#" },
              { label: "Support", href: "#" },
              { label: "Developers", href: "#" },
              { label: "Resource library", href: "#" },
            ],
          },
        ]}
      />
    </div>
  );
}
