# Task Management REST API

A fully functional Task Management REST API built with Node.js, Express, and SQLite.

##  Features Implemented
This API successfully implements all requested features:
- **CRUD Operations:** Complete endpoints for managing tasks (GET, POST, PUT, PATCH, DELETE).
- **Request Validation:** Strict body payload validation before database execution.
- **Error Handling:** Centralized error handling for unexpected server issues.
- **Appropriate HTTP Status Codes:** Returns standard codes (`200`, `201`, `400`, `404`, `500`) based on the operation result.
- **Basic Logging:** Logs every incoming HTTP request method and URL with a timestamp.
- **Persistent Data Storage:** Utilizes SQLite as a local persistent database.

##  Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3

##  Project Structure
```text
task-management-api/
├── config/
│   └── database.js      # SQLite connection & table creation
├── server.js            # Entry point, Routes, Validation, & Logging
├── package.json         # Dependencies
├── .gitignore           # Ignored files (node_modules, .sqlite)
└── README.md            # Project documentation
```

## Setup & Installation

1. Clone the repository
```bash
git clone <https://github.com/Abigailoby/task-management-api.git>
```

2. Install dependencies
```bash
npm install
```

3. Run the server
```bash
npm start
```

4. Test the API
```bash
# GET all tasks
curl http://localhost:5000/api/tasks

# GET task by ID
curl http://localhost:5000/api/tasks/1

# Create a new task
curl -X POST http://localhost:5000/api/tasks \
-H "Content-Type: application/json" \
-d '{"title": "Task 1", "description": "Description 1", "status": "pending", "priority": "medium"}'

# Update a task
curl -X PUT http://localhost:5000/api/tasks/1 \
-H "Content-Type: application/json" \
-d '{"title": "Task 1 Updated", "description": "Description 1 Updated", "status": "in-progress", "priority": "high"}'

# Update task status only
curl -X PATCH http://localhost:5000/api/tasks/1/status \
-H "Content-Type: application/json" \
-d '{"status": "completed"}'

# Delete a task
curl -X DELETE http://localhost:5000/api/tasks/1