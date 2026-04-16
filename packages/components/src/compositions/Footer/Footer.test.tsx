import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

const mockColumns = [
  {
    title: "Use cases",
    links: [
      { label: "UI design", href: "/ui-design" },
      { label: "UX design", href: "/ux-design" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Design", href: "/design" },
      { label: "Prototyping", href: "/prototyping" },
    ],
  },
];

const mockSocialLinks = [
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: <span data-testid="x-icon">X</span>,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <span data-testid="ig-icon">IG</span>,
  },
];

describe("Footer", () => {
  it("renders as a footer landmark", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders column titles as h3 headings", () => {
    render(<Footer columns={mockColumns} />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent("Use cases");
    expect(headings[1]).toHaveTextContent("Explore");
  });

  it("renders column links with correct href", () => {
    render(<Footer columns={mockColumns} />);
    const link = screen.getByText("UI design");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/ui-design");
  });

  it("renders social links with accessible labels and target _blank", () => {
    render(<Footer socialLinks={mockSocialLinks} />);
    const twitterLink = screen.getByLabelText("Twitter");
    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute("href", "https://twitter.com");
    expect(twitterLink).toHaveAttribute("target", "_blank");
    expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("wraps social links in a nav with aria-label", () => {
    render(<Footer socialLinks={mockSocialLinks} />);
    expect(
      screen.getByRole("navigation", { name: "Social media links" })
    ).toBeInTheDocument();
  });

  it("renders logo when provided", () => {
    render(<Footer logo={<span data-testid="logo">Logo</span>} />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("defaults link href to '#' when not provided", () => {
    render(
      <Footer columns={[{ title: "Test", links: [{ label: "No href" }] }]} />
    );
    expect(screen.getByText("No href")).toHaveAttribute("href", "#");
  });

  it("spreads additional HTML attributes to the root element", () => {
    render(<Footer data-testid="custom-footer" />);
    expect(screen.getByTestId("custom-footer")).toBeInTheDocument();
  });
});
