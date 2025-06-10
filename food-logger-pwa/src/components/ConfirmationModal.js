// src/components/ConfirmationModal.js
import React from 'react';
import { Modal, Box, Typography, Button, Stack, List, ListItem, ListItemText, Divider } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const ConfirmationModal = ({ open, items, onConfirm, onCancel }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Modal open={open} onClose={onCancel}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Add these items to your log?
        </Typography>
        <List sx={{ mb: 3 }}>
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem disableGutters>
                <ListItemText
                  primary={item.name}
                  secondary={`${Math.round(item.calories)} kcal · P: ${item.protein.toFixed(1)}g C: ${item.carbs.toFixed(1)}g F: ${item.fat.toFixed(1)}g`}
                />
              </ListItem>
              {index < items.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="primary" onClick={onCancel} fullWidth>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={onConfirm} fullWidth>
            Confirm & Add
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;