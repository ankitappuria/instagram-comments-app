import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import UserNameModal from "../src/components/UserModal";

describe("UserNameModal", () => {
  const setup = (props = {}) => {
    const onSave = vi.fn();
    const onClose = vi.fn();

    render(
      <UserNameModal
        currentUser="john"
        onSave={onSave}
        onClose={onClose}
        {...props}
      />
    );

    return { onSave, onClose };
  };

  // -----------------------------
  // 1. Initial render
  // -----------------------------
  it("renders with initial username", () => {
    setup();

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("john");
  });

  it("renders title and subtitle", () => {
    setup();

    expect(screen.getByText("Set your username")).toBeInTheDocument();
    expect(
      screen.getByText("This will show on your comments")
    ).toBeInTheDocument();
  });

  // -----------------------------
  // 2. Input behavior
  // -----------------------------
  it("updates input on typing", async () => {
    const user = userEvent.setup();
    setup();

    const input = screen.getByRole("textbox");

    await user.clear(input);
    await user.type(input, "alice");

    expect(input).toHaveValue("alice");
  });

  // -----------------------------
  // 3. Save behavior
  // -----------------------------
  it("calls onSave and onClose when Save is clicked", async () => {
    const user = userEvent.setup();
    const { onSave, onClose } = setup();

    const input = screen.getByRole("textbox");

    await user.clear(input);
    await user.type(input, "alice");

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith("alice");
    expect(onClose).toHaveBeenCalled();
  });

  it("trims input before saving", async () => {
    const user = userEvent.setup();
    const { onSave } = setup();

    const input = screen.getByRole("textbox");

    await user.clear(input);
    await user.type(input, "  alice  ");

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith("alice");
  });

  it("does not save if input is empty", async () => {
    const user = userEvent.setup();
    const { onSave, onClose } = setup();

    const input = screen.getByRole("textbox");

    await user.clear(input);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  // -----------------------------
  // 4. Cancel behavior
  // -----------------------------
  it("calls onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const { onClose } = setup();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalled();
  });

  // -----------------------------
  // 5. Keyboard interactions
  // -----------------------------
  it("submits on Enter key", async () => {
    const user = userEvent.setup();
    const { onSave } = setup();

    const input = screen.getByRole("textbox");

    await user.clear(input);
    await user.type(input, "alice{Enter}");

    expect(onSave).toHaveBeenCalledWith("alice");
  });

  it("closes on Escape key", async () => {
    const user = userEvent.setup();
    const { onClose } = setup();

    const input = screen.getByRole("textbox");

    await user.click(input);
    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalled();
  });
});