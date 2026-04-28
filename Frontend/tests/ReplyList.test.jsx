import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReplyList from "../src/components/ReplyList.jsx";

// ✅ mock children
vi.mock("../src/components/ReplyItem", () => ({
  default: ({ reply }) => <div data-testid="reply-item">{reply._id}</div>
}));

vi.mock("../src/components/CommentInput", () => ({
  default: ({ onSubmit }) => (
    <button data-testid="comment-input" onClick={() => onSubmit("test reply")}>
      Submit Reply
    </button>
  )
}));

// ✅ mock hook
const mockHook = vi.fn();
vi.mock("../src/hooks/useReplies", () => ({
  useReplies: (...args) => mockHook(...args)
}));

describe("ReplyList", () => {
  const baseHookData = {
    replies: [],
    expanded: false,
    loadingMore: false,
    hasMore: false,
    replyCount: 0,
    expand: vi.fn(),
    collapse: vi.fn(),
    loadMore: vi.fn(),
    addReply: vi.fn().mockResolvedValue()
  };

  const comment = { _id: "c1" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -----------------------------
  // 1. Basic rendering
  // -----------------------------
  it("renders reply button", () => {
    mockHook.mockReturnValue(baseHookData);

    render(<ReplyList comment={comment} currentUser="john" />);

    expect(screen.getByText("Reply")).toBeInTheDocument();
  });

  it("shows reply count when > 0", () => {
    mockHook.mockReturnValue({
      ...baseHookData,
      replyCount: 2
    });

    render(<ReplyList comment={comment} currentUser="john" />);

    expect(screen.getByText("2 replies")).toBeInTheDocument();
  });

  // -----------------------------
  // 2. Expand behavior
  // -----------------------------
  it("shows view replies button when not expanded", () => {
    mockHook.mockReturnValue({
      ...baseHookData,
      replyCount: 2,
      expanded: false
    });

    render(<ReplyList comment={comment} currentUser="john" />);

    expect(screen.getByText("View 2 replies")).toBeInTheDocument();
  });

  it("calls expand when clicking view replies", () => {
    const expand = vi.fn();

    mockHook.mockReturnValue({
      ...baseHookData,
      replyCount: 2,
      expand
    });

    render(<ReplyList comment={comment} currentUser="john" />);

    fireEvent.click(screen.getByText("View 2 replies"));

    expect(expand).toHaveBeenCalled();
  });

  // -----------------------------
  // 3. Expanded state rendering
  // -----------------------------
  it("renders replies when expanded", () => {
    mockHook.mockReturnValue({
      ...baseHookData,
      expanded: true,
      replies: [{ _id: "r1" }, { _id: "r2" }]
    });

    render(<ReplyList comment={comment} currentUser="john" />);

    expect(screen.getAllByTestId("reply-item")).toHaveLength(2);
  });

  it("shows hide replies button when expanded", () => {
    const collapse = vi.fn();

    mockHook.mockReturnValue({
      ...baseHookData,
      expanded: true,
      collapse
    });

    render(<ReplyList comment={comment} currentUser="john" />);

    fireEvent.click(screen.getByText("Hide replies"));
    expect(collapse).toHaveBeenCalled();
  });

  // -----------------------------
  // 4. Load more
  // -----------------------------
  it("shows load more button when hasMore", () => {
    mockHook.mockReturnValue({
      ...baseHookData,
      expanded: true,
      hasMore: true
    });

    render(<ReplyList comment={comment} currentUser="john" />);

    expect(screen.getByText("Load more replies")).toBeInTheDocument();
  });

  it("calls loadMore on click", () => {
    const loadMore = vi.fn();

    mockHook.mockReturnValue({
      ...baseHookData,
      expanded: true,
      hasMore: true,
      loadMore
    });

    render(<ReplyList comment={comment} currentUser="john" />);

    fireEvent.click(screen.getByText("Load more replies"));

    expect(loadMore).toHaveBeenCalled();
  });

  // -----------------------------
  // 5. Reply input flow
  // -----------------------------
  it("shows input when clicking reply button", () => {
    mockHook.mockReturnValue(baseHookData);

    render(<ReplyList comment={comment} currentUser="john" />);

    fireEvent.click(screen.getByText("Reply"));

    expect(screen.getByTestId("comment-input")).toBeInTheDocument();
  });

  it("calls addReply on submit", async () => {
    const addReply = vi.fn().mockResolvedValue();

    mockHook.mockReturnValue({
      ...baseHookData,
      addReply
    });

    render(<ReplyList comment={comment} currentUser="john" />);

    fireEvent.click(screen.getByText("Reply"));
    fireEvent.click(screen.getByTestId("comment-input"));

    expect(addReply).toHaveBeenCalledWith({
      userName: "john",
      content: "test reply",
      replyTo: undefined,
      replyToUserName: undefined
    });
  });

  // -----------------------------
  // 6. Auto-expand when replying
  // -----------------------------
  it("calls expand when replying if not expanded", () => {
    const expand = vi.fn();

    mockHook.mockReturnValue({
      ...baseHookData,
      expanded: false,
      expand
    });

    render(<ReplyList comment={comment} currentUser="john" />);

    fireEvent.click(screen.getByText("Reply"));

    expect(expand).toHaveBeenCalled();
  });
});