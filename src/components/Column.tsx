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
      elevation={isCardOver ? 8 : 3}
      sx={{
        width: { xs: 280, sm: 300, md: 320 },
        backgroundColor: isCardOver ? 'rgba(25, 118, 210, 0.08)' : 'rgba(255, 255, 255, 0.95)',
        borderRadius: 3,
        padding: 2,
        minHeight: 200,
        maxHeight: '70vh',
        overflowY: 'auto',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        border: isCardOver 
          ? '2px solid rgba(25, 118, 210, 0.3)' 
          : '1px solid rgba(255, 255, 255, 0.2)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        },
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '3px',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.3)',
          },
        },
      }}
    >
      {/* Header mejorado */}
      <Box sx={{
        padding: '8px 12px',
        paddingBottom: 3,
        borderBottom: '2px solid rgba(0,0,0,0.06)',
        marginBottom: 2,
        background: 'linear-gradient(90deg, rgba(25,118,210,0.05) 0%, rgba(156,39,176,0.05) 100%)',
        borderRadius: '8px',
        margin: '-8px -8px 16px -8px',
      }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            color: '#1a237e',
            fontSize: { xs: '0.95rem', sm: '1rem' },
            textAlign: 'center',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            opacity: 0.9,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(26, 35, 126, 0.6)',
            fontSize: '0.75rem',
            textAlign: 'center',
            display: 'block',
            marginTop: 0.5,
          }}
        >
          {cards.length} {cards.length === 1 ? 'tarea' : 'tareas'}
        </Typography>
      </Box>

      <Stack 
        spacing={2} 
        sx={{ 
          minHeight: 100,
          padding: '4px',
        }}
      >
        {cards.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              padding: 4,
              color: 'rgba(0,0,0,0.4)',
              fontStyle: 'italic',
            }}
          >
            <Typography variant="body2">
              Arrastra tarjetas aquí
            </Typography>
          </Box>
        ) : (
          cards.map((card: string, index: number) => (
            <Card 
              title={card} 
              cardId={`${columnId}-card-${index}`}
              columnId={columnId}
              cardIndex={index}
              key={index} 
            />
          ))
        )}
      </Stack>
    </Paper>
  );
};

export default Column;
