#!/bin/zsh

# This script sets up the server directory for the food logger app.
# Run it from the root of your project folder.

echo "Creating server directory..."
mkdir -p server

echo "Moving server.js to server/server.js"
# This command will move the existing server.js to the new directory.
# If server.js doesn't exist in the root, it will show an error but continue.
mv server.js server/server.js 2>/dev/null || touch server/server.js

echo "Moving .env to server/.env"
# This will move the existing .env file if it exists.
mv .env server/.env 2>/dev/null || touch server/.env

echo "Creating a separate package.json for the server..."
# Use cd and && to ensure commands run in the correct directory
(cd server && npm init -y && npm install express cors axios dotenv)

echo "Server setup complete."
echo "Your new project structure is ready."
