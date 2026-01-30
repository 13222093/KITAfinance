#!/bin/sh
set -e

# Navigate to the script's directory (backend/)
cd "$(dirname "$0")"

echo "Starting Database Setup..."

# Generate Client (safety check)
echo "Generating Prisma Client..."
npx prisma generate

# Push Schema (using db push since we rely on init.sql + schema.prisma sync)
echo "Syncing Database Schema..."
npx prisma db push --accept-data-loss

# Run Seeding
echo "Seeding Database..."
npx tsx prisma/seed.ts

echo "Database ready with Admin account supplied!"
