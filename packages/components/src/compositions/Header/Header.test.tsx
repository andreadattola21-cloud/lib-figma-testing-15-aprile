import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

const mockNavItems = [
  { label: "Products", href: "/products", isActive: true },
  { label: "Solutions", href: "/solutions" },
  { label: "Community", href: "/community" },
  { label: "Resources", href: "/resources" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

describe("Header", () => {
  it("renders as a banner landmark", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders logo when provided", () => {
    render(<Header logo={<span data-testid="logo">Logo</span>} />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders navigation items as links", () => {
    render(<Header navItems={mockNavItems} />);
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Solutions")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders nav items with correct href", () => {
    render(<Header navItems={mockNavItems} />);
    const link = screen.getByText("Products");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/products");
  });

  it("sets aria-current=page on the active nav item", () => {
    render(<Header navItems={mockNavItems} />);
    const activeLink = screen.getByText("Products");
    expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  it("does not set aria-current on inactive nav items", () => {
    render(<Header navItems={mockNavItems} />);
    const inactiveLink = screen.getByText("Solutions");
    expect(inactiveLink).not.toHaveAttribute("aria-current");
  });

  it("wraps nav items in a nav with aria-label", () => {
    render(<Header navItems={mockNavItems} />);
    expect(
      screen.getByRole("navigation", { name: "Main navigation" })
    ).toBeInTheDocument();
  });

  it("defaults link href to '#' when not provided", () => {
    render(<Header navItems={[{ label: "Test" }]} />);
    expect(screen.getByText("Test")).toHaveAttribute("href", "#");
  });

  it("renders actions when provided", () => {
    render(
      <Header
        actions={
          <>
            <button>Sign in</button>
            <button>Register</button>
          </>
        }
      />
    );
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("does not render nav when navItems is empty", () => {
    render(<Header />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("does not render actions wrapper when actions is not provided", () => {
    const { container } = render(<Header />);
    const header = container.firstElementChild as HTMLElement;
    expect(header.children).toHaveLength(0);
  });

  it("applies active class on the active nav item", () => {
    render(<Header navItems={mockNavItems} />);
    const activeLink = screen.getByText("Products");
    expect(activeLink.className).toContain("navItemActive");
  });

  it("spreads additional HTML attributes to the root element", () => {
    render(<Header data-testid="custom-header" />);
    expect(screen.getByTestId("custom-header")).toBeInTheDocument();
  });
});
