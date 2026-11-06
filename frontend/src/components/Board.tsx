"use client";

import { useId, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  addCard,
  deleteCard,
  findColumn,
  moveCard,
  renameColumn,
  type Board as BoardType,
} from "@/lib/board";
import { initialBoard } from "@/lib/initialData";
import { Column } from "./Column";
import { CardView } from "./Card";

function targetIndex(board: BoardType, columnId: string, overId: string) {
  const column = board.columns.find((c) => c.id === columnId)!;
  return overId === columnId ? column.cardIds.length : column.cardIds.indexOf(overId);
}

export function Board() {
  const [board, setBoard] = useState<BoardType>(initialBoard);
  const [snapshot, setSnapshot] = useState<BoardType | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id));
    setSnapshot(board);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const from = findColumn(board, String(active.id));
    const to = findColumn(board, String(over.id));
    if (!from || !to || from.id === to.id) return;
    setBoard(moveCard(board, String(active.id), to.id, targetIndex(board, to.id, String(over.id))));
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    setSnapshot(null);
    if (!over) return;
    const to = findColumn(board, String(over.id));
    if (!to) return;
    setBoard(moveCard(board, String(active.id), to.id, targetIndex(board, to.id, String(over.id))));
  }

  function handleDragCancel() {
    if (snapshot) setBoard(snapshot);
    setActiveId(null);
    setSnapshot(null);
  }

  const activeCard = activeId ? board.cards[activeId] : null;
  const activeColumn = activeId ? findColumn(board, activeId) : undefined;

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-end justify-between gap-6 px-4 pb-6 pt-8 sm:px-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">Project board</p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-white">Product Launch</h1>
          <p className="mt-1 text-sm text-white/60">Drag cards between columns to track progress.</p>
        </div>
        <p className="whitespace-nowrap rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-white/70 ring-1 ring-white/10">
          {Object.keys(board.cards).length} cards
        </p>
      </header>

      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <main className="flex min-h-0 flex-1 gap-4 overflow-x-auto px-4 pb-8 sm:px-8">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={column.cardIds.map((id) => board.cards[id])}
              onRename={(title) => setBoard((b) => renameColumn(b, column.id, title))}
              onAddCard={(title, details) =>
                setBoard((b) => addCard(b, column.id, { id: crypto.randomUUID(), title, details }))
              }
              onDeleteCard={(id) => setBoard((b) => deleteCard(b, id))}
            />
          ))}
        </main>
        <DragOverlay>
          {activeCard && activeColumn && (
            <CardView
              card={activeCard}
              color={activeColumn.color}
              label={activeColumn.title}
              className="rotate-2 scale-105 cursor-grabbing shadow-[0_18px_40px_rgba(9,30,66,0.5)]"
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
