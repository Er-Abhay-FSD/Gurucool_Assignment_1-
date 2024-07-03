const amqp = require('amqplib');
const mongoose = require('mongoose');
const TaskLog = require('./models/TaskLog');
const User = require('./models/User');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/queue_system';

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Worker connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const processQueue = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    await channel.prefetch(1);

    const userQueues = await User.find({}, '_id');
    const queues = userQueues.map(user => `queue_${user._id}`);

    for (const queueName of queues) {
      await channel.assertQueue(queueName, { durable: true });

      console.log(`Worker is consuming messages from queue: ${queueName}`);

      channel.consume(queueName, async (msg) => {
        if (msg !== null) {
          const task = JSON.parse(msg.content.toString());
          console.log('Processing task:', task);

          // Simulate task processing
          await new Promise(resolve => setTimeout(resolve, 1000));

          const newLog = new TaskLog({ userId: queueName.split('_')[1], task });
          await newLog.save();

          channel.ack(msg);
        }
      });
    }
  } catch (err) {
    console.error('Error in processQueue:', err);
    // Handle reconnection or other recovery logic here
  }
};

module.exports = { processQueue };
