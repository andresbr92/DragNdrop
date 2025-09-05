import React, { useRef, useEffect, useState } from 'react';
import Card from './Card';
import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
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
      elevation={isCardOver ? 3 : 1}
      sx={{
        width: { xs: 260, sm: 280, md: 300 },
        backgroundColor: isCardOver ? 'grey.100' : 'grey.50',
        borderRadius: 2,
        padding: 2,
        minHeight: 120,
        border: 1,
        borderColor: isCardOver ? 'primary.light' : 'grey.200',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          elevation: 2,
          borderColor: 'grey.300'
        }
      }}
    >
      <Box sx={{
        paddingBottom: 2,
        borderBottom: 1,
        borderColor: 'divider',
        marginBottom: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assignment sx={{ color: 'text.secondary', fontSize: '18px' }} />
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '15px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {title}
          </Typography>
        </Box>

        <Chip
          label={cards.length}
          size="small"
          sx={{
            backgroundColor: 'grey.200',
            color: 'text.secondary',
            fontSize: '11px',
            height: 20,
            minWidth: 24
          }}
        />
      </Box>

      <Stack spacing={1.5} sx={{ minHeight: 50 }}>
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

      {isCardOver && (
        <Box sx={{
          marginTop: 2,
          padding: 1,
          backgroundColor: 'primary.light',
          borderRadius: 1,
          textAlign: 'center'
        }}>
          <Typography
            variant="caption"
            sx={{
              color: 'primary.contrastText',
              fontSize: '11px',
              fontWeight: 500
            }}
          >
            Soltar aquí
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Column;
