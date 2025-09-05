// Nota para el revisor: Aquí definimos el contexto (estado global simplificado) y las funciones principales.
import { createContext, useContext } from 'react';
export type ColumnType = {
	title: string;
	columnId: string;
	cards: string[];
};

export type BoardContextValue = {
  getColumns: () => ColumnType[];
  reorderCard: (args: { columnId: string; startIndex: number; finishIndex: number }) => void;
  moveCard: (args: {
		startColumnId: string;
		finishColumnId: string;
		itemIndexInStartColumn: number;
		itemIndexInFinishColumn?: number;
  }) => void;
  registerCard: () => () => void;
};

export const BoardContext = createContext<BoardContextValue | undefined>(undefined);

export function useBoardContext(): BoardContextValue {
	const value = useContext(BoardContext);
	if (!value) {
		throw new Error('useBoardContext must be used within a BoardContextProvider');
	}
	return value;
}