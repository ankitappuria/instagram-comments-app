import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PostCard from "../src/features/post/components/PostCard.jsx";

// ✅ Mock Avatar (isolate this component)
vi.mock("../src/shared/components/Avatar/Avatar", () => ({
  default: ({ name }) => <div data-testid="avatar">{name}</div>,
}));

describe("PostCard", () => {
  it("renders username and location", () => {
    render(<PostCard />);

    expect(
      screen.getByText("travel.diaries", { selector: ".post-username" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Santorini, Greece")).toBeInTheDocument();
  });

  it("renders avatar with correct username", () => {
    render(<PostCard />);

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveTextContent("travel.diaries");
  });

  it("renders post image with correct src", () => {
    render(<PostCard />);

    const image = screen.getByRole("img", { name: "post" });
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("unsplash.com"),
    );
  });

  it("renders action icons", () => {
    render(<PostCard />);

    expect(screen.getByText("♡")).toBeInTheDocument();
    expect(screen.getByText("💬")).toBeInTheDocument();
    expect(screen.getByText("✈︎")).toBeInTheDocument();
    expect(screen.getByText("🔖")).toBeInTheDocument();
  });

  it("renders likes count formatted", () => {
    render(<PostCard />);

    expect(screen.getByText("2,847 likes")).toBeInTheDocument();
  });

  it("renders caption with username", () => {
    render(<PostCard />);

    expect(
      screen.getByText("travel.diaries", { selector: ".post-username" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The kind of blue you only believe/),
    ).toBeInTheDocument();
  });

  it("renders post time", () => {
    render(<PostCard />);

    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
  });

  it("renders menu icon", () => {
    render(<PostCard />);

    expect(screen.getByText("···")).toBeInTheDocument();
  });

  it("has correct structure classes", () => {
    const { container } = render(<PostCard />);

    expect(container.querySelector(".post-card")).toBeInTheDocument();
    expect(container.querySelector(".post-header")).toBeInTheDocument();
    expect(container.querySelector(".post-actions")).toBeInTheDocument();
  });
});
