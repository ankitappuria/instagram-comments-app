import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CommentItem from "../src/features/comments/components/CommentItem";

// ✅ Mock child components
vi.mock("../src/shared/components/Avatar/Avatar", () => ({
  default: ({ name }) => <div data-testid="avatar">{name}</div>
}));

vi.mock("../src/features/comments/components/ReplyList.jsx", () => ({
  default: ({ comment }) => (
    <div data-testid="reply-list">Replies for {comment._id}</div>
  )
}));


// ✅ Mock helper
vi.mock("../src/shared/utils/time", () => ({
  timeAgo: vi.fn(() => "2 hours ago")
}));

describe("CommentItem", () => {
  const mockComment = {
    _id: "1",
    userName: "John",
    content: "This is a comment",
    createdAt: "2024-01-01T00:00:00Z"
  };

  it("renders username and content", () => {
    render(<CommentItem comment={mockComment} currentUser={null} />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("This is a comment")).toBeInTheDocument();
  });

  it("renders Avatar with correct name", () => {
    render(<CommentItem comment={mockComment} currentUser={null} />);

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveTextContent("John");
  });

  it("renders formatted timestamp using timeAgo", () => {
    render(<CommentItem comment={mockComment} currentUser={null} />);

    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
  });

  it("renders ReplyList with correct comment", () => {
    render(<CommentItem comment={mockComment} currentUser={null} />);

    expect(screen.getByTestId("reply-list")).toHaveTextContent("Replies for 1");
  });

  it("applies correct CSS structure", () => {
    const { container } = render(
      <CommentItem comment={mockComment} currentUser={null} />
    );

    expect(container.querySelector(".comment-item")).toBeInTheDocument();
    expect(container.querySelector(".comment-bubble")).toBeInTheDocument();
    expect(container.querySelector(".comment-meta")).toBeInTheDocument();
  });
});