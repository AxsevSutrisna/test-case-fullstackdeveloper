# Makefile for Payment Gateway Test Case

# Variables
DB_NAME=test-case-fullstack
DB_USER=root
DB_PASSWORD=

.PHONY: setup run-backend run-frontend run-all clean

# Install all dependencies
setup:
	@echo "Installing backend dependencies..."
	cd backend && go mod tidy
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Run backend server
run-backend:
	@echo "Starting backend server on http://localhost:8080..."
	cd backend && go run main.go

# Run frontend server
run-frontend:
	@echo "Starting frontend dev server..."
	cd frontend && npm run dev

# Helper to run both concurrently (requires make on windows with parallel support or run separately)
# For Windows, we recommend running backend and frontend in separate terminals.
run-all:
	@echo "Untuk Windows, sangat direkomendasikan menjalankan 'make run-backend' dan 'make run-frontend' di dua terminal yang berbeda."
