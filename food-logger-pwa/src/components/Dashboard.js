// src/components/Dashboard.js
import React, { useState } from 'react';
import { Container, Box, TextField, Button, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import axios from 'axios';

import MealLog from './MealLog';
import ConfirmationModal from './ConfirmationModal';
import { triggerHapticFeedback } from '../utils/hapticFeedback';

const Dashboard = () => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [meal, setMeal] = useState('Breakfast');
  
  // State for logs
  const [logs, setLogs] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });

  // State for confirmation
  const [pendingItems, setPendingItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleMealChange = (event, newValue) => {
    setMeal(newValue);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    setError('');

    try {
     // Azure serves the API at the /api route relative to the app's URL.
    const response = await axios.post('/api/process-food', {
        text: userInput,
        meal: meal,
      });

      setPendingItems(response.data);
      setIsModalOpen(true);

    } catch (err) {
      setError('Could not process your request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setLogs(prevLogs => ({
        ...prevLogs,
        [meal]: [...prevLogs[meal], ...pendingItems]
    }));
    triggerHapticFeedback();
    setUserInput('');
    setPendingItems([]);
    setIsModalOpen(false);
  }

  const handleCancel = () => {
    setPendingItems([]);
    setIsModalOpen(false);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          label={`What did you have for ${meal}?`}
          value={userInput}
          onChange={handleInputChange}
          placeholder="e.g., 2 aloo paratha with 2 tablespoon green chutney"
        />
        <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 2 }}>
            <Tabs value={meal} onChange={handleMealChange} aria-label="meal selection" centered>
                <Tab label="Breakfast" value="Breakfast" />
                <Tab label="Lunch" value="Lunch" />
                <Tab label="Dinner" value="Dinner" />
                <Tab label="Snacks" value="Snacks" />
            </Tabs>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={handleSubmit}
          disabled={loading || !userInput.trim()}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MicIcon />}
        >
          {loading ? 'Processing...' : 'Log Food'}
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>

      <ConfirmationModal 
        open={isModalOpen}
        items={pendingItems}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <Box>
        <MealLog title="Breakfast" items={logs.Breakfast} />
        <MealLog title="Lunch" items={logs.Lunch} />
        <MealLog title="Dinner" dismal items={logs.Dinner} />
        <MealLog title="Snacks" items={logs.Snacks} />
      </Box>

    </Container>
  );
};

export default Dashboard;