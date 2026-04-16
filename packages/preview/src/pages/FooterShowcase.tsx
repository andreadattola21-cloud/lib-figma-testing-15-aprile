import { Footer } from "@ds/components";
import styles from "../App.module.css";

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

const columns = [
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
];

const socialLinks = [
  { label: "X (Twitter)", href: "https://twitter.com/figma", icon: xIcon },
  { label: "Instagram", href: "https://instagram.com/figma", icon: instagramIcon },
  { label: "YouTube", href: "https://youtube.com/@figma", icon: youtubeIcon },
  { label: "LinkedIn", href: "https://linkedin.com/company/figma", icon: linkedinIcon },
];

export function FooterShowcase() {
  return (
    <section className={styles["section"]}>
      <h2 className={styles["sectionTitle"]}>Footer</h2>
      <p className={styles["sectionDescription"]}>
        Site-wide footer composition with branding area (logo + social links)
        and multiple columns of navigation links.
      </p>

      <div className={styles["showcase"]}>
        <div className={styles["showcaseLabel"]}>Default</div>
        <div style={{ padding: 0 }}>
          <Footer
            logo={figmaLogo}
            socialLinks={socialLinks}
            columns={columns}
          />
        </div>
      </div>

      <div className={styles["showcase"]} style={{ marginTop: 24 }}>
        <div className={styles["showcaseLabel"]}>Minimal (no logo / socials)</div>
        <div style={{ padding: 0 }}>
          <Footer
            columns={[
              {
                title: "Company",
                links: [
                  { label: "About", href: "#" },
                  { label: "Careers", href: "#" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { label: "Privacy", href: "#" },
                  { label: "Terms", href: "#" },
                ],
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
