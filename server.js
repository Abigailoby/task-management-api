const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

// Basic Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

//  Validation Helper
const validateTask = (data, isUpdate = false) => {
    const errors = [];
    const validStatuses = ['pending', 'in-progress', 'completed'];
    const validPriorities = ['low', 'medium', 'high'];

    if (!isUpdate && !data.title) errors.push('Title is required');
    if (data.title && typeof data.title !== 'string') errors.push('Title must be a string');
    if (data.status && !validStatuses.includes(data.status)) errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    if (data.priority && !validPriorities.includes(data.priority)) errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);

    return errors;
}

// Get All Task
app.get('/api/tasks', (req, res, next) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ error: 'Failed to fetch tasks' })
        }
        res.status(200).json({ success: true, data: rows });
    });
});

// Get Task by Id
app.get('/api/tasks/:id', (req, res, next) => {
    const { id } = req.params;
    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error fetching task:', err);
            return res.status(500).json({ error: 'Failed to fetch task' })
        }
        if (!row) {
            return res.status(404).json({ success: false, error: 'Task not found' })
        }
        res.status(200).json({ success: true, data: row });
    });
});

// Post create new task
app.post('/api/tasks', (req, res, next) => {
    const { title, description, status, priority } = req.body;
    const errors = validateTask(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    const now = new Date().toISOString();
    const sql = `INSERT INTO tasks (title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(sql, [title, description, status, priority, now, now], function (err) {
        if (err) {
            console.error('Error creating task:', err);
            return res.status(500).json({ success: false, error: 'Failed to create task' })
        }
        res.status(201).json({ success: true, message: "Task created successfully", data: { id: this.lastID, title, description, status, priority, createdAt: now, updatedAt: now } });
    });
});

// Put update task
app.put('/api/tasks/:id', (req, res, next) => {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    const errors = validateTask(req.body, true);
    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    const now = new Date().toISOString();
    const sql = `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, updatedAt = ? WHERE id = ?`;

    db.run(sql, [title, description, status, priority, now, id], function (err) {
        if (err) {
            console.error('Error updating task:', err);
            return res.status(500).json({ success: false, error: 'Failed to update task' })
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.status(200).json({ success: true, message: "Task updated successfully", data: { id, title, description, status, priority, updatedAt: now } });
    });
});

// Patch Update Task Status Only
app.patch('/api/tasks/:id/status', (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;
    const errors = validateTask({ status }, true);
    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    const now = new Date().toISOString();
    const sql = `UPDATE tasks SET status = ?, updatedAt = ? WHERE id = ?`;

    db.run(sql, [status, now, id], function (err) {
        if (err) {
            console.error('Error updating task status:', err);
            return res.status(500).json({ success: false, error: 'Failed to update task status' })
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.status(200).json({ success: true, message: "Task status updated successfully", data: { id, status, updatedAt: now } });
    });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res, next) => {
    const { id } = req.params;
    const sql = `DELETE FROM tasks WHERE id = ?`;

    db.run(sql, [id], function (err) {
        if (err) {
            console.error('Error deleting task:', err);
            return res.status(500).json({ success: false, error: 'Failed to delete task' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    });
});

// Unexpected Error Handling
app.use((err, req, res, next) => {
    console.error("Unexpected Error: ", err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});