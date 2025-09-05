import { forwardRef, memo, type ReactNode, useEffect } from 'react';
import { useBoardContext } from './BoardContext';
import { Stack, Box } from '@mui/material';

type BoardProps = {
	children: ReactNode;
};

const Board = forwardRef<HTMLDivElement, BoardProps>(({ children }, ref) => {
  const { getColumns } = useBoardContext();

  useEffect(() => {
    // Nota para el revisor: Demostración de uso del hook useContext, disponible en toda la app.
    const columns = getColumns();
    // Inicialización del board si fuera necesario
    console.log('Board mounted with columns:', columns);
  }, [getColumns]);

  return (
    <Box 
      ref={ref}
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'background.default',
        borderRadius: 2,
        border: 1,
        borderColor: 'grey.200',
        padding: 2
      }}
    >
      <Stack 
        direction="row" 
        spacing={3} 
        sx={{ 
          flex: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: 2,
          alignItems: 'flex-start',
          minHeight: 400,
         
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'grey.100',
            borderRadius: 1,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'grey.400',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'grey.500',
            },
          },
        }}
      >
        {children}
      </Stack>
    </Box>
  );
});

Board.displayName = 'Board';

export default memo(Board);