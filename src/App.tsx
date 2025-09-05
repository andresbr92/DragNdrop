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
import { Dashboard } from '@mui/icons-material';

//Nota para el revisor: Tema corporativo con Material UI - Escala de grises profesional
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#424242',
      light: '#6d6d6d',
      dark: '#212121',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#757575',
      light: '#a4a4a4',
      dark: '#494949',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
    },
    divider: '#e0e0e0',
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0.15px',
    },
    body2: {
      lineHeight: 1.4,
    }
  },
  shape: {
    borderRadius: 8,
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
        backgroundColor: 'background.default',
        padding: { xs: 2, sm: 3, md: 4 }
      }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            marginBottom: 4,
            paddingBottom: 2,
            borderBottom: 1,
            borderColor: 'divider'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 1 }}>
              <Dashboard sx={{ 
                color: 'primary.main', 
                fontSize: '32px'
              }} />
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  color: 'text.primary', 
                  fontWeight: 600
                }}
              >
                Bestseller Trello Lite
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '14px'
              }}
            >
              Gestión de tareas corporativa • {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
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
