import { render, screen } from "@testing-library/react";
import { HeroActions } from "./HeroActions";

describe("HeroActions", () => {
  it("renders as a section landmark", () => {
    render(<HeroActions title="Welcome" />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("renders title as an h1 heading", () => {
    render(<HeroActions title="Welcome" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Welcome" })
    ).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<HeroActions title="Welcome" subtitle="Get started today" />);
    expect(screen.getByText("Get started today")).toBeInTheDocument();
  });

  it("does not render subtitle when omitted", () => {
    render(<HeroActions title="Welcome" />);
    expect(screen.queryByText("Get started today")).not.toBeInTheDocument();
  });

  it("renders action children", () => {
    render(
      <HeroActions title="Welcome">
        <button>Primary</button>
        <button>Secondary</button>
      </HeroActions>
    );
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("Secondary")).toBeInTheDocument();
  });

  it("does not render actions wrapper when no children provided", () => {
    const { container } = render(<HeroActions title="Welcome" />);
    const section = container.firstElementChild as HTMLElement;
    expect(section.children).toHaveLength(1);
  });

  it("spreads additional HTML attributes to the root element", () => {
    render(<HeroActions title="Welcome" data-testid="hero" />);
    expect(screen.getByTestId("hero")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <HeroActions title="Welcome" className="custom" />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("custom");
  });
});
