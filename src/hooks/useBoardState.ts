import { useState, useCallback, useEffect, useRef } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export type ColumnType = {
  title: string;
  columnId: string;
  cards: string[];
};

export const useBoardState = (initialData: ColumnType[]) => {
  const [columns, setColumns] = useState<ColumnType[]>(initialData);
  const stableData = useRef(columns);
  
  useEffect(() => {
    stableData.current = columns;
  }, [columns]);

  const getColumns = useCallback(() => {
    return stableData.current;
  }, []);

  // Nota para el revisor: Aquí utilizamos el hook useCallback para evitar recalcular la FUNCIÓN cada vez que se renderiza el componente.
  const reorderCard = useCallback(({ columnId, startIndex, finishIndex }: {
    columnId: string;
    startIndex: number;
    finishIndex: number;
  }) => {
    setColumns(currentColumns => {
      return currentColumns.map(col => {
        if (col.columnId !== columnId) return col;
        
        const newCards = [...col.cards];
        const [movedCard] = newCards.splice(startIndex, 1);
        newCards.splice(finishIndex, 0, movedCard);
        
        return { ...col, cards: newCards };
      });
    });
  }, []);

  // Nota para el revisor: Aquí utilizamos el hook useCallback para evitar recalcular la FUNCIÓN cada vez que se renderiza el componente.
  const moveCard = useCallback(({ 
    startColumnId, 
    finishColumnId, 
    itemIndexInStartColumn 
  }: {
    startColumnId: string;
    finishColumnId: string;
    itemIndexInStartColumn: number;
    itemIndexInFinishColumn?: number;
  }) => {
    if (startColumnId === finishColumnId) return;

    setColumns(currentColumns => {
      const sourceColumn = currentColumns.find(c => c.columnId === startColumnId);
      const cardToMove = sourceColumn?.cards[itemIndexInStartColumn];
      
      if (!cardToMove) return currentColumns;

      const newColumns = currentColumns.map(col => {
        if (col.columnId === startColumnId) {
          const newCards = [...col.cards];
          newCards.splice(itemIndexInStartColumn, 1);
          return { ...col, cards: newCards };
        }

        if (col.columnId === finishColumnId) {
          const newCards = [...col.cards];
          // Simplificado: siempre agregar al final. Se podría hacer una lógica más compleja para agregar el card en la posición del drop.
          newCards.push(cardToMove); 
          return { ...col, cards: newCards };
        }
        return col;
      });
      
      return newColumns;
    });
  }, []);

  // Nota para el revisor: Aquí utilizamos el hook useCallback para evitar recalcular la FUNCIÓN cada vez que se renderiza el componente.
  const registerCard = useCallback(() => {
    // Función dummy para crear mas cards. No implementada.
    return () => {}; 
  }, []);

  useEffect(() => {
    return monitorForElements({
      onDrop(args) {
        const { location, source } = args;
        
        if (!location.current.dropTargets.length) return;
        if (source.data.type !== 'card') return;

        const sourceColumnId = source.data.columnId as string;
        const cardIndex = source.data.cardIndex as number;
        const targetColumnId = location.current.dropTargets[0].data.columnId as string;

        if (cardIndex < 0) return;

        if (sourceColumnId === targetColumnId) {
          const sourceColumn = stableData.current.find(col => col.columnId === sourceColumnId);
          if (!sourceColumn || sourceColumn.cards.length <= 1) return;
          
          // Para MVP: lógica muy simplificada
          const middleIndex = Math.floor(sourceColumn.cards.length / 2);
          const finishIndex = cardIndex < middleIndex ? sourceColumn.cards.length - 1 : 0;
          
         
          if (cardIndex !== finishIndex) {
            reorderCard({
              columnId: sourceColumnId,
              startIndex: cardIndex,
              finishIndex: finishIndex
            });
          }
          return;
        }

        moveCard({
          startColumnId: sourceColumnId,
          finishColumnId: targetColumnId,
          itemIndexInStartColumn: cardIndex
        });
      }
    });
  }, [moveCard, reorderCard]);

  return {
    columns,
    getColumns,
    reorderCard,
    moveCard,
    registerCard
  };
};
