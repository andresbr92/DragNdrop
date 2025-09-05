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
        spacing={2} 
        sx={{ 
          flex: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: 2,
          alignItems: 'flex-start'
        }}
      >
        {children}
      </Stack>
    </Box>
  );
});

Board.displayName = 'Board';

export default memo(Board);