import React from 'react';
import { motion } from 'framer-motion';
import { 
  Checkbox, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton,
  Typography,
  Chip
} from '@mui/material';
import { Delete, Notifications, Edit } from '@mui/icons-material';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <ListItem
        sx={{
          mb: 1,
          borderRadius: 1,
          boxShadow: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 3,
          }
        }}
      >
        <Checkbox
          checked={todo.completed}
          onChange={() => onToggle(todo._id, todo.completed)}
          color="primary"
        />
        <ListItemText
          primary={
            <Typography
              variant="body1"
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.secondary' : 'text.primary'
              }}
            >
              {todo.title}
            </Typography>
          }
          secondary={
            <>
              {todo.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {todo.description}
                </Typography>
              )}
              {todo.dueDate && (
                <Chip
                  label={`Due: ${new Date(todo.dueDate).toLocaleString()}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              )}
            </>
          }
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" color="primary">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            edge="end"
            onClick={() => onDelete(todo._id)}
            color="error"
          >
            <Delete fontSize="small" />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </motion.div>
  );
};

export default TodoItem;