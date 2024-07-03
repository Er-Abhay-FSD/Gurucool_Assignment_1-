# Node.js API with JWT Authentication, MongoDB, and RabbitMQ

This project demonstrates a Node.js API using JWT authentication, MongoDB for data storage, and RabbitMQ for message queuing.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Example Requests](#example-requests)
- [License](#license)

## Features

- JWT-based authentication for secure API access
- MongoDB for data persistence
- RabbitMQ for message queuing and processing
- Swagger documentation for API endpoints

## Architecture

The following flowchart outlines the structure of the application:

![Flow Diagram](https://www.mermaidchart.com/raw/f50295c7-ec37-472d-97b5-387782c39bf6?theme=light&version=v0.1&format=svg)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [YAML](https://yaml.org/)

### Steps

1. Clone the repository:

    ```sh
    git clone <repository_url>
    cd <repository_name>
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add the necessary environment variables:

    ```env
    PORT=5000
    DB_URL=mongodb://localhost:27017/queue_system
    RABBITMQ_URL=amqp://localhost:5672
    JWT_SECRET=your_jwt_secret
    ```

## Configuration

Ensure your MongoDB and RabbitMQ servers are running. Update the `.env` file with your configurations.

## Running the Application

Start the server:

```sh
npm start
