import React, { useRef, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
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
        padding: 1.5,
        backgroundColor: 'white',
        borderRadius: 1.5,
        cursor: 'grab',
        '&:hover': {
          backgroundColor: '#f8f9fa'
        },
        '&:active': {
          cursor: 'grabbing'
        }
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#172b4d',
          fontSize: '14px',
          lineHeight: 1.3
        }}
      >
        {title}
      </Typography>
    </Paper>
  );
};

export default Card;