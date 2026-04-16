import { render, screen } from "@testing-library/react";
import { TestimonialCard } from "./TestimonialCard";

describe("TestimonialCard", () => {
  const defaultProps = {
    quote: "This is an amazing product!",
    authorName: "Jane Doe",
    authorDescription: "CEO at Acme",
    avatarSrc: "https://example.com/avatar.jpg",
  };

  it("renders the quote text", () => {
    render(<TestimonialCard {...defaultProps} />);
    expect(screen.getByText(defaultProps.quote)).toBeInTheDocument();
  });

  it("renders as a blockquote element", () => {
    const { container } = render(<TestimonialCard {...defaultProps} />);
    expect(container.querySelector("blockquote")).toBeInTheDocument();
  });

  it("renders the author name and description", () => {
    render(<TestimonialCard {...defaultProps} />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("CEO at Acme")).toBeInTheDocument();
  });

  it("renders avatar image with alt text when avatarSrc is provided", () => {
    render(<TestimonialCard {...defaultProps} avatarAlt="Jane Doe photo" />);
    const img = screen.getByRole("img", { name: "Jane Doe photo" });
    expect(img).toHaveAttribute("src", defaultProps.avatarSrc);
  });

  it("renders a placeholder when avatarSrc is not provided", () => {
    render(
      <TestimonialCard
        quote="Great!"
        authorName="John"
      />
    );
    expect(screen.getByRole("img", { name: "John" })).toBeInTheDocument();
  });

  it("hides author description when not provided", () => {
    render(
      <TestimonialCard quote="Nice!" authorName="Alice" />
    );
    expect(screen.queryByText("CEO at Acme")).not.toBeInTheDocument();
  });

  it("spreads additional HTML attributes to the root element", () => {
    render(<TestimonialCard {...defaultProps} data-testid="custom" />);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });
});
