const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs'); // Correct import statement for YAML
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const { processQueue } = require('./worker');
require('dotenv').config();

// Suppress deprecation warnings (use with caution, better to update dependencies)
process.noDeprecation = true; // To suppress all deprecation warnings
process.env.NODE_NO_WARNINGS = '1'; // To suppress all warnings

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/queue_system';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

// Middleware
app.use(bodyParser.json());

// Load YAML file
const swaggerDocument = YAML.load('./swagger.yml'); // Adjust path as per your file location

// Swagger setup
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js API with Swagger',
      description: 'Documentation for Node.js API with MongoDB and RabbitMQ',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
        description: 'Local development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes files
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Use swaggerDocument directly

// MongoDB connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('🌟 MongoDB connected');

    // RabbitMQ connection and process queue
    return amqp.connect(RABBITMQ_URL);
  })
  .then((connection) => {
    console.log('🐇 RabbitMQ connected');

    // Start consuming messages from queue
    processQueue(connection);

    // Start the server after MongoDB and RabbitMQ connection are successful
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Connection error:', err);
    process.exit(1); // Exit process on connection error
  });

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err, promise) => {
  console.error(`⚠️ Unhandled Rejection at: ${promise}\n`, err);
  closeConnections();
});

// Function to close all connections (MongoDB, RabbitMQ, etc.)
const closeConnections = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed');
    process.exit(0); // Exit process successfully
  } catch (err) {
    console.error('❌ Error closing MongoDB connection:', err);
    process.exit(1); // Exit process with error
  }
};

// Close MongoDB connection on process termination
process.on('SIGINT', () => {
  console.log('Received SIGINT. Closing connections...');
  closeConnections();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Closing connections...');
  closeConnections();
});

// API routes
app.use('/api/users', require('./routes/user'));
app.use('/api/queue', require('./routes/queue'));

module.exports = app; // Export app for testing purposes or further modularization
