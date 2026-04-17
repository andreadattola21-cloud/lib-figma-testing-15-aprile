import figma from "@figma/code-connect";
import { Header, Button } from "@ds/components";

figma.connect(
  Header,
  "https://www.figma.com/design/BPMhmQslHbF2DOtjj9VMQw?node-id=175:4449",
  {
    example: () => (
      <Header
        logo={<img src="/logo.svg" alt="Company logo" width={40} height={35} />}
        navItems={[
          { label: "Products", href: "/products", isActive: true },
          { label: "Solutions", href: "/solutions" },
          { label: "Community", href: "/community" },
          { label: "Resources", href: "/resources" },
          { label: "Pricing", href: "/pricing" },
          { label: "Contact", href: "/contact" },
        ]}
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
    ),
  }
);
