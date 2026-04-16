import { render, screen } from "@testing-library/react";
import { Flex } from "./Flex";

describe("Flex", () => {
  it("renders children", () => {
    render(<Flex><span data-testid="child">Hello</span></Flex>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("applies row direction by default", () => {
    const { container } = render(<Flex><span>Test</span></Flex>);
    const style = container.firstElementChild?.getAttribute("style");
    expect(style).toContain("--flex-direction: row");
  });

  it("applies column direction", () => {
    const { container } = render(<Flex direction="column"><span>Test</span></Flex>);
    const style = container.firstElementChild?.getAttribute("style");
    expect(style).toContain("--flex-direction: column");
  });

  it("applies gap using ds-space token", () => {
    const { container } = render(<Flex gap={400}><span>Test</span></Flex>);
    const style = container.firstElementChild?.getAttribute("style");
    expect(style).toContain("--flex-gap: var(--ds-space-400)");
  });

  it("renders as inline-flex when inline prop is true", () => {
    const { container } = render(<Flex inline><span>Test</span></Flex>);
    expect(container.firstElementChild?.className).toContain("flex-inline");
  });

  it("applies justify-content mapping", () => {
    const { container } = render(<Flex justify="between"><span>Test</span></Flex>);
    const style = container.firstElementChild?.getAttribute("style");
    expect(style).toContain("--flex-justify: space-between");
  });

  it("applies align-items mapping", () => {
    const { container } = render(<Flex align="center"><span>Test</span></Flex>);
    const style = container.firstElementChild?.getAttribute("style");
    expect(style).toContain("--flex-align: center");
  });

  it("forwards HTML attributes via ...props", () => {
    render(<Flex data-testid="flex-root" role="group"><span>Test</span></Flex>);
    const el = screen.getByTestId("flex-root");
    expect(el).toHaveAttribute("role", "group");
  });

  it("merges custom className", () => {
    const { container } = render(<Flex className="custom"><span>Test</span></Flex>);
    expect(container.firstElementChild?.className).toContain("custom");
  });

  it("merges custom style", () => {
    const { container } = render(
      <Flex style={{ color: "red" }}><span>Test</span></Flex>
    );
    const style = container.firstElementChild?.getAttribute("style");
    expect(style).toContain("color: red");
  });
});
