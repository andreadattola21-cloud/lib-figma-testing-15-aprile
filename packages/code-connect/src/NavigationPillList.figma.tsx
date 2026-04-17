import figma from "@figma/code-connect";
import { Header } from "@ds/components";

/**
 * Navigation Pill List — the horizontal nav bar inside Header.
 */
figma.connect(
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=2194:14984",
  {
    example: () => (
      <Header
        navItems={[
          { label: "Products", href: "/products" },
          { label: "Solutions", href: "/solutions" },
          { label: "Community", href: "/community" },
          { label: "Resources", href: "/resources" },
          { label: "Pricing", href: "/pricing" },
          { label: "Contact", href: "/contact" },
        ]}
      />
    ),
  }
);
