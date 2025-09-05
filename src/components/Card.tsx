import React, { useRef, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

interface CardProps {
  title: string;
  cardId: string;
  columnId: string;
  cardIndex: number;
}

const Card: React.FC<CardProps> = ({ title, cardId, columnId, cardIndex }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    return draggable({
      element,
      getInitialData: () => ({
        type: 'card',
        cardId,
        columnId,
        cardIndex
      })
    });
  }, [cardId, columnId, cardIndex]);

  return (
    <Paper
      ref={cardRef}
      elevation={1}
      sx={{
        padding: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        cursor: 'grab',
        border: 1,
        borderColor: 'grey.200',
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
        '&:hover': {
          backgroundColor: 'grey.50',
          borderColor: 'grey.300',
          elevation: 2,
          transform: 'translateY(-1px)',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)'
        },
        '&:active': {
          cursor: 'grabbing',
          transform: 'translateY(0px)',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)'
        }
      }}
    >
      {/* Indicador visual de drag */}
      <DragIndicator
        sx={{
          position: 'absolute',
          top: 6,
          right: 6,
          color: 'grey.400',
          fontSize: '16px',
          opacity: 0.0,
          transition: 'opacity 0.2s ease',
          '.MuiPaper-root:hover &': {
            opacity: 0.6
          }
        }}
      />

      <Typography 
        variant="body2" 
        sx={{ 
          color: 'text.primary',
          fontSize: '14px',
          lineHeight: 1.4,
          fontWeight: 400,
          paddingRight: 2 // Espacio para el indicador
        }}
      >
        {title}
      </Typography>

      {/* Footer con metadata opcional */}
      <Box sx={{ 
        marginTop: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '11px',
            opacity: 0.7
          }}
        >
          #{cardId.split('-').pop()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Card;