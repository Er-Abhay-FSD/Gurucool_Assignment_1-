const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml'); // Path to your Swagger definition

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to authenticate requests using JWT token
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid token format' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Failed to authenticate token' });
    req.userId = decoded.userId; // Store user ID from token in request object
    next(); // Proceed to next middleware or route handler
  });
};

// Middleware to serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Example API routes
app.post('/api/queue/enqueue', authenticate, (req, res) => {
  // Enqueue logic here
  const { task } = req.body;
  const queueName = `queue_${req.userId}`;
  
  // Example response
  res.json({ message: 'Task enqueued successfully', task });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
