#!/bin/bash

# Navigate to the project directory
cd /Users/yechanshon/Desktop/shonz_vibe/nandok/defix-dyslexia-app

echo "Starting auto-sync for defix-dyslexia-app..."
echo "Checking for updates every 5 minutes."
echo "Output will be logged to auto_sync.log"

while true; do
  echo "--- Syncing at $(date) ---" >> auto_sync.log
  git pull >> auto_sync.log 2>&1
  sleep 300
done
