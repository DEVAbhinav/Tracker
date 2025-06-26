import React from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'; // ⬅ specific import
import ToggleButton from '@mui/material/ToggleButton'; // ⬅ specific import

const CapsuleTabs = ({ value, onChange, options }) => (
  <ToggleButtonGroup
    value={value}
    exclusive
    onChange={onChange}
    sx={{ my: 2, borderRadius: '22px', bgcolor: 'background.paper' }}
    fullWidth
  >
    {options.map(opt => (
      <ToggleButton key={opt} value={opt} sx={{ borderRadius: '22px', textTransform: 'none' }}>
        {opt}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);

export default CapsuleTabs;
