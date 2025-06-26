# Food Tracker Application

## Overview
The Food Tracker application helps users log their meals and provides nutritional information using AI-powered parsing.

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)

### Installation

#### Clone or Download the Repository
```bash
git clone https://github.com/your-repo/food-tracker.git
cd food-tracker
```
Or download and extract the ZIP file from the repository.

#### Install Dependencies
1. **React Frontend**
   ```bash
   cd food-logger-pwa
   npm install
   ```

2. **Server**
   ```bash
   cd server
   npm install
   ```

### Configuration

#### Set Up Environment Variables
1. Create a `.env` file in the `server` directory:
   ```bash
   touch server/.env
   ```

2. Add the following to the `.env` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Replace `your_gemini_api_key_here` with your actual Gemini API key from Google.

---

## Running the Application

### Start the Backend Server
1. Open a terminal window and navigate to the `server` directory:
   ```bash
   cd server
   npm start
   ```
   You should see: `Server listening at http://localhost:3001`

### Start the React Frontend
1. Open another terminal window and navigate to the `food-logger-pwa` directory:
   ```bash
   cd food-logger-pwa
   npm start
   ```
   This will open the application in your default browser at `http://localhost:3000`.

---

## Usage
1. Enter what you ate in the text field (e.g., "2 aloo paratha and green chutney").
2. Select the meal type (Breakfast, Lunch, Dinner, or Snacks).
3. Click the "Log Food" button to add your meal.
4. View and manage your food entries in the list below.

---

## Troubleshooting

### Common Issues
- **CORS Issues**: Ensure that the server is running and the correct proxy is set in `package.json`.
- **Gemini API Failures**: Check that your API key is valid and correctly set in the `.env` file.
- **Server Startup Issues**: Check for any conflicting applications using port `3001`.

---

## Technologies Used
- **Frontend**: React, Material UI
- **Backend**: Express.js
- **AI**: Google Gemini API for food parsing and nutritional information

---

## License
This project is licensed under the [MIT License](LICENSE).