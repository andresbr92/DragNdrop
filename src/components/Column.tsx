import React, { useRef, useEffect, useState } from 'react';
import Card from './Card';
import {
  Paper,
  Typography,
  Box,
  Stack
} from '@mui/material';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

interface ColumnProps {
  title: string;
  cards?: string[];
  columnId: string;
}

const Column: React.FC<ColumnProps> = ({ title, cards = [], columnId }) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const [isCardOver, setIsCardOver] = useState(false);

  useEffect(() => {
    const element = columnRef.current;
    if (!element) return;

    return dropTargetForElements({
      element,
      getData: () => ({ columnId }),
      canDrop: ({ source }) => {
        return source.data.type === 'card';
      },
      onDragEnter: () => setIsCardOver(true),
      onDragLeave: () => setIsCardOver(false),
      onDrop: () => setIsCardOver(false),
    });
  }, [columnId]);

  return (
    <Paper
      ref={columnRef}
      elevation={2}
      sx={{
        width: 280,
        backgroundColor: isCardOver ? '#e4f2ff' : '#f1f2f4',
        borderRadius: 2,
        padding: 1,
        minHeight: 120,
        transition: 'background-color 0.2s ease'
      }}
    >
      <Box sx={{
        padding: 1,
        paddingBottom: 2
      }}>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 600,
            color: '#172b4d',
            fontSize: '14px'
          }}
        >
          {title}
        </Typography>
      </Box>

      <Stack spacing={1} sx={{ minHeight: 50 }}>
        {cards.map((card: string, index: number) => (
          <Card 
            title={card} 
            cardId={`${columnId}-card-${index}`}
            columnId={columnId}
            cardIndex={index}
            key={index} 
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default Column;
