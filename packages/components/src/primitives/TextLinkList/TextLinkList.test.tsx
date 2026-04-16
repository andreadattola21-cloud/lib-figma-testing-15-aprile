import { render, screen } from "@testing-library/react";
import { TextLinkList } from "./TextLinkList";

describe("TextLinkList", () => {
  it("renders a nav with title and children", () => {
    render(
      <TextLinkList title="Product">
        <li><a href="/features">Features</a></li>
      </TextLinkList>
    );
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
  });

  it("hides the title when hasTitle is false", () => {
    render(
      <TextLinkList title="Product" hasTitle={false}>
        <li><a href="/">Link</a></li>
      </TextLinkList>
    );
    expect(screen.queryByText("Product")).not.toBeInTheDocument();
  });

  it("sets data-density attribute for compact mode", () => {
    const { container } = render(
      <TextLinkList density="compact">
        <li><a href="/">Link</a></li>
      </TextLinkList>
    );
    const nav = container.querySelector("nav");
    expect(nav).toHaveAttribute("data-density", "compact");
  });

  it("renders as a nav landmark", () => {
    render(
      <TextLinkList title="Resources" aria-label="Resources">
        <li><a href="/">Link</a></li>
      </TextLinkList>
    );
    expect(screen.getByRole("navigation", { name: "Resources" })).toBeInTheDocument();
  });
});
