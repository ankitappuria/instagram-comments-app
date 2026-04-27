import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import CommentInput from "../src/components/CommentInput";

describe("CommentInput", () => {
  // -----------------------------
  // 1. Basic rendering behavior
  // -----------------------------
  it("renders with default placeholder", () => {
    render(<CommentInput onSubmit={() => {}} />);
    expect(screen.getByPlaceholderText("Add a comment...")).toBeInTheDocument();
  });

  it("pre-fills text when replying", () => {
    render(<CommentInput onSubmit={() => {}} replyToUserName="john" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea.value).toContain("@john");
  });

  // -----------------------------
  // 2. Input behavior
  // -----------------------------
  it("updates value on typing", async () => {
    const user = userEvent.setup();

    render(<CommentInput onSubmit={() => {}} />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, "Hello");
    expect(textarea).toHaveValue("Hello");
  });

  it("disables button when input is empty", () => {
    render(<CommentInput onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: "Post" })).toBeDisabled();
  });

  it("enables button when input has text", async () => {
    const user = userEvent.setup();

    render(<CommentInput onSubmit={() => {}} />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, "Hello");

    expect(screen.getByRole("button", { name: "Post" })).not.toBeDisabled();
  });

  // -----------------------------
  // 3. Submit behavior (no loading complexity)
  // -----------------------------
  it("calls onSubmit and clears input", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn().mockResolvedValue();

    render(<CommentInput onSubmit={mockSubmit} />);

    const textarea = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: "Post" });

    await user.type(textarea, "Hello");
    await user.click(button);

    expect(mockSubmit).toHaveBeenCalledWith("Hello");

    // wait for async clear
    expect(await screen.findByRole("textbox")).toHaveValue("");
  });

  // -----------------------------
  // 4. Loading state (isolated)
  // -----------------------------
  it("disables button while submitting", async () => {
    const user = userEvent.setup();

    let resolvePromise;
    const mockSubmit = vi.fn(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    render(<CommentInput onSubmit={mockSubmit} />);

    const textarea = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: "Post" });

    await user.type(textarea, "Hello");
    await user.click(button);

    // loading state
    expect(screen.getByRole("button", { name: "Post" })).toBeDisabled();

    // resolve async
    resolvePromise();

    // input cleared → still disabled (important logic)
    expect(await screen.findByRole("textbox")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Post" })).toBeDisabled();
  });

  // -----------------------------
  // 5. Keyboard interactions
  // -----------------------------
  it("submits on Enter", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn().mockResolvedValue();

    render(<CommentInput onSubmit={mockSubmit} />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, "Hello{Enter}");

    expect(mockSubmit).toHaveBeenCalledWith("Hello");
  });

  it("does not submit on Shift+Enter", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    render(<CommentInput onSubmit={mockSubmit} />);
    const textarea = screen.getByRole("textbox");

    await user.type(textarea, "Hello");
    await user.keyboard("{Shift>}{Enter}{/Shift}");

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("calls onCancel on Escape", async () => {
    const user = userEvent.setup();
    const mockCancel = vi.fn();

    render(<CommentInput onSubmit={() => {}} onCancel={mockCancel} />);
    const textarea = screen.getByRole("textbox");

    await user.keyboard("{Escape}");

    expect(mockCancel).toHaveBeenCalled();
  });
});