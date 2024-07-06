# EMS (Energy Management System) Server

## Overview

The EMS Server is a backend system designed to manage household energy management using Node.js and MongoDB. It provides APIs for user management, device management, and personal account management.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
  - [User Management](#user-management)
  - [Device Management](#device-management)
  - [Account Management](#account-management)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Management
  - User registration and authentication
  - User role management (e.g., admin, user)
- Device Management
  - Add, update, and delete devices
  - Device status monitoring
- Personal Account Management
  - View and update personal information
  - Manage account settings

## Technologies

- [Node.js](https://nodejs.org/) 16.20.2
- [MongoDB](https://www.mongodb.com/) 6.0
- [Express.js](https://expressjs.com/)

## Requirements

- Node.js 16.20.2
- MongoDB 6.0

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/ems-server.git
    cd ems-server
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=3500
    MONGODB_URI=mongodb://localhost:27017/ems
    JWT_SECRET=your_secret_key
    ```

4. Start the server:
    ```sh
    npm start
    ```

## Usage

The server will be running on `http://localhost:3500`. You can test the API endpoints using tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/).

## API Documentation

### User Management

#### Register User
- **Endpoint:** `POST /api/users/register`
- **Description:** Register a new user
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string",
    "role": "string"
  }
