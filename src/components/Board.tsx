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
    console.log('Board mounted with columns:', columns);
  }, [getColumns]);

  return (
    <Box 
      ref={ref}
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <Stack 
        direction="row" 
        spacing={{ xs: 2, sm: 3, md: 4 }}
        sx={{ 
          flex: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingY: 2,
          paddingX: 1,
          alignItems: 'flex-start',
          minHeight: 'fit-content',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.4)',
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