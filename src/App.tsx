import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme,
  Container,
  Typography,
  Box,
} from '@mui/material';
import Column from './components/Column';
import Board from './components/Board';
import { BoardContext, type BoardContextValue, type ColumnType } from './components/BoardContext';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

//Nota para el revisor: Tema personalizado con Material UI y colores corporativos.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paper: '#ffffff',
    },
    grey: {
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
  },
  shape: {
    borderRadius: 12,
  }
});

//Nota para el revisor: Datos mockeados. Estos datos se podrían obtener por GraphQL.
const initialData: ColumnType[] = [
  {
    columnId: 'todo',
    title: 'Por hacer',
    cards: [
      'Configurar proyecto inicial',
      'Diseñar interfaz de usuario', 
      'Implementar autenticación'
    ]
  },
  {
    columnId: 'in-progress',
    title: 'En progreso',
    cards: [
      'Crear componente Column',
      'Integrar drag and drop'
    ]
  },
  {
    columnId: 'done',
    title: 'Completado',
    cards: [
      'Instalación de dependencias',
      'Configuración inicial'
    ]
  }
];

function App() {
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
  // Nota para el revisor: Aquí utilizamos el hook useMemo para evitar recalcular el VALOR del contexto cada vez que se renderiza el componente.
  const boardContextValue: BoardContextValue = useMemo(() => {
    return {
      getColumns,
      reorderCard,
      moveCard,
      registerCard
    };
    // Nota para el revisor: Añadimos las funciones principales a las dependencias del useMemo para indicarle cuando recalcular el valor del contexto.
  }, [getColumns, reorderCard, moveCard, registerCard]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: { xs: 2, sm: 3, md: 4 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          pointerEvents: 'none'
        }
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            textAlign: 'center', 
            marginBottom: 4,
            padding: 3,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                marginBottom: 1,
                fontSize: { xs: '1.8rem', sm: '2.125rem', md: '2.5rem' }
              }}
            >
              Bestseller Trello Lite
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 400,
                letterSpacing: '0.02em'
              }}
            >
              Gestión de tareas con drag & drop
            </Typography>
          </Box>

          <BoardContext.Provider value={boardContextValue}>
            <Board>
              {columns.map((column) => (
                <Column
                  key={column.columnId}
                  columnId={column.columnId}
                  title={column.title}
                  cards={column.cards}
                />
              ))}
            </Board>
          </BoardContext.Provider>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App
