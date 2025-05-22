import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  FormControlLabel, 
  Checkbox,
  Stack
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TodoForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: null,
    important: false
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    
    onSubmit({
      title: form.title,
      description: form.description,
      dueDate: form.dueDate,
      important: form.important
    });
    
    setForm({
      title: '',
      description: '',
      dueDate: null,
      important: false
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            variant="outlined"
          />
          
          <DateTimePicker
            label="Due Date"
            value={form.dueDate}
            onChange={(date) => setForm({...form, dueDate: date})}
            renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={form.important}
                onChange={handleChange}
                name="important"
                color="primary"
              />
            }
            label="Important Task"
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            fullWidth
          >
            Add Task
          </Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};

export default TodoForm;