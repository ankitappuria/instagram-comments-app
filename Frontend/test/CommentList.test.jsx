import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CommentList from "../src/components/CommentList";

// Mock child component
vi.mock("../src/components/CommentItem", () => ({
  default: ({ comment }) => <div data-testid="comment-item">{comment.text}</div>
}));

describe("CommentList", () => {
  const mockComments = [
    { _id: "1", text: "First comment" },
    { _id: "2", text: "Second comment" }
  ];

  it("renders skeletons when loading", () => {
    const { container } = render(
      <CommentList
        comments={[]}
        loading={true}
        loadingMore={false}
        hasMore={false}
        onLoadMore={() => {}}
        currentUser={null}
      />
    );

    expect(container.querySelectorAll(".comment-list-skeleton").length).toBe(3);
  });

  it("renders empty state when no comments", () => {
    render(
      <CommentList
        comments={[]}
        loading={false}
        loadingMore={false}
        hasMore={false}
        onLoadMore={() => {}}
        currentUser={null}
      />
    );

    expect(screen.getByText("No comments yet")).toBeInTheDocument();
    expect(screen.getByText("Be the first to comment")).toBeInTheDocument();
  });

  it("renders list of comments", () => {
    render(
      <CommentList
        comments={mockComments}
        loading={false}
        loadingMore={false}
        hasMore={false}
        onLoadMore={() => {}}
        currentUser={null}
      />
    );

    const items = screen.getAllByTestId("comment-item");
    expect(items.length).toBe(2);
    expect(screen.getByText("First comment")).toBeInTheDocument();
  });

  it("shows load more button when hasMore is true", () => {
    render(
      <CommentList
        comments={mockComments}
        loading={false}
        loadingMore={false}
        hasMore={true}
        onLoadMore={() => {}}
        currentUser={null}
      />
    );

    expect(screen.getByText("Load more comments")).toBeInTheDocument();
  });

  it("calls onLoadMore when button is clicked", () => {
    const mockFn = vi.fn();

    render(
      <CommentList
        comments={mockComments}
        loading={false}
        loadingMore={false}
        hasMore={true}
        onLoadMore={mockFn}
        currentUser={null}
      />
    );

    fireEvent.click(screen.getByText("Load more comments"));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("disables button and shows loading text when loadingMore", () => {
    render(
      <CommentList
        comments={mockComments}
        loading={false}
        loadingMore={true}
        hasMore={true}
        onLoadMore={() => {}}
        currentUser={null}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.textContent).toBe("Loading...");
  });
});