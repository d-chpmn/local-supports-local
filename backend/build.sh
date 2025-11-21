#!/usr/bin/env bash
# Build script for Render

set -o errexit  # Exit on error

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running database migrations..."
python migrate_database.py

echo "Build complete!"
