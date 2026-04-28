import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReplyItem from "../src/components/ReplyItem";

// ✅ mock Avatar
vi.mock("../src/components/Avatar", () => ({
  default: ({ name }) => <div data-testid="avatar">{name}</div>,
}));

// ✅ mock helpers
vi.mock("../src/utils/helper", () => ({
  timeAgo: vi.fn(() => "1 hour ago"),
  stripMention: vi.fn((content) => content.replace(/@\w+\s?/, "")),
}));

describe("ReplyItem", () => {
  const baseReply = {
    _id: "1",
    userName: "alice",
    content: "@bob hello there",
    replyToUserName: "bob",
    createdAt: "2024-01-01",
  };

  it("renders username and avatar", () => {
    render(<ReplyItem reply={baseReply} onReply={() => {}} />);

    expect(
      screen.getByText("alice", { selector: ".reply-username" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("avatar")).toHaveTextContent("alice");
  });

  it("renders mention when replyToUserName exists", () => {
    render(<ReplyItem reply={baseReply} onReply={() => {}} />);

    expect(screen.getByText("@bob")).toBeInTheDocument();
  });

  it("renders stripped content (without mention)", () => {
    render(<ReplyItem reply={baseReply} onReply={() => {}} />);

    expect(screen.getByText("hello there")).toBeInTheDocument();
  });

  it("does NOT render mention if replyToUserName is missing", () => {
    const reply = { ...baseReply, replyToUserName: null };

    render(<ReplyItem reply={reply} onReply={() => {}} />);

    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });

  it("renders timestamp using timeAgo", () => {
    render(<ReplyItem reply={baseReply} onReply={() => {}} />);

    expect(screen.getByText("1 hour ago")).toBeInTheDocument();
  });

  it("calls onReply when Reply button is clicked", () => {
    const mockReply = vi.fn();

    render(<ReplyItem reply={baseReply} onReply={mockReply} />);

    fireEvent.click(screen.getByText("Reply"));

    expect(mockReply).toHaveBeenCalledWith(baseReply);
  });

  it("calls stripMention with correct arguments", async () => {
    const { stripMention } = await import("../src/utils/helper");

    render(<ReplyItem reply={baseReply} onReply={() => {}} />);

    expect(stripMention).toHaveBeenCalledWith(
      baseReply.content,
      baseReply.replyToUserName,
    );
  });
});
