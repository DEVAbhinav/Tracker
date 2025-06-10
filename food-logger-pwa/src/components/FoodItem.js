// src/components/FoodItem.js
import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const FoodItem = ({ item }) => {
  return (
    <Box sx={{ py: 1.5, borderBottom: '1px solid #EEE' }}>
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={6}>
          <Typography variant="body1" color="text.primary" fontWeight="500">
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.quantity}
          </Typography>
        </Grid>
        <Grid item xs={2} textAlign="center">
          <Typography variant="body2" color="text.primary">{Math.round(item.calories)}</Typography>
          <Typography variant="caption" color="text.secondary">kcal</Typography>
        </Grid>
        <Grid item xs={4} textAlign="center">
           <Typography variant="body2" color="text.primary" sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <span>{item.protein.toFixed(1)}g</span>
                <span>{item.carbs.toFixed(1)}g</span>
                <span>{item.fat.toFixed(1)}g</span>
           </Typography>
           <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-around', pl: 0.5 }}>
                <span>P</span>
                <span>C</span>
                <span>F</span>
           </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FoodItem;