"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import type { Card, Column as ColumnType } from "@/lib/board";
import { SortableCard } from "./Card";

type ColumnProps = {
  column: ColumnType;
  cards: Card[];
  onRename: (title: string) => void;
  onAddCard: (title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
};

const fieldClass =
  "w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-navy outline-none placeholder:text-slate-400 focus:border-action";

export function Column({ column, cards, onRename, onAddCard, onDeleteCard }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);

  function submitCard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title")).trim();
    if (!title) return;
    onAddCard(title, String(data.get("details")).trim());
    setAdding(false);
  }

  return (
    <section
      data-testid="column"
      aria-label={column.title}
      className="flex min-h-0 min-w-72 flex-1 flex-col overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/10 backdrop-blur-sm"
    >
      <div className="h-1" style={{ backgroundColor: column.color }} />
      <header className="flex items-center justify-between gap-2 px-4 pb-3 pt-3.5">
        {editing ? (
          <input
            autoFocus
            aria-label="Column name"
            defaultValue={column.title}
            onBlur={(e) => {
              onRename(e.currentTarget.value);
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-full rounded-md bg-white/10 px-2 py-1 text-sm font-semibold text-white outline-none ring-1 ring-white/30 focus:ring-white/60"
          />
        ) : (
          <button
            type="button"
            title="Rename column"
            onClick={() => setEditing(true)}
            className="-mx-2 truncate rounded-md px-2 py-1 text-left text-sm font-semibold tracking-wide text-white transition hover:bg-white/10"
          >
            {column.title}
          </button>
        )}
        <span
          data-testid="column-count"
          className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-xs text-white/70"
        >
          {cards.length}
        </span>
      </header>

      <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`mx-2 flex min-h-24 flex-1 flex-col gap-3 overflow-y-auto rounded-xl px-1 pb-3 pt-1 transition-colors ${isOver ? "bg-white/[0.04]" : ""}`}
        >
          {cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              color={column.color}
              label={column.title}
              onDelete={() => onDeleteCard(card.id)}
            />
          ))}
        </div>
      </SortableContext>

      <div className="px-3 pb-3">
        {adding ? (
          <form onSubmit={submitCard} className="space-y-2 rounded-xl bg-white p-3 shadow-lg">
            <input autoFocus name="title" required placeholder="Card title" aria-label="Card title" className={fieldClass} />
            <textarea name="details" rows={3} placeholder="Details" aria-label="Card details" className={`${fieldClass} resize-none`} />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded-md bg-action px-3 py-1.5 text-sm font-medium text-white transition hover:brightness-110"
              >
                Add card
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="rounded-md px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <Plus size={16} />
            Add a card
          </button>
        )}
      </div>
    </section>
  );
}
