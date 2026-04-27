import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Avatar from "../src/components/Avatar";

// ✅ mock helper
vi.mock("../src/utils/helper", () => ({
  getAvatarColor: vi.fn(() => "red")
}));

describe("Avatar", () => {
  it("renders first letter of name in uppercase", () => {
    render(<Avatar name="john" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("renders '?' when name is not provided", () => {
    render(<Avatar />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("applies default avatar class", () => {
    const { container } = render(<Avatar name="john" />);
    expect(container.firstChild).toHaveClass("avatar");
  });

  it("applies small size class", () => {
    const { container } = render(<Avatar name="john" size={28} />);
    expect(container.firstChild).toHaveClass("avatar--small");
  });

  it("applies medium size class", () => {
    const { container } = render(<Avatar name="john" size={38} />);
    expect(container.firstChild).toHaveClass("avatar--medium");
  });

  it("applies large size class", () => {
    const { container } = render(<Avatar name="john" size={42} />);
    expect(container.firstChild).toHaveClass("avatar--large");
  });

  it("applies background color from helper", () => {
    const { container } = render(<Avatar name="john" />);
    expect(container.firstChild).toHaveStyle({ background: "red" });
  });

  it("calls getAvatarColor with name", async () => {
    const { getAvatarColor } = await import("../src/utils/helper");

    render(<Avatar name="john" />);
    expect(getAvatarColor).toHaveBeenCalledWith("john");
  });
});