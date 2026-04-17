import { render, screen } from "@testing-library/react";
import { ButtonGroup } from "./ButtonGroup";

describe("ButtonGroup", () => {
  it("renders children", () => {
    render(
      <ButtonGroup>
        <button>Action A</button>
        <button>Action B</button>
      </ButtonGroup>
    );
    expect(screen.getByText("Action A")).toBeInTheDocument();
    expect(screen.getByText("Action B")).toBeInTheDocument();
  });

  it("has role=group for accessibility", () => {
    render(
      <ButtonGroup>
        <button>Click</button>
      </ButtonGroup>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("applies justify alignment class by default", () => {
    const { container } = render(
      <ButtonGroup>
        <button>A</button>
      </ButtonGroup>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("align-justify");
  });

  it("applies center alignment class", () => {
    const { container } = render(
      <ButtonGroup align="center">
        <button>A</button>
      </ButtonGroup>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("align-center");
  });

  it("spreads additional HTML attributes to the root element", () => {
    render(
      <ButtonGroup data-testid="group">
        <button>A</button>
      </ButtonGroup>
    );
    expect(screen.getByTestId("group")).toBeInTheDocument();
  });
});
