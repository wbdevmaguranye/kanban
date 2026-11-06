import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Board } from "./Board";

const column = (name: string) => screen.getByRole("region", { name });

describe("Board", () => {
  it("renders 5 columns with the dummy cards", () => {
    render(<Board />);
    expect(screen.getAllByTestId("column")).toHaveLength(5);
    expect(screen.getAllByTestId("card")).toHaveLength(10);
    expect(within(column("Backlog")).getByText("Draft Q3 roadmap")).toBeInTheDocument();
  });

  it("colors each card band with its column color", () => {
    render(<Board />);
    const band = within(column("Done")).getAllByTestId("card-band")[0];
    expect(band).toHaveStyle({ backgroundColor: "#36B37E" });
  });

  it("renames a column", async () => {
    const user = userEvent.setup();
    render(<Board />);
    await user.click(screen.getByRole("button", { name: "To Do" }));
    const input = screen.getByRole("textbox", { name: "Column name" });
    await user.clear(input);
    await user.type(input, "Next Up{Enter}");
    expect(column("Next Up")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "To Do" })).not.toBeInTheDocument();
  });

  it("keeps the old name when renaming is cancelled or empty", async () => {
    const user = userEvent.setup();
    render(<Board />);
    await user.click(screen.getByRole("button", { name: "Review" }));
    await user.type(screen.getByRole("textbox", { name: "Column name" }), "zzz{Escape}");
    expect(column("Review")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Review" }));
    await user.clear(screen.getByRole("textbox", { name: "Column name" }));
    await user.keyboard("{Enter}");
    expect(column("Review")).toBeInTheDocument();
  });

  it("adds a card to a column", async () => {
    const user = userEvent.setup();
    render(<Board />);
    const review = column("Review");
    await user.click(within(review).getByRole("button", { name: "Add a card" }));
    await user.type(within(review).getByRole("textbox", { name: "Card title" }), "Ship it");
    await user.type(within(review).getByRole("textbox", { name: "Card details" }), "Final checks");
    await user.click(within(review).getByRole("button", { name: "Add card" }));
    expect(within(review).getByText("Ship it")).toBeInTheDocument();
    expect(within(review).getByText("Final checks")).toBeInTheDocument();
    expect(within(review).getAllByTestId("card")).toHaveLength(2);
  });

  it("does not add a card without a title", async () => {
    const user = userEvent.setup();
    render(<Board />);
    const review = column("Review");
    await user.click(within(review).getByRole("button", { name: "Add a card" }));
    await user.type(within(review).getByRole("textbox", { name: "Card title" }), "   ");
    await user.click(within(review).getByRole("button", { name: "Add card" }));
    expect(within(review).getAllByTestId("card")).toHaveLength(1);
  });

  it("cancels adding a card", async () => {
    const user = userEvent.setup();
    render(<Board />);
    const review = column("Review");
    await user.click(within(review).getByRole("button", { name: "Add a card" }));
    await user.click(within(review).getByRole("button", { name: "Cancel" }));
    expect(within(review).queryByRole("textbox", { name: "Card title" })).not.toBeInTheDocument();
  });

  it("deletes a card", async () => {
    const user = userEvent.setup();
    render(<Board />);
    await user.click(screen.getByRole("button", { name: "Delete Draft Q3 roadmap" }));
    expect(screen.queryByText("Draft Q3 roadmap")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("card")).toHaveLength(9);
  });
});
