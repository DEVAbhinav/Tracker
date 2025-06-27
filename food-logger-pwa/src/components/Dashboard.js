// src/components/Dashboard.js
import React, { useState, useMemo, useCallback } from 'react';

import Container         from '@mui/material/Container';
import Box               from '@mui/material/Box';
import CircularProgress  from '@mui/material/CircularProgress';
import Alert             from '@mui/material/Alert';
import axios             from 'axios';

import FoodInputBar          from './FoodInputBar';
import CapsuleTabs           from './CapsuleTabs';
import ConfirmationModal     from './ConfirmationModal';
import MealLog               from './MealLog';
import TotalsInsight         from './TotalsInsight';
import FloatingActionButton  from './FloatingActionButton';
import { triggerHapticFeedback } from '../utils/hapticFeedback';

/* ---------- helpers ---------- */
const scaleItem = (item) => {
  const qty = parseFloat(item.qty ?? item.quantity ?? 1) || 1;
  return {
    ...item,
    qty,
    caloriesTotal: item.calories * qty,
    proteinTotal : item.protein  * qty,
    carbsTotal   : item.carbs    * qty,
    fatTotal     : item.fat      * qty,
  };
};

const emptyLogs = { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] };

/* ---------- component ---------- */
const Dashboard = () => {
  /* ---------- state ---------- */
  const [userInput, setUserInput]   = useState('');
  const [meal,      setMeal]        = useState('Breakfast');
  const [logs,      setLogs]        = useState(emptyLogs);

  const [pendingItems, setPending]  = useState([]);
  const [modalOpen,    setModal]    = useState(false);

  const [loading, setLoading]       = useState(false);
  const [error,   setError]         = useState('');

  /* ---------- derived ---------- */
  const logsAreEmpty = !Object.values(logs).some(a => a.length);

  const totals = useMemo(() => {
    return Object.values(logs).flat().reduce(
      (acc, item) => ({
        calories: acc.calories + (item.caloriesTotal ?? item.calories),
        protein : acc.protein  + (item.proteinTotal  ?? item.protein ),
        carbs   : acc.carbs    + (item.carbsTotal    ?? item.carbs   ),
        fat     : acc.fat      + (item.fatTotal      ?? item.fat     ),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [logs]);

  /* ---------- handlers ---------- */
  const handleSubmit = useCallback(async () => {
    if (!userInput.trim()) return;
    try {
      setLoading(true); setError('');
      const { data } = await axios.post('/api/process-food', { text: userInput, meal });
      setPending(data); setModal(true);
    } catch {
      setError('Could not process your request. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userInput, meal]);

  const handleConfirm = () => {
    setLogs(prev => ({ ...prev, [meal]: [...prev[meal], ...pendingItems.map(scaleItem)] }));
    triggerHapticFeedback();
    setUserInput('');
    setPending([]);
    setModal(false);
  };

  /* ---------- render ---------- */
  return (
    <Container maxWidth="sm" sx={{ py: 2, pb: 10 }}>
      {/* capture zone */}
      <Box sx={{ mb: 2, position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.default', py: 1 }}>
        {/* input bar and tabs */}
        <FoodInputBar
          value={userInput}
          onChange={setUserInput}
          onSubmit={handleSubmit}
        />
        <CapsuleTabs
          value={meal}
          onChange={(_, v) => v && setMeal(v)}
          options={['Breakfast', 'Lunch', 'Dinner', 'Snacks']}
        />
      </Box>
      {/* loading and error states */}
      {loading && <CircularProgress sx={{ display: 'block', my: 4, mx: 'auto' }} />}
      {error   && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

      <ConfirmationModal
        open={modalOpen}
        items={pendingItems}
        onConfirm={handleConfirm}
        onCancel={() => { setPending([]); setModal(false); }}
      />

      {/* meal sections */}
      <Box>
        {logsAreEmpty && !loading && !error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Start by describing your meal above ⤴
          </Alert>
        )}
        <MealLog title="Breakfast" items={logs.Breakfast} />
        <MealLog title="Lunch"     items={logs.Lunch} />
        <MealLog title="Dinner"    items={logs.Dinner} />
        <MealLog title="Snacks"    items={logs.Snacks} />
      </Box>

      {/* totals insight */}
      {!logsAreEmpty && (
        <TotalsInsight totals={totals} sx={{ mt: 3, mb: 3 }} />
      )}
       

      {/* FAB */}
      <FloatingActionButton onClick={() => console.log('FAB pressed')} />
    </Container>
  );
};

export default Dashboard;