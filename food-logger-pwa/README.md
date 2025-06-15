# Food Logger PWA

## Overview
Food Logger PWA is a progressive web application designed to help users log and track their food consumption.

## Prerequisites
- Node.js (v16 or higher recommended)
- npm (v8 or higher recommended)

## Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd food-logger-pwa
```

### Step 2: Install Dependencies
```bash
npm install
```

## Running the Project Locally

### Step 1: Start the Backend Server
Ensure the backend server is running on `http://localhost:3001`. If you don't have the backend set up, refer to its documentation.

### Step 2: Start the Frontend
```bash
npm start
```
This will start the development server and open the application in your default browser at `http://localhost:3000`.

## Building for Production
To create a production build:
```bash
npm run build
```
The build artifacts will be stored in the `build/` directory.

## Testing
Run the test suite:
```bash
npm test
```

## Proxy Configuration
The frontend is configured to proxy API requests to `http://localhost:3001`. Update the `proxy` field in `package.json` if needed.

## Additional Notes
- Ensure CORS is properly configured on the backend for smooth API communication.
- For more details, refer to the official documentation of the dependencies listed in `package.json`.
