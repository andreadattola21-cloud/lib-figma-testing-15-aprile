import { render, screen } from "@testing-library/react";
import { CardGridTestimonials } from "./CardGridTestimonials";
import type { TestimonialData } from "./CardGridTestimonials.types";

const mockTestimonials: TestimonialData[] = [
  {
    quote: "Amazing product!",
    authorName: "Jane Doe",
    authorDescription: "CEO",
    avatarSrc: "https://example.com/jane.jpg",
    avatarAlt: "Jane Doe photo",
  },
  {
    quote: "Highly recommended.",
    authorName: "John Smith",
    authorDescription: "Designer",
  },
  {
    quote: "Changed our workflow.",
    authorName: "Alice Johnson",
  },
];

describe("CardGridTestimonials", () => {
  it("renders as a section landmark", () => {
    render(
      <CardGridTestimonials
        heading="Testimonials"
        testimonials={mockTestimonials}
      />
    );
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("renders heading as an h2", () => {
    render(
      <CardGridTestimonials
        heading="What people say"
        testimonials={mockTestimonials}
      />
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "What people say" })
    ).toBeInTheDocument();
  });

  it("renders subheading when provided", () => {
    render(
      <CardGridTestimonials
        heading="Testimonials"
        subheading="Hear from our customers"
        testimonials={mockTestimonials}
      />
    );
    expect(screen.getByText("Hear from our customers")).toBeInTheDocument();
  });

  it("does not render subheading when omitted", () => {
    render(
      <CardGridTestimonials
        heading="Testimonials"
        testimonials={mockTestimonials}
      />
    );
    expect(
      screen.queryByText("Hear from our customers")
    ).not.toBeInTheDocument();
  });

  it("renders all testimonial cards", () => {
    render(
      <CardGridTestimonials
        heading="Testimonials"
        testimonials={mockTestimonials}
      />
    );
    expect(screen.getByText("Amazing product!")).toBeInTheDocument();
    expect(screen.getByText("Highly recommended.")).toBeInTheDocument();
    expect(screen.getByText("Changed our workflow.")).toBeInTheDocument();
  });

  it("renders author names for each card", () => {
    render(
      <CardGridTestimonials
        heading="Testimonials"
        testimonials={mockTestimonials}
      />
    );
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
  });

  it("spreads additional HTML attributes to the root element", () => {
    render(
      <CardGridTestimonials
        heading="Testimonials"
        testimonials={mockTestimonials}
        data-testid="testimonials-section"
      />
    );
    expect(screen.getByTestId("testimonials-section")).toBeInTheDocument();
  });
});
