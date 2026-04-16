import figma from "@figma/code-connect";
import { Footer } from "@ds/components";

figma.connect(
  Footer,
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=175:4454",
  {
    example: () => (
      <Footer
        logo={<img src="/logo.svg" alt="Company logo" />}
        socialLinks={[
          { label: "Twitter", href: "https://twitter.com", icon: <span>X</span> },
          { label: "Instagram", href: "https://instagram.com", icon: <span>IG</span> },
          { label: "YouTube", href: "https://youtube.com", icon: <span>YT</span> },
          { label: "LinkedIn", href: "https://linkedin.com", icon: <span>LI</span> },
        ]}
        columns={[
          {
            title: "Use cases",
            links: [
              { label: "UI design", href: "/ui-design" },
              { label: "UX design", href: "/ux-design" },
              { label: "Wireframing", href: "/wireframing" },
              { label: "Diagramming", href: "/diagramming" },
              { label: "Brainstorming", href: "/brainstorming" },
              { label: "Online whiteboard", href: "/online-whiteboard" },
              { label: "Team collaboration", href: "/team-collaboration" },
            ],
          },
          {
            title: "Explore",
            links: [
              { label: "Design", href: "/design" },
              { label: "Prototyping", href: "/prototyping" },
              { label: "Development features", href: "/development-features" },
              { label: "Design systems", href: "/design-systems" },
              { label: "Collaboration features", href: "/collaboration-features" },
              { label: "Design process", href: "/design-process" },
              { label: "FigJam", href: "/figjam" },
            ],
          },
          {
            title: "Resources",
            links: [
              { label: "Blog", href: "/blog" },
              { label: "Best practices", href: "/best-practices" },
              { label: "Colors", href: "/colors" },
              { label: "Color wheel", href: "/color-wheel" },
              { label: "Support", href: "/support" },
              { label: "Developers", href: "/developers" },
              { label: "Resource library", href: "/resource-library" },
            ],
          },
        ]}
      />
    ),
  }
);
