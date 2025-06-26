import React from 'react';
import { Paper, Box, Typography, Grid } from '@mui/material';

function TotalsInsightBase({ totals, ...paperProps }) {
  return (
    <Paper elevation={0} {...paperProps}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Daily Totals
      </Typography>
      <Grid container spacing={2} textAlign="center">
        {[
          { label: 'Calories', value: Math.round(totals.calories), unit: 'kcal' },
          { label: 'Protein',  value: totals.protein.toFixed(1),  unit: 'g' },
          { label: 'Carbs',    value: totals.carbs.toFixed(1),    unit: 'g' },
          { label: 'Fat',      value: totals.fat.toFixed(1),      unit: 'g' },
        ].map(({ label, value, unit }) => (
          <Grid item xs={3} key={label}>
            <Box>
              <Typography variant="body2" color="text.secondary">{label}</Typography>
              <Typography variant="h6">{value}</Typography>
              <Typography variant="caption" color="text.secondary">{unit}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default React.memo(TotalsInsightBase);
