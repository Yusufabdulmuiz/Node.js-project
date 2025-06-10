const cluster = require('cluster');
const os = require('os');
const process = require('process');

// Get the number of CPU cores available on the machine
const numCPUs = os.cpus().length;

// Check if the current process is the primary (master) process
if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);
  console.log(`Forking server for ${numCPUs} CPUs`);

  // Create a worker process for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // If a worker process dies, log it and create a new one to replace it
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
    cluster.fork();
  });
} else {
  // If this is a worker process, it should run the Express app
  // Each worker will run this part of the code independently
  console.log(`Worker ${process.pid} started`);
  require('./app.js');
}
