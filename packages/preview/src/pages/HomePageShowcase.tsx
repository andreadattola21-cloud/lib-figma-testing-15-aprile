import {
  Button,
  Header,
  HeroActions,
  CardGridTestimonials,
  Footer,
} from "@ds/components";
import type { TestimonialData } from "@ds/components";
import styles from "./HomePageShowcase.module.css";

/* ─── Asset URLs from Figma MCP (get_design_context) ──────── */
const imgShape =
  "https://www.figma.com/api/mcp/asset/7eb291a9-787d-478c-979d-f340422cebdf";
const imgSection =
  "https://www.figma.com/api/mcp/asset/8dbc8e7a-cf1b-4637-b6fa-81177741b449";
const imgFigmaLogo =
  "https://www.figma.com/api/mcp/asset/7c61a63f-20fc-43da-9c57-4623170c630d";
const imgFigmaLogo1 =
  "https://www.figma.com/api/mcp/asset/50628586-5724-45c6-aeb2-0c49fd1671e7";
const imgXLogo =
  "https://www.figma.com/api/mcp/asset/561f0c7d-c265-4e39-845f-900c3c13f5c3";
const imgLogoInstagram =
  "https://www.figma.com/api/mcp/asset/d54d9282-12b1-4b64-aef8-7d8aba0af1cc";
const imgLogoYouTube =
  "https://www.figma.com/api/mcp/asset/449fbe68-9e60-4301-bc6c-ed6d61cddfe2";
const imgLinkedIn =
  "https://www.figma.com/api/mcp/asset/dfad7a2a-dcab-4041-8612-be49e98b6205";
const imgMenuIcon =
  "https://www.figma.com/api/mcp/asset/c3430777-aafc-479a-a68f-c4e96afdaf75";

/* ─── Data ─────────────────────────────────────────────────── */
const navItems = [
  { label: "Products", href: "#" },
  { label: "Solutions", href: "#" },
  { label: "Community", href: "#" },
  { label: "Resources", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Contact", href: "#" },
];

const testimonials: TestimonialData[] = Array.from({ length: 6 }, () => ({
  quote: "\u201CQuote\u201D",
  authorName: "Title",
  authorDescription: "Description",
  avatarSrc: imgShape,
  avatarAlt: "Author avatar",
}));

const footerColumns = [
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

const footerSocialLinks = [
  {
    label: "X (Twitter)",
    href: "https://twitter.com/figma",
    icon: <img src={imgXLogo} alt="" width={24} height={24} />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/figma",
    icon: <img src={imgLogoInstagram} alt="" width={24} height={24} />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@figma",
    icon: <img src={imgLogoYouTube} alt="" width={24} height={24} />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/figma",
    icon: <img src={imgLinkedIn} alt="" width={24} height={24} />,
  },
];

const headerLogo = (
  <img
    src={imgFigmaLogo1}
    alt="Figma"
    width={40}
    height={35}
    className={styles["logoImg"]}
  />
);

const footerLogo = (
  <img
    src={imgFigmaLogo}
    alt="Figma"
    width={23}
    height={35}
    className={styles["logoImg"]}
  />
);

/* ─── Page Component ───────────────────────────────────────── */
export function HomePageShowcase() {
  return (
    <div className={styles["homePage"]}>
      {/* Header */}
      <Header
        logo={headerLogo}
        navItems={navItems}
        actions={
          <>
            {/* Desktop: Sign in + Register buttons */}
            <div className={styles["desktopOnly"]}>
              <Button variant="secondary" size="md">
                Sign in
              </Button>
              <Button variant="primary" size="md">
                Register
              </Button>
            </div>
            {/* Mobile: Hamburger icon button */}
            <button
              className={`${styles["mobileOnly"]} ${styles["hamburgerButton"]}`}
              aria-label="Open menu"
            >
              <img
                src={imgMenuIcon}
                alt=""
                width={20}
                height={20}
                className={styles["hamburgerIcon"]}
                aria-hidden="true"
              />
            </button>
          </>
        }
      />

      {/* Hero Actions */}
      <HeroActions title="Title" subtitle="Subtitle">
        <Button variant="secondary" size="md">
          Button
        </Button>
        <Button variant="primary" size="md">
          Button
        </Button>
      </HeroActions>

      {/* Image Section */}
      <div className={styles["imageSection"]}>
        <div className={styles["imageSectionBackground"]}>
          <img
            src={imgSection}
            alt="Section placeholder"
            className={styles["imageSectionImg"]}
          />
        </div>
      </div>

      {/* Card Grid Testimonials */}
      <CardGridTestimonials
        heading="Heading"
        subheading="Subheading"
        testimonials={testimonials}
      />

      {/* Footer */}
      <Footer
        logo={footerLogo}
        socialLinks={footerSocialLinks}
        columns={footerColumns}
      />
    </div>
  );
}
