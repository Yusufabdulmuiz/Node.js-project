const express = require('express');
const process = require('process');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// A simple root endpoint to show the API is working
app.get('/', (req, res) => {
  res.send(
    `Hello from the server! This request was handled by worker process: ${process.pid}`
  );
});

// A health check endpoint
app.get('/api/health', (req, res) => {
  const healthInfo = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    processId: process.pid, // Shows which worker handled the request
  };
  res.status(200).json(healthInfo);
});

// A simple endpoint to simulate a CPU-intensive task
app.get('/api/heavy', (req, res) => {
  let total = 0;
  for (let i = 0; i < 50_000_000; i++) {
    total++;
  }
  res.send(
    `Heavy task complete. Handled by worker ${process.pid}. Result: ${total}`
  );
});

// Start the server
app.listen(PORT, () => {
  // This message will be logged by each worker process
  console.log(
    `Server is listening on port ${PORT}. Worker process ID: ${process.pid}`
  );
});
