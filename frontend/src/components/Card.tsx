"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import type { Card as CardType } from "@/lib/board";

type CardViewProps = {
  card: CardType;
  color: string;
  label: string;
  onDelete?: () => void;
  className?: string;
};

export function CardView({ card, color, label, onDelete, className = "" }: CardViewProps) {
  return (
    <article
      data-testid="card"
      className={`group relative overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(9,30,66,0.25)] ring-1 ring-black/5 ${className}`}
    >
      <div data-testid="card-band" className="h-12" style={{ backgroundColor: color }} />
      {onDelete && (
        <button
          type="button"
          aria-label={`Delete ${card.title}`}
          onClick={onDelete}
          onKeyDown={(e) => e.stopPropagation()}
          className="absolute right-2 top-2 rounded-md p-1.5 text-white/90 opacity-0 transition hover:bg-white/20 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-white group-hover:opacity-100"
        >
          <Trash2 size={16} strokeWidth={2} />
        </button>
      )}
      <div className="px-3.5 pb-3.5 pt-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold leading-snug text-navy">{card.title}</h3>
          <span className="shrink-0 pt-px text-xs text-slate-500">{label}</span>
        </div>
        {card.details && <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{card.details}</p>}
      </div>
    </article>
  );
}

export function SortableCard(props: Omit<CardViewProps, "className">) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.card.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`cursor-grab rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white active:cursor-grabbing ${isDragging ? "opacity-40" : ""}`}
      {...attributes}
      {...listeners}
    >
      <CardView
        {...props}
        className="transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(9,30,66,0.35)]"
      />
    </div>
  );
}
