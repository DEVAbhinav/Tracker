// src/components/MealLog.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import FoodItem from './FoodItem';

const MealLog = ({ title, items }) => {
  if (items.length === 0) {
    return null; // Don't render the card if there are no items
  }

  const totals = items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" color="text.primary">{title}</Typography>
        <Typography variant="h6" color="primary.main">{Math.round(totals.calories)} kcal</Typography>
      </Box>
      <Box>
        {items.map((item) => (
          <FoodItem key={item.id} item={item} />
        ))}
      </Box>
    </Paper>
  );
};

export default MealLog;