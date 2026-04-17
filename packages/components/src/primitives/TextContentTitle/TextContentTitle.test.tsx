import { render, screen } from "@testing-library/react";
import { TextContentTitle } from "./TextContentTitle";

describe("TextContentTitle", () => {
  it("renders the title as an h1", () => {
    render(<TextContentTitle title="Hello World" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Hello World" })
    ).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<TextContentTitle title="Title" subtitle="Sub text" />);
    expect(screen.getByText("Sub text")).toBeInTheDocument();
  });

  it("does not render subtitle when omitted", () => {
    render(<TextContentTitle title="Title" />);
    expect(screen.queryByText("Sub text")).not.toBeInTheDocument();
  });

  it("applies center alignment class by default", () => {
    const { container } = render(<TextContentTitle title="Title" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("align-center");
  });

  it("applies left alignment class", () => {
    const { container } = render(
      <TextContentTitle title="Title" align="left" />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("align-left");
  });

  it("applies right alignment class", () => {
    const { container } = render(
      <TextContentTitle title="Title" align="right" />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("align-right");
  });

  it("spreads additional HTML attributes to the root element", () => {
    render(<TextContentTitle title="Title" data-testid="custom" />);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });
});
