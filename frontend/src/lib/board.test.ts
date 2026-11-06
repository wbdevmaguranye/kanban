import { describe, expect, it } from "vitest";
import { addCard, deleteCard, findColumn, moveCard, renameColumn } from "./board";
import { initialBoard } from "./initialData";

const ids = (columnId: string, board = initialBoard) =>
  board.columns.find((c) => c.id === columnId)!.cardIds;

describe("initialBoard", () => {
  it("has exactly 5 columns, each card referenced once", () => {
    expect(initialBoard.columns).toHaveLength(5);
    const all = initialBoard.columns.flatMap((c) => c.cardIds);
    expect(new Set(all).size).toBe(all.length);
    expect(all.sort()).toEqual(Object.keys(initialBoard.cards).sort());
  });
});

describe("findColumn", () => {
  it("finds by column id or card id", () => {
    expect(findColumn(initialBoard, "todo")?.id).toBe("todo");
    expect(findColumn(initialBoard, "c6")?.id).toBe("progress");
    expect(findColumn(initialBoard, "nope")).toBeUndefined();
  });
});

describe("addCard", () => {
  it("appends the card to the column without mutating input", () => {
    const card = { id: "new", title: "New", details: "Info" };
    const next = addCard(initialBoard, "review", card);
    expect(ids("review", next)).toEqual(["c8", "new"]);
    expect(next.cards.new).toEqual(card);
    expect(ids("review")).toEqual(["c8"]);
    expect(initialBoard.cards.new).toBeUndefined();
  });
});

describe("deleteCard", () => {
  it("removes the card from its column and the card map", () => {
    const next = deleteCard(initialBoard, "c2");
    expect(ids("backlog", next)).toEqual(["c1", "c3"]);
    expect(next.cards.c2).toBeUndefined();
    expect(initialBoard.cards.c2).toBeDefined();
  });
});

describe("renameColumn", () => {
  it("renames with trimmed title", () => {
    const next = renameColumn(initialBoard, "todo", "  Next Up  ");
    expect(next.columns[1].title).toBe("Next Up");
    expect(initialBoard.columns[1].title).toBe("To Do");
  });

  it("ignores empty titles", () => {
    expect(renameColumn(initialBoard, "todo", "   ")).toBe(initialBoard);
  });
});

describe("moveCard", () => {
  it("reorders within a column", () => {
    expect(ids("backlog", moveCard(initialBoard, "c1", "backlog", 2))).toEqual(["c2", "c3", "c1"]);
    expect(ids("backlog", moveCard(initialBoard, "c3", "backlog", 0))).toEqual(["c3", "c1", "c2"]);
  });

  it("moves across columns at an index", () => {
    const next = moveCard(initialBoard, "c1", "todo", 1);
    expect(ids("backlog", next)).toEqual(["c2", "c3"]);
    expect(ids("todo", next)).toEqual(["c4", "c1", "c5"]);
    expect(ids("backlog")).toEqual(["c1", "c2", "c3"]);
  });

  it("moves to the end of a column", () => {
    expect(ids("done", moveCard(initialBoard, "c8", "done", 2))).toEqual(["c9", "c10", "c8"]);
  });

  it("moves into an empty column", () => {
    const next = moveCard(initialBoard, "c8", "done", 0);
    const again = moveCard(next, "c9", "review", 0);
    expect(ids("review", next)).toEqual([]);
    expect(ids("review", again)).toEqual(["c9"]);
  });
});
