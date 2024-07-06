# EMS (Energy Management System) Server

## Overview

The EMS Server is a backend system designed to manage household energy management using Node.js and MongoDB. It provides APIs for user management, device management, and personal account management.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Management

- Device Management

- Personal Account Management

- Manage energy usage

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
   git clone https://github.com/NguyenVinhKhang/EMS_SERVER
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
