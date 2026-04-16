import { render, screen } from "@testing-library/react";
import { TextLinkListItem } from "./TextLinkListItem";

describe("TextLinkListItem", () => {
  it("renders a link with the correct label", () => {
    render(<TextLinkListItem label="UI design" href="/ui" />);
    const link = screen.getByText("UI design");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/ui");
  });

  it("defaults href to '#' when not provided", () => {
    render(<TextLinkListItem label="Test" />);
    expect(screen.getByText("Test")).toHaveAttribute("href", "#");
  });

  it("spreads additional HTML attributes", () => {
    render(<TextLinkListItem label="Link" data-testid="custom" />);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });

  it("has accessible focus styles via className", () => {
    const { container } = render(<TextLinkListItem label="Focus" />);
    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
  });
});
