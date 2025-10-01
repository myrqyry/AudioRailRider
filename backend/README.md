# AudioRailRider Backend

This is the backend for the AudioRailRider project, built with FastAPI and Poetry.

## Setup

1. Install dependencies:
   ```
   poetry install
   ```

2. Run the server:
   ```
   poetry run python main.py
   ```
   Or:
   ```
   poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API

- `GET /`: Health check endpoint.