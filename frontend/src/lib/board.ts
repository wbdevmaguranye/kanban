export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  title: string;
  color: string;
  cardIds: string[];
};

export type Board = {
  columns: Column[];
  cards: Record<string, Card>;
};

export function findColumn(board: Board, id: string) {
  return board.columns.find((c) => c.id === id || c.cardIds.includes(id));
}

export function addCard(board: Board, columnId: string, card: Card): Board {
  return {
    cards: { ...board.cards, [card.id]: card },
    columns: board.columns.map((c) =>
      c.id === columnId ? { ...c, cardIds: [...c.cardIds, card.id] } : c,
    ),
  };
}

export function deleteCard(board: Board, cardId: string): Board {
  const cards = { ...board.cards };
  delete cards[cardId];
  return {
    cards,
    columns: board.columns.map((c) => ({
      ...c,
      cardIds: c.cardIds.filter((id) => id !== cardId),
    })),
  };
}

export function renameColumn(board: Board, columnId: string, title: string): Board {
  const trimmed = title.trim();
  if (!trimmed) return board;
  return {
    ...board,
    columns: board.columns.map((c) => (c.id === columnId ? { ...c, title: trimmed } : c)),
  };
}

export function moveCard(board: Board, cardId: string, toColumnId: string, toIndex: number): Board {
  const columns = board.columns.map((c) => ({
    ...c,
    cardIds: c.cardIds.filter((id) => id !== cardId),
  }));
  const target = columns.find((c) => c.id === toColumnId)!;
  target.cardIds.splice(toIndex, 0, cardId);
  return { ...board, columns };
}
